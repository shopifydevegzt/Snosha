# SNOSHA — Technical SEO Audit

Date: 2026-11-20 · Theme: dev `168066810072` (local `main`, uncommitted) · Live theme untouched.
Pages: home, product (N2 pink via `/products/snosha-f1` redirect), F1 view, bundle, collection `best-seller`, search, page `about-us`, page `faq`, blog `news`, one article — each AR (default) and EN (`/en`).
Tools: Lighthouse 12.2.1 (mobile + desktop), server-HTML head parser, offline reproduction of Lighthouse's link-text audit over every sitemap URL.

## 1. Why SEO was 92

The **only** failing SEO audit at 92 was **`meta-description`** (document has no meta description), on:

- the bundle product (`باندل-snosha`), AR + EN — the product has no SEO description and no description text;
- the collection `/collections/best-seller`, AR + EN — no collection description or SEO description;
- the blog `/blogs/news`, AR + EN — no blog SEO description.

Cause in the theme: `snippets/meta-tags.liquid` printed `<meta name="description">` only `{% if page_description %}`, with no fallback (unlike `og:description`, which falls back to `shop.description`).

### "Links do not have descriptive text (3 links)"

**Not reproducible** on the current theme:

- 0 failures in all 36 baseline Lighthouse runs;
- offline reproduction of Lighthouse's exact blocklist over 52 server-rendered URLs (26 sitemap paths × AR/EN, plus cart, search and 404): 0 matches.

The audit matches exact link text ("read more", "click here", "learn more", "more", "here"…; no Arabic entries), so the screenshot most likely came from an earlier state of a page (e.g. the stock blog "Read more…" card, `blocks/_blog-post-description.liquid`, which the Snosha blog no longer uses) or from another URL. If it reappears, run Lighthouse on that exact URL; the report lists the three link nodes.

Related, not failing the audit: the WhatsApp button (app markup) has `aria-label="whatsapp-btn"`; the password page has an icon-only link to `//shopify.com`.

## 2. Fix (theme)

`snippets/meta-tags.liquid`: meta description fallback, in this order:

1. `page_description` (merchant SEO description, or Shopify's resource-derived description) — unchanged, always wins;
2. on collections: the collection description, stripped and truncated to 160 characters;
3. `shop.description` (Admin → Online Store → Preferences), the same fallback `og:description` already used.

No hidden text and no keywords added. Verified: bundle, collection and blog now render a description in AR and EN (EN uses the translated store description).

Pre-push review (2026-11-20):
- **Merchant descriptions untouched.** `snosha-n2` (merchant SEO description) and all product/page/article descriptions render exactly as before.
- **Head comparison.** Re-parsing the head of 10 page types × AR/EN shows exactly **6 fields** changed: the 6 previously missing descriptions. Title, canonical, robots, hreflang, OG and JSON-LD are identical.
- **Collection branch.** Strips HTML, decodes `&nbsp;`/`&amp;` (otherwise double-encoded by `escape`), trims, and truncates to 160. No store collection has a description today, so this branch is not exercised by real data.
- **Lengths.** The fallback is 158 (AR) / 162 (EN) characters.
- **Not unique.** The fallback is the same text as the homepage description. Valid, but not unique: merchant action 1 below.

## 3. Technical SEO checklist (rendered HTML)

| Check | Result |
|---|---|
| `<html lang/dir>` | `ar`/`rtl` on default, `en`/`ltr` on `/en` ✔ |
| Viewport meta | present everywhere ✔ |
| Canonical | present, self-referencing, locale-specific (`/en/...` on EN) ✔ |
| hreflang | `x-default`, `ar`, `en` on every page ✔ |
| robots | indexable everywhere except search (`noindex, follow`, intentional) ✔ |
| robots.txt / sitemap.xml | 200 (Shopify-managed) ✔ |
| H1 | exactly one per page; search has none (Horizon default) |
| Structured data | Organization (all); Product + BreadcrumbList (products); BreadcrumbList (collection, blog); Article (article); FAQPage (`/pages/faq` only) — all valid JSON ✔ |
| Open Graph / Twitter | title, description, url, type, image ✔ (`og:image` is absolute in production; only the dev proxy shows it relative) |
| Link text (Lighthouse) | 0 failures ✔ |
| Image `alt` | Lighthouse `image-alt` passes; the bundle "why" image has `alt=""` (merchant: add alt text in Files) |

## 4. Lighthouse SEO (before → after)

One run per cell, 36 runs before and 36 after, same conditions (Edge headless, `theme dev` proxy).

| Page | AR mobile | AR desktop | EN mobile | EN desktop |
|---|---|---|---|---|
| home | 100 → **100** | 100 → **100** | 100 → **100** | 100 → **100** |
| product | 100 → **100** | 100 → **100** | 100 → **100** | 100 → **100** |
| f1 | 100 → **100** | 100 → **100** | 100 → **100** | 100 → **100** |
| bundle | 92 → **100** | 92 → **100** | 92 → **100** | 92 → **100** |
| collection | 92 → **100** | 85 → **100** | 92 → **100** | 92 → **100** |
| search | 69 → 69 | 69 → 69 | 69 → 69 | 69 → 69 |
| page | 100 → **100** | 100 → **100** | 100 → **100** | 100 → 92 * |
| blog | 92 → **100** | 92 → **100** | 92 → **100** | 92 → **100** |
| article | 100 → **100** | 100 → **100** | 100 → **100** | 100 → **100** |

\* `robots-txt` flake: Lighthouse intermittently fails to fetch `/robots.txt` through the local proxy. It also hit 1 baseline run (collection AR desktop, 85) and 2 of 12 extra median runs; in 3 reruns `page-en-desktop` scored 100 / 100 / 100. `/robots.txt` returns 200. It is a local measurement artefact, not a site issue.

`meta-description` failures: **12 → 0**. `link-text` failures: **0 → 0**.

Search stays at **69** by design: `is-crawlable` fails because Shopify serves search with `noindex, follow`, which is correct for internal search results and should not be changed.

## 5. Merchant actions (content, not theme)

1. Write SEO descriptions for the bundle product, collections and blog (Admin → each resource → *Search engine listing*); the theme fallback then stops being used on those pages. The fallback is the same store description on several pages, which is valid but not unique.
2. Titles carry the brand twice, e.g. home "سنوشا – سنوشا | SNOSHA", products "… | SNOSHA سنوشا – سنوشا | SNOSHA". The theme appends `– {shop name}` unless the title already contains the exact shop name ("سنوشا | SNOSHA"). Fix by removing the brand from the SEO titles (or setting the homepage title to the exact shop name).
3. Article descriptions are short (56 / 71 characters). Add an excerpt or SEO description (~140–160 characters).
4. Create the `customer-account-main-menu` menu (console error on every page; Best Practices, not SEO).
5. WhatsApp app button: `aria-label="whatsapp-btn"` → descriptive text (app setting).

## 6. Not changed

Existing titles, canonical, hreflang, JSON-LD and the search `noindex` are left as they were. No locale files were touched.
