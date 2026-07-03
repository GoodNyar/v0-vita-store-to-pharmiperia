import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // PR-14 draft: enforce commerce strangler — direct Supabase client only in lib/.
  // Toggle `error` → `warn` or remove block until all call-sites migrate (see ADR/blueprint).
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['lib/**', '**/lib/**'],
    rules: {
      'no-restricted-imports': [
        'warn',
        {
          paths: [
            {
              name: '@/lib/supabase/client',
              message:
                'Import Supabase via lib/commerce or server helpers — not directly from app/components (Phase 2 strangler).',
            },
          ],
        },
      ],
    },
  },
])

export default eslintConfig