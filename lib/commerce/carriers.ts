import 'server-only'

import { createAdminClient } from '@/lib/supabase/admin'
import type { MarketCode } from './markets-config'
import { commerceDatabase, commerceFail, commerceOk, type CommerceResult } from './errors'

export type ParcelCarrier = 'omniva' | 'dpd'

export interface ParcelStation {
  id: string
  carrier: ParcelCarrier
  externalId: string
  name: string
  address: string
  city: string
  postalCode: string | null
  latitude: number | null
  longitude: number | null
}

export async function listParcelStations(
  marketCode: MarketCode,
  carrier?: ParcelCarrier
): Promise<CommerceResult<ParcelStation[]>> {
  const supabase = createAdminClient()
  let query = supabase
    .from('parcel_stations')
    .select(
      'id, carrier, external_id, name, address, city, postal_code, latitude, longitude, markets!inner ( code )'
    )
    .eq('markets.code', marketCode)
    .eq('is_active', true)
    .order('city', { ascending: true })

  if (carrier) {
    query = query.eq('carrier', carrier)
  }

  const { data, error } = await query

  if (error) {
    return commerceFail(commerceDatabase('Failed to list parcel stations', error))
  }

  return commerceOk(
    (data ?? []).map((row) => ({
      id: row.id,
      carrier: row.carrier as ParcelCarrier,
      externalId: row.external_id,
      name: row.name,
      address: row.address,
      city: row.city,
      postalCode: row.postal_code,
      latitude: row.latitude != null ? Number(row.latitude) : null,
      longitude: row.longitude != null ? Number(row.longitude) : null,
    }))
  )
}