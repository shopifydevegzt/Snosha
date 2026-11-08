/* =========================================================================
   SNOSHA — PROJECT SCRIPTS
   Home for Snosha-specific JavaScript (Horizon v4.4.0).

   Not loaded yet: no Snosha section currently needs JavaScript (the hero and
   trust strip are pure HTML/CSS). When behavior is genuinely required:
   - add it here as an isolated, idempotent module (custom element extending
     Component from '@theme/component', or a guarded initializer);
   - register it once in snippets/scripts.liquid's import map / module list,
     following Horizon's existing loading convention;
   - support Theme Editor events (shopify:section:load / unload) and clean up
     listeners and observers.
   Do not move or rewrite Horizon's own modules here.
   ========================================================================= */
