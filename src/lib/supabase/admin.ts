import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

// Service role client for server-side operations (webhooks, admin tasks)
// NEVER expose this on the client side
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
