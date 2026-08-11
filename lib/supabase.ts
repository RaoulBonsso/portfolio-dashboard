import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase n'est pas configuré : renseigner NEXT_PUBLIC_SUPABASE_URL et " +
        'NEXT_PUBLIC_SUPABASE_ANON_KEY.',
    )
  }
  client ??= createClient(supabaseUrl, supabaseAnonKey)
  return client
}

/**
 * Le client n'est construit qu'au premier accès à l'une de ses propriétés.
 *
 * Le construire au chargement du module faisait échouer la compilation :
 * le prérendu de /dashboard/analytics importe ce fichier sans que les
 * variables d'environnement soient présentes, et createClient rejette une
 * URL vide. Les appels réels ont tous lieu dans le navigateur — l'accès
 * paresseux repousse donc la construction au moment où la configuration
 * existe, sans rien changer aux points d'appel.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver)
  },
})
