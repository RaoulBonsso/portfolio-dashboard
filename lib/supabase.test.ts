import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Ces tests gardent une propriété qui ne se voit pas en lisant le code :
 * importer ce module ne doit RIEN construire.
 *
 * La version précédente appelait createClient au chargement du module.
 * Next.js importe ce fichier pendant le prérendu de /dashboard/analytics,
 * à un moment où aucune variable d'environnement n'est présente — et
 * createClient rejette une URL vide. La compilation échouait donc, sans
 * qu'aucun test ne l'attrape puisqu'il n'y en avait aucun.
 *
 * Le piège est facile à retomber dedans : `export const supabase =
 * createClient(...)` se lit très bien. D'où ces tests, qui échouent au
 * premier retour en arrière.
 */

const URL_VALIDE = "https://exemple.supabase.co";
const CLE_VALIDE = "cle-anonyme-de-test";

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("sans configuration", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
  });

  it("s'importe sans lever — c'est la régression qui cassait la compilation", async () => {
    await expect(import("./supabase")).resolves.toBeDefined();
  });

  it("se déclare non configuré", async () => {
    const { isSupabaseConfigured } = await import("./supabase");
    expect(isSupabaseConfigured).toBe(false);
  });

  it("ne lève qu'au moment où on se sert vraiment du client", async () => {
    const { supabase } = await import("./supabase");
    // L'objet existe ; c'est l'accès à une propriété qui déclenche.
    expect(supabase).toBeDefined();
    expect(() => supabase.auth).toThrow(/n'est pas configuré/);
  });

  it("nomme les variables manquantes dans le message d'erreur", async () => {
    const { supabase } = await import("./supabase");
    expect(() => supabase.from).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
    expect(() => supabase.from).toThrow(/NEXT_PUBLIC_SUPABASE_ANON_KEY/);
  });
});

describe("avec une configuration partielle", () => {
  it("refuse une URL sans clé", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", URL_VALIDE);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "");
    const { isSupabaseConfigured } = await import("./supabase");
    expect(isSupabaseConfigured).toBe(false);
  });

  it("refuse une clé sans URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", CLE_VALIDE);
    const { isSupabaseConfigured } = await import("./supabase");
    expect(isSupabaseConfigured).toBe(false);
  });
});

describe("avec une configuration complète", () => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", URL_VALIDE);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", CLE_VALIDE);
  });

  it("se déclare configuré", async () => {
    const { isSupabaseConfigured } = await import("./supabase");
    expect(isSupabaseConfigured).toBe(true);
  });

  it("donne accès aux sous-modules du client", async () => {
    const { supabase } = await import("./supabase");
    expect(supabase.auth).toBeDefined();
    expect(typeof supabase.from).toBe("function");
    expect(supabase.storage).toBeDefined();
  });

  it("ne construit le client qu'une fois, quel que soit le nombre d'accès", async () => {
    const { supabase } = await import("./supabase");
    // Deux accès successifs doivent viser la même instance sous-jacente :
    // en reconstruire une à chaque accès casserait la session d'auth.
    expect(supabase.auth).toBe(supabase.auth);
  });
});
