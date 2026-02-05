import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Важно для GitHub Pages: если переменные не вшились на build-этапе,
  // Supabase начнет бить запросы на текущий домен (например, /auth/v1/signup),
  // что выглядит как net::ERR_* в Network.
  if (!url || !anonKey) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
        'Check GitHub Actions secrets and rebuild.'
    )
  }

  return createBrowserClient(
    url,
    anonKey
  )
}
