import { redirect } from "next/navigation";
import { getSiteSettings } from "@/src/lib/site";
import { isAdminAuthenticated, logOut, saveSetting } from "./actions";
export const dynamic = "force-dynamic";
export const metadata = { title: "Content Admin | HavocX", robots: { index: false, follow: false } };
const groups = {
  "Brand": ["brand.name", "brand.tagline", "brand.logoUrl", "brand.faviconUrl", "brand.ogImageUrl", "brand.description"],
  "Homepage": ["home.heroTitle", "home.heroDescription", "home.heroImageUrl", "home.heroVideoUrl"],
  "Contact": ["contact.email", "contact.phone", "contact.phoneSecondary"],
  "Social profiles": ["social.linkedin", "social.instagram", "social.facebook", "social.website"],
};
export default async function Admin() {
  if (!await isAdminAuthenticated()) redirect("/admin/login");
  const settings = await getSiteSettings();
  return <main style={{ background: "#050d20", color: "white", minHeight: "100vh", padding: "5vw" }}>
    <header style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
      <div><h1>HavocX content manager</h1><p>Changes are stored in PostgreSQL and shown across the public site.</p></div>
      <form action={logOut}><button type="submit">Sign out</button></form>
    </header>
    {Object.entries(groups).map(([group, keys]) => <section key={group} aria-label={group} style={{ marginTop: 40 }}>
      <h2>{group}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
        {keys.map(key => <form action={saveSetting} key={key} style={{ padding: 18, border: "1px solid #315177", borderRadius: 12, display: "grid", gap: 12 }}>
          <label htmlFor={key}>{key}</label>
          <input type="hidden" name="key" value={key} />
          <textarea id={key} name="value" defaultValue={settings[key] ?? ""} rows={key.includes("Description") ? 4 : 2} maxLength={3000} style={{ padding: 10, color: "#050d20", width: "100%" }} />
          <button type="submit" style={{ background: "#2779f5", color: "white", padding: 12 }}>Save</button>
        </form>)}
      </div>
    </section>)}
  </main>;
}
