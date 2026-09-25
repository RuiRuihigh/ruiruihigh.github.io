# Shared-link analytics

Private dashboard: https://mingrui-link-analytics.mingrui-link-analytics.workers.dev/admin

Create a recipient label and choose a page, then send the generated URL. Labels never appear in the public URL or site repository. A referral code identifies the shared link, not a verified person. Forwarded links retain the same attribution. Counts represent page-view events, not unique visitors.

## Data and controls

- Only attributed sessions are counted, after approximately five visible seconds.
- A random tab-session identifier expires after 30 minutes of inactivity. The backend stores only its keyed hash, page, referral code and timestamp.
- Unique database constraint deduplicates a session/page within each 30-minute clock interval.
- No IP, raw user agent, fingerprint, location or external browsing history is stored by this application.
- Common preview bots are filtered; bots can still spoof requests. Browser privacy signals, blockers and opt-out can suppress records.
- Events expire after 90 days, deleted daily. Labels remain until explicitly removed by the owner.
- Admin API requires a signed, secure HttpOnly session cookie; mutation origins are checked. The random admin key is a Cloudflare secret, never a frontend variable.
- 20 login attempts per five-minute interval (global), maximum 1,000 share links.
- Public privacy information and browser opt-out: https://ruiruihigh.github.io/privacy/

## Operations

Use Wrangler 4.140.0. From this directory:

```
wrangler d1 migrations apply mingrui-link-analytics --remote
wrangler deploy
wrangler secret put ADMIN_SECRET
node --test test/*.test.mjs
```

`ADMIN_SECRET` must be a high-entropy random value of at least 32 characters. Rotating it invalidates existing admin sessions. Local key material is excluded via `analytics/secrets/` in `.gitignore`. Keep a private backup in a password manager.

The public portfolio remains hosted on GitHub Pages. No paid subscription was enabled for this feature. Cloudflare account plan limits apply; request logging is disabled for this Worker. Hosting providers may still process technical request data.
