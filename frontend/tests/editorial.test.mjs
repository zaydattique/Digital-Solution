import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => readFile(path.join(root,file),"utf8");
test("one Manrope Google font powers the agency without additional Google font imports", async () => {
  const layout = await read("app/layout.tsx");
  assert.match(layout,/import \{ Manrope \} from "next\/font\/google"/);
  assert.doesNotMatch(layout,/Nunito_Sans|Translucent_Sans/);
  assert.match(layout,/home\/styles\/home\.css/);
  assert.doesNotMatch(layout,/editorial\.css/);
});
test("reconstructed homepage preserves working inquiry path and CMS hero media", async () => {
  const home = await read("src/features/home/components/HomePage.tsx");
  assert.match(home,/home\.heroVideoUrl/);
  assert.match(home,/home\.heroImageUrl/);
  assert.match(home,/getServiceItemHref/);
  assert.match(home,/href="#contact"/);
  assert.match(home,/project\.\$\{index\+1\}/);
  assert.doesNotMatch(home,/Digital Solutions|Nunito_Sans/);
});
test("editorial service hubs preserve all service detail routes and inquiry context", async () => {
  const hub=await read("src/features/services/components/ServiceHubView.tsx");
  assert.match(hub,/services\.map/);
  assert.match(hub,/book-a-demo\?service=/);
  assert.match(hub,/hx-capability/);
});
test("admin editable hero video, legal content and projects have server contracts", async()=>{
  const [defaults,admin,legal] = await Promise.all([read("src/lib/site.ts"),read("app/admin/page.tsx"),read("src/features/legal/components/LegalPage.tsx")]);
  for(const key of ["home.heroVideoUrl","legal.privacyBody","legal.termsBody"]){
    assert.ok(defaults.includes(key),key);
    assert.ok(admin.includes(key),key);
  }
  assert.match(admin,/Featured projects/);
  assert.match(legal,/legal\.privacyBody/);
  assert.match(legal,/legal\.termsBody/);
});
