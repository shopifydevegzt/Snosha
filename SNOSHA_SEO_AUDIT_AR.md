# SNOSHA — Arabic-Only Technical SEO Audit (read-only)

Date: 2026-11-17 · Theme: Horizon v4.4.0 (`main`, development theme on the linked dev store) · Source: *Snosha.com Technical SEO Implementation.pdf* (WordPress → Shopify, Arabic + `/en`)
Mode: **audit only** — no theme code, settings or Admin data changed.

## How this was audited
| Source | What was checked |
|---|---|
| Theme code (`main`) | `layout/theme.liquid`, `snippets/meta-tags.liquid`, every `application/ld+json` output, `snippets/snosha-breadcrumbs.liquid`, `snippets/product-information-content.liquid`, robots / sitemap files, fonts, scripts |
| Dev preview (127.0.0.1:9292, dev store `internal-zt-yzyuhhfk`) | Rendered `<head>` of home, product (+ `?variant=`, collection-scoped, trailing slash, uppercase), collection (+ page 2, sort, filter), `/collections`, blog, article, page, search, cart, account, 404, `/en`; robots.txt; sitemap.xml; JSON-LD parsed |
| Live site `https://snosha.com` (read-only GET/HEAD) | Platform, redirects, hreflang, `/en`, robots.txt, head output — see §Production |

**Key context discovered:** `snosha.com` is **already a Shopify store** (Cloudflare, `/cdn/shop/t/20/…`, a different, older theme — not this Horizon theme) with **English published**: `/en/` answers 200 and Shopify emits `hreflang="ar"`, `"en"` and `"x-default"`. The "obsolete English alternates" therefore come from the **store's Languages setting**, not from theme code (this Horizon theme contains no hreflang code). The dev store has Arabic only (`/en` → 404, no hreflang).

## Corrections to the PDF (do not copy these)
| PDF item | Problem on Shopify | Correct approach |
|---|---|---|
| §1 Page URL `snosha.com/{handle}` | Shopify pages live at `/pages/{handle}`; articles at `/blogs/{blog}/{article}` | Use Shopify's fixed routes |
| §4 hreflang / §7.3 breadcrumb `…/product/{handle}` | Wrong path (`/products/`) | Not needed (Arabic only); breadcrumb from `product.url` |
| §3 custom `seo-canonical.liquid` | Duplicates the native canonical (2 canonicals), breaks `?page=` self-canonicals, hardcodes the domain | Keep Shopify's `canonical_url` (already correct) |
| §4 / §5 / §6 English URLs, `/en` GSC property, `lang="en"` branch | Out of scope (Arabic only) | — |
| §7.2 custom Product schema | Duplicates Shopify's `structured_data` Product; uses deprecated `img_url`; `cart.currency` instead of the product's; single Offer | Keep native Product schema; add rating via Judge.me's own rich-snippet output or a deduplicated approach (Phase 2) |
| §7.3 breadcrumb code | Liquid typo `}% else %}` (invalid), hardcoded domain | Extend the existing `snosha-breadcrumbs` JSON-LD |
| §7.4 FAQ schema | Hardcoded Q&A unrelated to the page's visible FAQ (policy violation risk) | Generate from the visible `snosha-faq` section blocks, or skip |
| §9 `noindex` on `current_page > 1` | Removes paginated products from discovery (Google advises against) | Keep pages indexable with self-canonical (already native) |
| §9 search `noindex` meta | Shopify already sends `X-Robots-Tag: noindex, nofollow` on `/search` | Nothing to add |
| §2 `Disallow: /search` | Would hide the noindex header from crawlers | Do not add |
| §12 "Google Tag Manager by PYS" | PixelYourSite is a WordPress plugin; the snippet only declares an empty array | Use Shopify's Google & YouTube app or Customer events (GA4 / GTM) |
| §8 `preconnect` to `cdn.shopify.com` | Theme assets are served from the store domain (`/cdn/shop/…`); Shopify already sends preconnect headers | Not needed |

---

## Production snapshot (live `snosha.com`, old theme, read-only; requests stopped after HTTP 429)
| Check | Live result |
|---|---|
| Platform | Shopify behind Cloudflare, theme id `189128573172` (not this Horizon theme) |
| http → https, www → non-www | 301 → `https://snosha.com/` ✓ |
| Languages | Arabic primary + **English published**: `/en` 200 with `lang="en"`, `/en/collections/…` 200 |
| hreflang | Every page: `x-default`, `ar`, `en` (Shopify-generated from the published languages) |
| Canonical | Self-referencing; sort / filter → base collection; `?page=2` self ✓ |
| Pagination | `noindex, follow` emitted **twice** on page 2 (old theme implements PDF §9) |
| JSON-LD | `OnlineStore` (+ ContactPoint, Person, PostalAddress) on every page; product: **two `Product` blocks** + BreadcrumbList + FAQPage; collection: BreadcrumbList + CollectionPage; article: BlogPosting; `/pages/faqs`: FAQPage |
| Verification | **3** `google-site-verification` metas in the theme (`53a5ed…` twice, `iwVLDU…` once) |
| SEO copy | Several titles / descriptions in **English** (collection "Tongue Scraper…", blog "Snosha Blog…", "Contact Us…", "Frequently Asked Questions", "About us") |
| `/search` | `X-Robots-Tag: noindex, nofollow` ✓ |
| robots.txt | Shopify default, `Sitemap: https://snosha.com/sitemap.xml` ✓ |
| WordPress-style paths | `/product/couple-bundle`, `/product-category/test` → 404 (no redirects for the tested patterns) |
| Collection-scoped product URL | 301 → `/products/{handle}` ✓ |

Note: the dev store's content differs from production (Arabic handles, 5 test products, shop name "Internal-ZT"); production handles are Latin (`couple-bundle`). Theme output was audited on the dev store; content findings are from production.

---

## Implementation matrix

Status = state of **this Horizon theme / its store setup** (target), with the live store's state noted where different.
Platform: **Theme** = theme code · **Admin** = Shopify Admin · **GSC** = Google Search Console · **Ext** = other platform / app.

### Phase 1 — SEO Foundation
| # | Requirement (PDF §) | Existing Shopify / Horizon implementation | Status | Files | Recommended fix | Risk | Platform |
|---|---|---|---|---|---|---|---|
| F1 | `lang` / `dir` set dynamically (§5) | `<html lang="{{ request.locale.iso_code }}" dir="{{ request.locale.direction }}">` → `ar` / `rtl` | **Implemented** | `layout/theme.liquid` | None (PDF's if/else branch not needed) | — | Theme |
| F2 | Self-referencing canonical (§3) | Native `canonical_url`: variant / trailing slash / uppercase → clean URL; sort & filter → base collection; `?page=2` self | **Implemented** | `snippets/meta-tags.liquid` | Do **not** add `seo-canonical.liquid` (would duplicate) | — | Theme |
| F3 | Title + meta description (§8) | Native `page_title` / `page_description` | **Implemented** (code) / **Missing** content on dev (no description on home, collections, blog, pages; shop name "Internal-ZT") / **Incorrect** on live (English SEO copy) | `snippets/meta-tags.liquid` | Write Arabic SEO title + description for home (Preferences), every product, collection, page, blog, article | Low | Admin |
| F4 | Arabic-only title suffixes | `– tagged "…"` and `– Page N` are hard-coded English | **Incorrect** | `snippets/meta-tags.liquid` | Use translated strings (e.g. «صفحة N»); needs a locale key (locale edits need approval) | Low | Theme |
| F5 | No English hreflang / alternates (§4, adapted) | Theme has no hreflang code; Shopify adds `ar`/`en`/`x-default` automatically while English is published | Theme **Implemented (N/A)** / live **Incorrect** | — | Unpublish English (Settings → Languages) **after** the `/en` redirect plan (M4); then verify hreflang disappears. Do not add `seo-hreflang.liquid` | **High** (indexed `/en` URLs) | Admin |
| F6 | No multilingual navigation | Header `show_language: false`, `show_country: false` | **Implemented** | `sections/header-group.json` | None | — | Theme |
| F7 | robots.txt (§2) | Shopify default: admin, `/cart/`, checkout(s), orders, account, `sort_by`, multi-filter, `oseid`, preview params, `/recommendations/products`; live lists the sitemap | **Implemented** | — (no `templates/robots.txt.liquid`) | No custom file. Keep `/search` crawlable (its noindex header must be seen). Single-filter URLs canonicalise to the base; only add rules if GSC shows crawl waste | Medium if customised | Theme (none) |
| F8 | Sitemap (§6) | Native `/sitemap.xml` index (products, collections, pages, blogs) | **Implemented** | — | Submit to the GSC **domain** property only (no `/en` property) | Low | GSC |
| F9 | noindex: search (§9) | `X-Robots-Tag: noindex, nofollow` on `/search` (Shopify) | **Implemented** | — | Nothing to add | — | — |
| F10 | noindex: customer pages (§9) | New customer accounts (`/account` → Shopify-hosted, robots-disallowed); no `templates/customers` | **Not Applicable** | — | — | — | — |
| F11 | noindex: paginated pages (§9) | Not implemented (pages indexable, self-canonical) — live theme noindexes page 2 twice | Theme **Correct by design** / live **Incorrect** | — | Keep indexable (brief rule 11). Fixed on launch of this theme | Low | Theme |
| F12 | Search Console verification (§12) | Live theme: 3 verification metas; this theme: **none** | **Missing** | `layout/theme.liquid` (if tag kept) | **Pre-launch blocker:** verify GSC via DNS (domain property) — or carry the active token(s) into the theme once, de-duplicated | **High** (verification lost at theme switch) | GSC / Theme |
| F13 | Head order (§8) | charset → viewport → OG → title → canonical → description → CSS / JS → `content_for_header` | **Implemented** (equivalent) | `layout/theme.liquid`, `snippets/meta-tags.liquid` | None; `preconnect` to `cdn.shopify.com` not needed (assets on the store domain; Shopify sends preconnect headers) | — | — |
| F14 | `og:locale` | Not emitted | **Missing** (minor) | `snippets/meta-tags.liquid` | Optional `<meta property="og:locale" content="ar_EG">` | Low | Theme |

### Phase 2 — Structured Data
| # | Requirement (PDF §) | Existing Shopify / Horizon implementation | Status | Files | Recommended fix | Risk | Platform |
|---|---|---|---|---|---|---|---|
| S1 | Organization schema (§7.1) | Horizon `Organization` {name, logo, url} on every page; `url` = `origin + page.url` → **page URL on `/pages/*`**; no sameAs / contactPoint / alternateName | **Incorrect** + **Missing** fields | `sections/header.liquid` | Fix `url` to the homepage; add `alternateName` «سنوشا», `sameAs` (real social URLs), `contactPoint` from store data (`shop.email`, `shop.phone`), `availableLanguage: "Arabic"`. Founder / founding date only if the merchant confirms. One block site-wide | Low | Theme + Admin (store contact, footer social URLs — currently placeholders `https://www.facebook.com/`…) |
| S2 | WebSite schema | None (live has WebSite) | **Missing** (optional) | `layout/theme.liquid` or header | Optional homepage `WebSite` {name, alternateName, url} for the site-name SERP label; no SearchAction needed | Low | Theme |
| S3 | Product schema (§7.2) | Native `{{ product | structured_data }}`: Product, name, description, image, brand (= vendor), category, Offer {price, EGP, availability, url} | **Implemented** | `sections/product-information.liquid` (+ `featured-product*.liquid`) | Do **not** add the PDF block (duplicate — the live store already shows 2 Product blocks). Set vendor = "Snosha" (dev shows "Internal-ZT") | — / Low | Admin (vendor) |
| S4 | Rating in Product schema (§7.2 aggregateRating) | No `aggregateRating` in JSON-LD although Judge.me synced `reviews.rating` / `rating_count` (F1: 4.5 / 12) | **Missing** | `sections/product-information.liquid` | First check Judge.me's own rich-snippet / SEO setting and whether it adds a **separate** Product block. Implement exactly **one** Product entity with `aggregateRating` from `reviews.rating` + `reviews.rating_count` (count > 0 only). Validate in Rich Results Test | **Medium** (duplicate Product / review-snippet policy) | Ext (Judge.me) + Theme |
| S5 | Breadcrumb schema (§7.3) | Collection pages: BreadcrumbList from `snippets/snosha-breadcrumbs.liquid` ✓. Product pages: visible breadcrumbs, **no JSON-LD**. Articles: none | Collection **Implemented** / product **Missing** | `snippets/product-information-content.liquid`, `snippets/snosha-breadcrumbs.liquid` | Emit BreadcrumbList with the same crumbs as the visible product breadcrumbs (Home → collection → product), absolute URLs from `request.origin` + `routes` / `*.url`; optional for articles (Home → blog → article) | Low | Theme |
| S6 | FAQ schema (§7.4) | No FAQPage. Visible FAQs: `snosha-faq` sections (home, product); live has `/pages/faqs` with FAQPage | **Missing** (optional) | `sections/snosha-faq.liquid` | Optional: generate FAQPage from the section's visible blocks (one per page). Google shows FAQ rich results only for authoritative health / government sites, so low value. Never the PDF's hard-coded Q&A | Low | Theme |
| S7 | Article schema (§7.5) | Native `{{ article | structured_data }}` (Article) | **Implemented** | `sections/main-blog-post.liquid` | Optional `inLanguage` not required for Arabic-only | — | Theme |
| S8 | `inLanguage` on schema (§7) | Not emitted by native schema | **Not Applicable** (single language) | — | Skip | — | — |
| S9 | Collection schema | None (live has CollectionPage / ItemList) | **Missing** (optional) | — | Not needed for rich results; skip unless desired | Low | Theme |
| S10 | Validation (§14) | — | **Pending** | — | Rich Results Test + Schema.org validator on the production preview of this theme | — | Ext |

### Phase 3 — Migration, Indexing and Redirects
| # | Requirement (PDF §) | Existing Shopify / Horizon implementation | Status | Files | Recommended fix | Risk | Platform |
|---|---|---|---|---|---|---|---|
| M1 | http → https, www → non-www (§1) | Live: both 301 → `https://snosha.com/` | **Implemented** | — | Keep `snosha.com` as primary domain ("Redirect all traffic") | — | Admin |
| M2 | Collection-scoped product URLs → `/products/…` (§1) | 301 on live and dev; theme links use `product.url` (no `within: collection`) | **Implemented** | — | None | — | — |
| M3 | Trailing slash / case normalisation (§1) | 200 + canonical to the clean URL (Shopify cannot 301 these) | **Implemented** (via canonical) | — | None | — | — |
| M4 | Legacy `/en` URLs | English published and indexable on live (`/en`, `/en/collections/…` 200) | **Separate redirect audit required** | — | 1) Export indexed `/en` URLs (GSC Pages report, sitemap, backlinks). 2) Map each to its Arabic URL. 3) Unpublish English. 4) Re-test `/en/*` (404 vs automatic redirect) and add URL redirects for the mapped paths if needed. 5) Monitor GSC | **High** | Admin + GSC |
| M5 | Old WordPress URLs (§1) | Tested patterns `/product/…`, `/product-category/…` → 404 | **Missing** (scope unknown) | — | Build the old-URL list (old WP sitemap / GSC / backlink tool), map to Shopify URLs, bulk-import in Online Store → Navigation → URL redirects (CSV). No JS redirects | Medium–High | Admin + Ext |
| M6 | Theme switch without URL changes | This theme uses Shopify routes only; dev content ≠ production | **Pending** | — | QA this theme as an unpublished theme **on the production store** before publishing (handles, FAQ page template, verification) | Medium | Admin |
| M7 | Pages present on live (`/pages/faqs`, `/pages/about-us`, policies) | Dev has only `/pages/contact` | **Pending** | `templates/page*.json` | Ensure each live page renders with this theme (template assignment) | Medium | Admin / Theme |
| M8 | 404 handling | Unknown paths → 404 ✓ | **Implemented** | `templates/404.json` | None | — | — |
| M9 | GSC properties (§6) | Live verified (tags) | **Pending** | — | Domain property only; drop the `/en` URL-prefix property from the plan; re-submit sitemap after launch | Low | GSC |
| M10 | Bing verification (§13) | None | **Missing** | — | Import from GSC in Bing Webmaster Tools (no theme tag needed) | Low | Ext |

### Phase 4 — Performance, Content and Tracking
| # | Requirement (PDF §) | Existing Shopify / Horizon implementation | Status | Files | Recommended fix | Risk | Platform |
|---|---|---|---|---|---|---|---|
| P1 | Responsive images, width / height, lazy / eager (§10) | Horizon `image_tag` with widths / sizes; homepage sample: 35 / 40 images with dimensions, 21 lazy, 13 eager / high | **Implemented** (mostly) | — | 5 video poster `<img>` without width / height (reels) — add dimensions to avoid CLS | Low | Theme |
| P2 | `font-display: swap` (§13) | Cairo `@font-face` with `font-display: swap` | **Implemented** | `snippets/custom-font.liquid` | None | — | — |
| P3 | No render-blocking scripts (§10) | All theme scripts are modules / deferred; none blocking in `<head>` | **Implemented** | `snippets/scripts.liquid` | Review app embeds (Judge.me etc.) after launch | Low | Ext |
| P4 | Preconnect to Shopify CDN (§10) | Assets served from the store domain; Shopify sends `Link: preconnect` headers | **Not Applicable** | — | — | — | — |
| P5 | Core Web Vitals targets (§10) | Not measured | **Not Verified** | — | PageSpeed / CrUX on the production preview of this theme; mobile LCP < 2.5 s, CLS < 0.1 | Medium | Ext |
| P6 | Blog article requirements (§11) | Native article template (author / date per block settings), Article schema | **Partial** | `templates/article.json`, `sections/main-blog-post.liquid` | Verify author / date blocks are shown; table of contents and internal links are editorial | Low | Theme / content |
| P7 | GA4 / GTM (§12) | No gtag / GTM in theme (also none visible on live) | **Missing** | — | Shopify **Google & YouTube** app or Settings → Customer events for GA4 / GTM. The PDF's "GTM by PYS" is WordPress-only — **Not Applicable** | Medium | Ext / Admin |
| P8 | WhatsApp link + click tracking (§12) | WhatsApp link present (product page) | **Implemented** (link) / tracking **Missing** | — | Track clicks in GA4 / GTM (link-click event), not theme JS | Low | Ext |
| P9 | Arabic SEO content | See F3 | **Incorrect** on live | — | Rewrite English titles / descriptions / page names in Arabic | Low | Admin |

---

## Prioritised plan
| Priority | Items | Why |
|---|---|---|
| **P0 — before publishing this theme** | F12 (GSC verification continuity), M6 / M7 (QA on production store, pages present), F3 / P9 (Arabic SEO titles / descriptions), S3 vendor | Avoid losing verification or ranking signals at the theme switch |
| **P1 — language and URL migration (separate audit)** | M4 → F5 (export / map `/en`, then unpublish English), M5 (WordPress redirects), M9 / M10 | High impact and ordering-sensitive; Admin / GSC work, no theme code |
| **P2 — theme code (small, after approval)** | S1 Organization fix, S5 product BreadcrumbList, F4 Arabic title suffixes (locale key), S4 rating (after Judge.me check), S2 WebSite (optional), F14 `og:locale`, P1 poster dimensions | All additive, single-source; no duplicate schema |
| **P3 — measure and track** | P5 Core Web Vitals, P7 GA4 / GTM, P8 WhatsApp event, S10 schema validation, P6 blog checklist | Post-launch verification |

**Explicitly not to implement:** custom canonical snippet, hreflang snippet, English URLs / metadata, custom sitemap, PDF Product schema block, noindex on pagination, `Disallow: /search`, PYS GTM snippet, hard-coded FAQ schema, CDN preconnect.

## Open questions for the merchant
1. Is English to be unpublished on the live store, and on what date relative to the theme launch?
2. Which GSC verification method is active (DNS vs. the `53a5ed…` / `iwVLDU…` meta tokens)?
3. Real social profile URLs and customer-support phone / email for the Organization schema (footer social URLs are placeholders).
4. Can the old WordPress URL list (sitemap / GSC export) be provided for the redirect map?
5. Does Judge.me's rich-snippet option run on the live store (source of the second Product block)?
