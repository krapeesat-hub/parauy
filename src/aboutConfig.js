import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const CACHE_KEY = "parauy:about-config-cache";

/**
 * Read-only fetch of the global About/Donate config.
 * - Returns the live row from Supabase when online and reachable.
 * - Falls back to the last successfully cached copy (localStorage) when
 *   offline or Supabase isn't configured — the main app is local-only
 *   for user data, so this must never block or crash without a network.
 * - Returns null if there is neither a live value nor a cached one yet,
 *   letting the caller fall back to the bundled DONATE_INFO default.
 */
export async function fetchAboutConfig() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("about_config")
        .select("developer_name, about_text, promptpay, donate_link")
        .eq("id", 1)
        .single();
      if (!error && data) {
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch (e) {}
        return data;
      }
    } catch (e) {
      // offline or unreachable — fall through to cache
    }
  }
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {}
  return null;
}
