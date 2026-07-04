import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import { validateFeedRow } from './feed-import-validation'

export { validateFeedRow } from './feed-import-validation'

export type FeedImportBatchStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface FeedImportRowInput {
  externalId: string
  payload: Record<string, unknown>
}

export interface FeedImportBatchSummary {
  id: string
  source: string
  status: FeedImportBatchStatus
  rowCount: number
  validCount: number
  invalidCount: number
}

export async function createFeedImportBatch(
  source: string,
  rows: FeedImportRowInput[]
): Promise<FeedImportBatchSummary> {
  const supabase = createAdminClient()

  const { data: batch, error: batchError } = await supabase
    .from('feed_import_batches')
    .insert({ source, status: 'processing', row_count: rows.length })
    .select('id, source, status, row_count')
    .single()

  if (batchError || !batch) {
    throw new Error(`Failed to create feed batch: ${batchError?.message ?? 'unknown'}`)
  }

  let validCount = 0
  let invalidCount = 0

  for (const row of rows) {
    const errors = validateFeedRow(row.payload)
    const status = errors.length === 0 ? 'valid' : 'invalid'
    if (status === 'valid') validCount += 1
    else invalidCount += 1

    const { error: rowError } = await supabase.from('feed_import_rows').insert({
      batch_id: batch.id,
      external_id: row.externalId,
      raw_payload: row.payload,
      validation_status: status,
      validation_errors: errors.length > 0 ? errors : null,
    })

    if (rowError) {
      await supabase
        .from('feed_import_batches')
        .update({ status: 'failed', error_message: rowError.message, completed_at: new Date().toISOString() })
        .eq('id', batch.id)
      throw new Error(`Failed to insert feed row: ${rowError.message}`)
    }
  }

  const finalStatus: FeedImportBatchStatus =
    invalidCount > 0 && validCount === 0 ? 'failed' : 'completed'

  await supabase
    .from('feed_import_batches')
    .update({
      status: finalStatus,
      completed_at: new Date().toISOString(),
      error_message: invalidCount > 0 ? `${invalidCount} invalid rows` : null,
    })
    .eq('id', batch.id)

  return {
    id: batch.id,
    source: batch.source,
    status: finalStatus,
    rowCount: batch.row_count,
    validCount,
    invalidCount,
  }
}

export async function listPendingFeedBatches(limit = 10): Promise<FeedImportBatchSummary[]> {
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('feed_import_batches')
    .select('id, source, status, row_count')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to list feed batches: ${error.message}`)
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    source: row.source,
    status: row.status as FeedImportBatchStatus,
    rowCount: row.row_count,
    validCount: 0,
    invalidCount: 0,
  }))
}