// Ambient augmentation of OpenNext's global CloudflareEnv (which already declares
// ASSETS/IMAGES/cache bindings). We add only the two bindings the contact route
// uses. Both are OPTIONAL so a preview/misconfigured environment (DB unbound)
// still type-checks and the route degrades honestly to { persisted: false }.
/// <reference types="@cloudflare/workers-types" />

declare global {
  interface CloudflareEnv {
    /** D1 database holding submitted leads (bound as `DB`). Optional by design. */
    DB?: D1Database;
    /** Cloudflare Turnstile secret key. Set as a Worker secret / in .dev.vars. */
    TURNSTILE_SECRET?: string;
  }
}

export {};
