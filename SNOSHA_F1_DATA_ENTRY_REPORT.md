# SNOSHA F1 — Data Entry Report

**Date:** 2026-11-18 · **Branch:** `main` (local HEAD = `origin/main` = `164160c` before editing) · **Not committed or pushed.**

**Product:** `جهاز-تنظيف-الأسنان-بالماء-snosha-f1`, rendered with `product.f1-product` (confirmed on the preview).

**Edited:** only `templates/product.f1-product.json`, which holds the Arabic content. Section order, IDs, types, styling settings and product references are unchanged.

**Sources:** all three documents were read in full, from the PDF copies attached to the request.

### How the template was edited
- **Starting point:** the F1 template was an exact copy of `templates/product.json`, so it still showed N2 content.
- **Where the content went:** only into existing settings. No section, snippet, schema, metafield, metaobject or locale file was created or changed.
- **Blocks added:** 21 new blocks, all of types those sections already accept, where a list in the documents needed more slots:
  - 1 "What's in the box" item
  - 4 battery items
  - 6 care/storage items
  - 18 FAQ rows
- **Blocks hidden:** 11 N2-only blocks with no F1 equivalent were set to `disabled: true`. They are hidden, not deleted, and can be re-enabled in the Theme Editor:
  - `benefit_modes`, `benefit_warranty`
  - `modes_massage`
  - `battery_low`, `battery_charging`, `battery_full`
  - `water_modes`
  - how-to-use steps 5–8
- **Shopify Admin:** nothing was written. The Shopify connector in this session is signed into a different store, so all product, SEO and translation data is listed in §3.
- **English:** English content is stored in Translate & Adapt on the server, not in this repository. Every English value is listed in §3.

---

## 1. Successfully Populated

All entries are Arabic, written into `templates/product.f1-product.json`. Status: **Populated**.

| Content | Destination | Language | Status |
|---|---|---|---|
| Hero benefit: خزان 330 مل | main › snosha_benefits_list › benefit_easy | AR | Populated |
| Hero benefit: 4 أوضاع تنظيف | … › benefit_clean | AR | Populated |
| Hero benefit: 4 رؤوس متخصصة | … › benefit_battery | AR | Populated |
| Hero benefit: ضغط 30–120 PSI | … › benefit_water | AR | Populated |
| Trust point: ضمان سنة ضد عيوب الصناعة | main › snosha_trust_pills › trust_warranty | AR | Populated |
| Suitable for (designed-for line) | main › accordion_snosha_policies › row_suitable_for | AR | Populated |
| Not suitable for (children FAQ answer) | … › row_not_suitable_for | AR | Populated |
| One-Year Warranty + consumables exclusion | … › row_warranty | AR | Populated |
| Why Water Flossing (heading + 2 paragraphs) | snosha_long_description › intro | AR | Populated |
| Pressure 30–120 PSI (heading, subtitle, body) | snosha_long_description › sonic | AR | Populated |
| Items: 30–120 PSI / 330 مل tank / 4 modes | sonic › sonic_rate, sonic_reach, sonic_deep | AR | Populated |
| What's in the box (heading + 6 items) | box › box_body, box_heads, box_case, box_cable, box_stand, **box_f1_cable (new)** | AR | Populated |
| Four modes (heading + Strong/Normal/Soft/Pulse with benefit line) | modes › modes_clean, modes_sensitive, modes_white, modes_polish | AR | Populated |
| Four nozzles (heading + 4 nozzles with usage line) | brush › brush_replace, brush_fit, brush_gap, brush_remove | AR | Populated |
| Nozzle replacement every 3–6 months | brush › body | AR | Populated |
| Battery & charging (heading, body, full-charge note) | battery | AR | Populated |
| Battery highlights: 22 uses / 45 min / 2000mAh / USB-C | battery › **battery_f1_uses, _runtime, _capacity, _usbc (new)** | AR | Populated |
| IPX7 (heading + body) | water | AR | Populated |
| IPX7 / 360° rotation / 1-minute timer items | water › water_ipx7, water_press, water_hold | AR | Populated |
| How to Use heading + 4 steps | snosha_how_to_use_UGazpy › heading, steps 1–4 | AR | Populated |
| How-to-use tip: start with Soft Mode | snosha_how_to_use_UGazpy › note | AR | Populated |
| Important use notes (7) | snosha_storage_care › tab "للاستخدام الآمن" (7 existing items) | AR | Populated |
| After every use (4), descaling, maintenance frequency | tab "للتنظيف والصيانة" (1 existing + **5 new** items) | AR | Populated |
| Storage / drying + travel | tab "للتخزين" (1 existing + **1 new** item) | AR | Populated |
| FAQ ×18 (Q + A) | snosha_faq › accordion_xHANdD (9) + accordion_gRT6CA (9), **new rows `accordion_row_f1faq01–18`** | AR | Populated |

**FAQs added:**
1. ما هو جهاز تنظيف الأسنان بالماء
2. يغني عن الفرشاة
3. يغني عن Dental Floss
4. التقويم
5. الضغط اللطيف
6. الأوضاع الأربعة
7. بأي Mode أبدأ
8. الرؤوس الأربعة
9. فائدة خزان 330 مل
10. سعة البطارية
11. استخدامات لكل شحنة
12. مدة الشحن
13. متى أغير الرأس
14. الرؤوس تباع منفصلة
15. الرؤوس والضمان
16. التنظيف بعد الاستخدام
17. الأطفال
18. النزيف

These cover every question in the brief's "CRO RULES" list.

The six existing store FAQ rows (payment, COD, authenticity, warranty, returns, shipping) are kept unchanged.

**Already correct, not changed:**
- **H1:** comes from the product title, and the Arabic title equals the approved H1.
- **Price and compare-at price:** 2,499 and 3,100.
- **Variants:** one product with two colour variants, each with its own image.
- **Reviews:** the Judge.me reviews section is product-scoped and dynamic.
- **Recommendations:** related products and "you may also like" are dynamic.

---

## 2. Missing Content Destinations

| Content | Source Document | Required Destination | Reason Not Added | Recommendation |
|---|---|---|---|---|
| Hero subheadline (rec. #1) | AR/EN content docs | Text under the H1 in the purchase area | No subheadline block in `main`; adding one would change the hero layout | Add a Text block under the title in Theme Editor, or show the product description there |
| 330ml tank as a standalone hero-visual feature | CRO brief §8, content docs | Large visual section | No suitable section; tank copy placed as an item in the pressure panel and in the FAQ | Add a long-description panel with a tank image |
| Mode "Best for" lines (×4) | Content docs | Second line per mode card | `_snosha-ld-item` has only title + description (description holds the Benefit line) | Extend the item or the panel (needs approval) |
| Nozzle "Benefit" lines (×4) | Content docs | Second line per nozzle card | Same limit as above (description holds the Use line) | Same as above |
| Nozzle product images | CRO brief §11 | Image per nozzle card | `icon_image` exists, but no approved nozzle images supplied | Upload `snosha-f1-*-nozzle.webp` and set `icon_image` |
| Use cases ×6 (between teeth, gumline, braces, crowns, bridges, hard-to-reach) | Content docs, brief §13 | Visual cards | No unused panel; all 7 long-description panels are now in use | Add one `_snosha-ld-panel` ("مصمم لأكثر من استخدام") with 6 items in Theme Editor |
| 360° visual (GIF/WebM) | Brief §12 | Media slot | No asset supplied; text placed as an item in the IPX7 panel | Supply the media |
| Specifications table (16 rows) | Content docs, brief §18 | Responsive specs table | No specs-table section; `snosha-product-comparison` is an N2-vs-manual-brush table | Build a specs section, or use a metaobject table (needs approval) |
| SNOSHA Oral Care System (N2 / F1 / Interdental) | Content docs, brief §20 | Dynamic related-products section | Nothing metafield-driven exists; the related-products section is algorithmic | Needs a product-reference metafield + section |
| Bundle N2 + F1, Complete Oral Care Bundle | Content docs, brief §21 | Bundle section | `snosha-bundle` is not on this template; the bundle products don't exist | Create the bundle products, then add the section |
| Replacement nozzles section + CTA "اكتشف رؤوس F1 البديلة" | Content docs, brief §22 | Related-product section | No replacement-nozzle product exists | Create the product, then add a product list |
| Final CTA (headline, subheadline, ATC) | Content docs, brief §25 | End-of-page buy box | No such section | New section needed |
| 19 remaining FAQs (crowns, bridges, tank size, pressure, change intensity, battery runtime, USB-C, charging input, IPX7, submerge, use while charging, timer, rotation, descaling how/how often, travel, mouthwash, water temperature, box contents) | Content docs | Same FAQ section | The section is at Shopify's **50-block limit** (14 existing + 36 new). Most of these facts are already elsewhere on the page | Second FAQ section, or a metaobject-driven FAQ |
| FAQ "ما مدة الضمان؟" | Content docs | FAQ | Duplicates the existing store row "هل يوجد ضمان على المنتجات؟" | Keep one; see §4 |
| Hero trust points USB-C / IPX7 | Content docs (hero) | Trust pills | All 6 pills hold store policies (brief §6 asks for those) | Add pills, or keep in benefits |
| Image copy (16 short labels) | Content docs | Image overlays | No overlay text fields | Bake into images |
| Microcopy (Color, Select Color, Add to Cart, Buy Now, Out of Stock, Added to cart, Continue Shopping, Checkout…) | Content docs | Theme locale strings | Locale files are off-limits | Translate & Adapt theme content, if wording must change |
| Sticky ATC, CRO tracking events | Brief §5, §27 | Functionality | Not content; out of scope | Separate development task |

---

## 3. Shopify Admin / Manual Entry Required

### 3a. Product fields (Shopify Admin)

**Location:** Admin → Products → SNOSHA F1.

**English values:** enter them in Translate & Adapt → English → Products.

| Field | Arabic Value | English Value | Shopify Admin Location | Reason Not Updated |
|---|---|---|---|---|
| Title | جهاز تنظيف الأسنان بالماء SNOSHA F1 (already set) | SNOSHA F1 Water Flosser | Product → Title / T&A | EN title missing (`/en` shows the Arabic title); no Admin access |
| Description | Hero recommended subheadline + short body from docs (suggested: «تنظيف عملي بين الأسنان وحول خط اللثة، مع 4 أوضاع، 4 رؤوس متخصصة وخزان 330 مل لروتين أسهل من البداية للنهاية.») | Clean between teeth, along the gumline and around braces with four modes, four specialized nozzles and a large 330ml tank. | Product → Description / T&A | Currently **empty**: the "الوصف" accordion row and the product cards render blank |
| SEO title | جهاز تنظيف الأسنان بالماء F1 \| SNOSHA (already set, matches doc) | SNOSHA F1 Water Flosser \| 4 Modes & 330ml Tank | Product → Search engine listing / T&A | EN missing; no Admin access |
| Meta description | اكتشف SNOSHA F1 لتنظيف الأسنان بالماء بخزان 330 مل، 4 أوضاع، 4 رؤوس وضغط 30–120 PSI للتنظيف بين الأسنان وحول التقويم. اطلبه الآن. | Shop SNOSHA F1 Water Flosser with a 330ml tank, 4 cleaning modes, 4 specialized nozzles and 30–120 PSI for interdental, gumline and braces cleaning. | Same | Not set; no Admin access |
| Option name / values | اللون: أسود، وردي (set) | Color: Black, Pink | T&A → Products | EN translation not verified |
| Image alt text (5 media) | Alt-text list 1–15 from the AR doc, by matching image | ALT list 1–15 from the EN doc | Product → Media → alt / T&A | All 5 alts empty; mapping each image to an alt text needs a person to look at the images |
| Google Shopping title / description | SNOSHA F1 جهاز تنظيف الأسنان بالماء – 330 مل، 4 أوضاع، 4 رؤوس / doc paragraph | SNOSHA F1 Water Flosser – 330ml, 4 Modes, 4 Nozzles, IPX7 / doc paragraph | Google & YouTube channel / product feed | No Admin access |
| Product category | — | — | Product → Category | Could not read; set to an oral-care / water-flosser category |
| Model "F1" | F1 | F1 | No field (no metafield definition) | A metafield definition is not allowed in this task |

### 3b. English translations of the template content (Translate & Adapt → English → Theme → Templates → product.f1-product)

| Field (Arabic now in template) | Arabic Value | English Value | Shopify Admin Location | Reason Not Updated |
|---|---|---|---|---|
| Benefits ×4 | خزان 330 مل · 4 أوضاع تنظيف · 4 رؤوس متخصصة · ضغط 30–120 PSI | 330ml Large Tank · 4 Cleaning Modes · 4 Specialized Nozzles · 30–120 PSI | T&A theme content | Translations are stored on the server |
| trust_warranty | ضمان سنة ضد عيوب الصناعة | 1-Year Manufacturing Defect Warranty | same | same |
| row_suitable_for | مصمم للتنظيف بين الأسنان… | Designed for cleaning between teeth, along the gumline, around braces and toward harder-to-reach areas. | same | same |
| row_not_suitable_for | الجهاز ليس مخصصًا لاستخدام الأطفال… | The device is not intended for independent use by children or infants. A child capable of using the device should only do so under adult supervision and guidance in accordance with the product instructions. | same | same |
| row_warranty | SNOSHA F1 مشمول بضمان… / الرؤوس والأجزاء… | SNOSHA F1 is covered for one year from the date of purchase against manufacturing defects and component-quality issues under normal use, subject to the warranty terms. / Consumable parts, including water flosser nozzles, are not covered by the free warranty service. | same | same |
| intro heading + body | الفرشاة هي البداية… مش كل الروتين | Go Beyond Tooth Surfaces / "Brushing is essential…" + "SNOSHA F1 adds focused water flossing…" (EN doc p.3) | same | same |
| sonic heading, subtitle, body | القوة اللي تناسبك / 30–120 PSI | Choose the Pressure That Feels Right / 30–120 PSI / "Not every session needs the same intensity." + "SNOSHA F1 combines a 30–120 PSI pressure range…" | same | same |
| sonic items | ضغط 30–120 PSI / خزان كبير 330 مل / 4 أوضاع تنظيف | 30–120 PSI – Start soft. Adjust as you go. · 330ml Large Tank – The 330ml water tank gives you a practical amount of water for each session, reducing the need to stop and refill while you clean. · 4 Cleaning Modes – Strong / Normal / Soft / Pulse | same | same |
| box heading + 6 items | محتويات العلبة … | What's in the Box · SNOSHA F1 Water Flosser · Regular Nozzle · Sensitive Nozzle · Orthodontic Nozzle · Tongue Scraper · USB Type-C Charging Cable | same | same |
| modes heading + 4 items | 4 أوضاع لتنظيف بطريقتك … | Four Modes. Your Choice of Intensity. · Strong – A more powerful water flow for areas that need extra cleaning intensity. · Normal – A balanced combination of pressure and everyday comfort. · Soft – A gentler water flow for a more comfortable introduction. · Pulse – Alternating water flow delivered in a pulsing pattern. | same | same |
| brush heading, body, 4 items | 4 رؤوس. استخدامات مختلفة. … | Four Nozzles. Four Different Jobs. · "F1 nozzles are consumable parts… every 3–6 months, or earlier if you notice visible wear, deformation or damage." · Regular Nozzle – Everyday cleaning between teeth and along the gumline. · Sensitive Nozzle – For users who prefer a gentler cleaning experience. · Orthodontic Nozzle – For directing water around braces, wires and brackets. · Tongue Scraper – For cleaning the surface of the tongue as part of your oral care routine. | same | same |
| battery heading, body, note, 4 items | اشحن أقل. استخدم أكثر. … | Less Charging. More Use. · "The 2000mAh battery delivers up to 45 minutes…" + "USB Type-C charging keeps recharging simple with a compatible 5V 1A power source." · Full Charge: Approximately 6 hours. · Up to 22 Uses · Up to 45 Minutes · 2000mAh Battery · USB-C Charging | same | same |
| water heading, body, 3 items | IPX7 لروتين الحمام اليومي … | IPX7 for Everyday Bathroom Use · "SNOSHA F1 carries an IPX7 water-resistance rating…" + "Follow the care instructions… do not fully immerse the unit in water." · IPX7 Water Resistant · 360° Rotation – The nozzle rotates 360 degrees, making it easier to change the direction of the water stream and reach different areas without constantly repositioning your grip. · 1-Minute Timer – Each cleaning mode includes a one-minute timer, helping you keep your session structured without constantly checking the time. | same | same |
| how-to-use heading, 4 steps, note | طريقة الاستخدام … | How to Use · Fill the 330ml tank with clean water no warmer than 40°C, then close it securely. · Insert the nozzle until it clicks into place, then select the cleaning mode that feels right for you. · Place the nozzle in your mouth before switching the water flow on. Lean slightly over the sink and guide the stream at approximately 90° to your teeth and gumline. · After use, empty any remaining water, drain the internal tube and wipe the unit dry before storage. · Note: Start with Soft Mode if you are new to water flossing. | same | same |
| storage tabs (15 items) | as in the template | Important Use Notes, Caring for Your F1, Removing Hard-Water Deposits and Maintenance Frequency text from the EN doc, pp. 8–9. The EN list has no "eyes" bullet (see §4); FAQ "travel" answer for the storage tab | same | same |
| FAQ ×18 | as in the template | Matching Q/A from the EN doc, pp. 12–16 (e.g. "Can I use F1 with braces?", "Which mode should I start with?", "What should I do if my gums bleed?") | same | same |

---

## 4. Missing or Conflicting Source Data

**Commercial and media data**
- **SKU and barcode:** both variants have **no SKU and no barcode**. The brief requires a separate SKU per variant. Nothing was invented.
- **Inventory quantities:** not readable from the storefront. Both variants show as available.
- **Media:** 5 images, all with **empty alt text**.
- **Images not supplied:** nozzle, use-case, 360° and in-the-box images, and the how-to-use video.
- **Image file names:** the documents ask for names like `snosha-f1-*.webp`. The current files are `1319102.avif` and `water-flosser-fp16c-main-image-5.webp`.

**Product data**
- **Product description:** empty, in Arabic and English.
- **English translations:** missing for the product title, SEO fields and options.

**Warranty conflict (flag)**

| Source | Wording | Note |
|---|---|---|
| Product documents | 1 year from the date of purchase, covering manufacturing defects **and component-quality issues** | **Nozzles and consumables are excluded** |
| Store FAQ row on this template | «جميع منتجات SNOSHA تأتي بضمان لمدة سنة ضد عيوب الصناعة» | No exclusion |
| Store trust pill (replaced on the F1 template only) | «ضمان لمدة سنة علي الآجهزة» | "Devices" only |

- The store's warranty policy page was not inspected.
- **Action:** confirm the final warranty terms before publishing.

**Differences between the source documents**
- **Use notes:** the Arabic list includes «لا توجه تدفق المياه للعين…». The English list leaves it out and adds "Allow the unit and removable components to dry before storage".
- **How-to-use steps:** the brief lists fill → attach nozzle → choose mode → direct the water. The content documents list fill → choose nozzle and mode → direct the water → empty and dry. The content documents were used.
- **Cleaning performance:** the brief mentions "1600 pulses/min" as conditional on approval. It is absent from the approved documents and was not used.
- **Hero subheadline:** only the recommended option exists, and it has no destination (§2).

**N2 content still on the F1 page (no F1 source content; sections not touched)**
- **Promo capsule:** «وفّر 10% عند شراء فرشتين معًا» refers to buying two brushes.
- **"كمّل روتينك":** links to the N2 + tongue-cleaner bundle, not an F1 product.
- **`snosha-product-comparison`:** compares a manual brush with SNOSHA, including 42,000 vibrations, 5 modes and 120 days.
- **`snosha-before-after`:** «النتيجة بعد الاستخدام المنتظم لفرشاة SNOSHA».
- **Reels and how-to-use video:** use N2 posters and videos.
- **Shipping and returns rows:** still contain placeholder text, and the documents have no policy text for them.
- **Store FAQ rows:** 5 have empty answers.
- **FAQ subtitle:** mentions only shipping, payment and returns.
- **Recommendation:** hide these or supply F1 content in the Theme Editor.

**Other observations**
- **Page title:** the rendered `<title>` repeats the brand: «… F1 | SNOSHA – سنوشا | SNOSHA», because the theme appends the store name to the SEO title.
- **Accordion headings:** «مناسبة لمين؟» and «غير مناسبة لمين؟» use the feminine form, which suits a brush, not a device.
- **Product type:** «Water Flosser» is in English on the Arabic storefront.

**Publishing note**
- The edit is in the local repository only. `theme dev` has synced it to the development theme.
- It reaches the GitHub-connected theme only after it is committed and pushed.
- If anyone edits this template in the Theme Editor before then, merge their changes rather than overwrite them.
