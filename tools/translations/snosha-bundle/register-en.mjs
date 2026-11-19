// Registers the English translations of the SNOSHA bundle page with Shopify (Translate & Adapt storage).
// Dry run by default (prints what would change). Writes only with --apply.
//   node register-en.mjs --theme 168066810072 --skip-product           # dry run, development theme only
//   node register-en.mjs --theme 168066318552                          # dry run, live theme Snosha/main
//   node register-en.mjs --theme <id> [--skip-product] [--overwrite] --apply
// --skip-product: leave the product fields (title, description, SEO title/description) alone. Product translations
//   are store-wide (not per theme), so registering them changes the live English storefront immediately, whatever --theme is.
// --overwrite: also replace English translations that already exist with a different text (default: keep them).
// Needs a one-time CLI authorization (run by the store owner, opens a browser):
//   shopify store auth --store internal-zt-yzyuhhfk.myshopify.com --scopes read_translations,write_translations,read_themes,read_products
// Scope: theme content keys of templates/product.bundle-template.json only, plus the bundle product's PRODUCT_KEYS fields.
// Never translated (app data / tag matching): swatch "App value" (value_N), "App group" (group_value_N), badge tag.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const STORE = 'internal-zt-yzyuhhfk.myshopify.com';
const PRODUCT_ID = '10409214902488';
// Product fields translated (store-wide). Never: handle (URL), product_type ("Bundle", already English).
const PRODUCT_KEYS = ['title', 'body_html', 'meta_title', 'meta_description'];
const args = process.argv.slice(2);
const theme = args[args.indexOf('--theme') + 1];
const apply = args.includes('--apply');
const skipProduct = args.includes('--skip-product');
const overwrite = args.includes('--overwrite');
if (!theme || !/^\d+$/.test(theme)) throw new Error('Pass --theme <numeric theme id> (live Snosha/main: 168066318552)');

const here = dirname(fileURLToPath(import.meta.url));
const dict = JSON.parse(readFileSync(join(here, 'bundle-en.json'), 'utf8'));
const exclude = [/(^|\.)value_\d+(:|$)/, /(^|\.)group_value_\d+(:|$)/, /snosha_badge_tag(:|$)/];
const work = mkdtempSync(join(tmpdir(), 'snosha-en-'));

function gql(query, variables, mutation = false) {
  const qf = join(work, 'q.graphql'); writeFileSync(qf, query);
  const out = join(work, 'out.json');
  const a = ['store', 'execute', '-s', STORE, '--no-input', '--query-file', qf, '--output-file', out];
  if (variables) { const vf = join(work, 'v.json'); writeFileSync(vf, JSON.stringify(variables)); a.push('--variable-file', vf); }
  if (mutation) a.push('--allow-mutations');
  execFileSync('shopify', a, { stdio: ['ignore', 'ignore', 'inherit'], shell: process.platform === 'win32' });
  const res = JSON.parse(readFileSync(out, 'utf8'));
  if (res.errors) throw new Error(JSON.stringify(res.errors));
  return res.data ?? res;
}

const READ = `query($id: ID!) { translatableResource(resourceId: $id) { resourceId translatableContent { key value digest locale } translations(locale: "en") { key value outdated } } }`;
const WRITE = `mutation($id: ID!, $t: [TranslationInput!]!) { translationsRegister(resourceId: $id, translations: $t) { translations { key locale } userErrors { field message } } }`;

// Classifies every dictionary entry against the resource: add (no English yet), update (different English
// exists; only written with --overwrite), skip (same English already registered), excluded (app data / tag),
// missing (no matching Arabic source on this resource, e.g. a setting not uploaded yet).
function plan(resourceId, filterKey, table) {
  const r = gql(READ, { id: resourceId }).translatableResource;
  if (!r) throw new Error('Resource not found: ' + resourceId);
  const existing = Object.fromEntries((r.translations || []).map((t) => [t.key, t.value]));
  const counts = { add: 0, update: 0, keptExisting: 0, skip: 0, excluded: 0 };
  const todo = [];
  const matched = new Set();
  for (const c of r.translatableContent) {
    if (filterKey && !filterKey(c.key)) continue;
    const en = table[c.value];
    if (en === undefined) continue;
    if (exclude.some((x) => x.test(c.key))) { counts.excluded++; continue; }
    matched.add(c.value);
    if (existing[c.key] === en) { counts.skip++; continue; }
    if (existing[c.key] !== undefined && !overwrite) { counts.keptExisting++; console.log('  keep existing EN', c.key.slice(0, 90)); continue; }
    counts[existing[c.key] === undefined ? 'add' : 'update']++;
    todo.push({ locale: 'en', key: c.key, value: en, translatableContentDigest: c.digest });
  }
  const missing = Object.keys(table).filter((v) => !matched.has(v));
  return { todo, counts, missing };
}

const themeId = `gid://shopify/OnlineStoreTheme/${theme}`;
const productId = `gid://shopify/Product/${PRODUCT_ID}`;
const themePlan = plan(themeId, (k) => k.includes('product.bundle-template'), dict.theme);
const productPlan = skipProduct
  ? { todo: [], counts: { skipped: 'all (--skip-product)' }, missing: [] }
  : plan(productId, (k) => PRODUCT_KEYS.includes(k), dict.product);
const themeTodo = themePlan.todo;
const productTodo = productPlan.todo;
console.log(`Theme ${theme}: ${JSON.stringify(themePlan.counts)}; dictionary entries with no source on this theme: ${themePlan.missing.length}`);
for (const m of themePlan.missing) console.log('  missing source:', m.replace(/<[^>]+>/g, '').slice(0, 80));
console.log(`Product ${PRODUCT_ID}: ${JSON.stringify(productPlan.counts)}; dictionary entries with no source on the product: ${productPlan.missing.length}`);
for (const t of [...themeTodo, ...productTodo]) console.log(' ', t.key.slice(0, 110), '=>', t.value.replace(/<[^>]+>/g, '').slice(0, 70));

if (!apply) { console.log('\nDry run only. Re-run with --apply to register.'); process.exit(0); }
for (const [id, list] of [[themeId, themeTodo], [productId, productTodo]]) {
  for (let i = 0; i < list.length; i += 50) {
    const res = gql(WRITE, { id, t: list.slice(i, i + 50) }, true).translationsRegister;
    if (res.userErrors?.length) console.error('rejected (userErrors):', JSON.stringify(res.userErrors));
    console.log(`registered ${res.translations?.length ?? 0} on ${id}`);
  }
}
