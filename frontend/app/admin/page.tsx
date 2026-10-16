import type { Metadata } from "next";
import { bootstrapIdentity, bootstrapHome } from "@/src/lib/site-defaults";
import { getSiteDocument } from "@/src/lib/site-content";
import { adminLogin, adminLogout, hasAdminSession, saveSiteDocument } from "./actions";
import { MediaUploader } from "@/src/features/media/components/MediaUploader";

export const metadata: Metadata = { title: "Admin | HavocX Agency", robots: { index: false, follow: false, nocache: true } };
const KEYS = ["identity", "home", "services", "projects", "footer", "contact", "seo", "media"] as const;
const examples: Record<string, object> = {
  identity: bootstrapIdentity,
  home: bootstrapHome,
  services: {}, projects: {}, footer: {}, contact: {}, seo: {}, media: {},
};

export default async function AdminPage({ searchParams }: {
  searchParams: Promise<{ key?: string; status?: string }>;
}) {
  const params = await searchParams;
  const authenticated = await hasAdminSession();
  const key = KEYS.find((item) => item === params.key) ?? "identity";
  const document = authenticated ? await getSiteDocument(key) : {};
  return (
    <main className="ds-admin-shell">
      <header className="ds-admin-header">
        <a href="/" aria-label="Return to website">HavocX Agency</a>
        {authenticated && <form action={adminLogout}><button type="submit">Sign out</button></form>}
      </header>
      {!authenticated ? (
        <section className="ds-admin-card">
          <h1>Admin access</h1>
          <p>Sign in with the admin password configured on the deployment. This page is not indexed.</p>
          {params.status && <p role="alert">Unable to sign in or the admin environment is not configured.</p>}
          <form action={adminLogin}>
            <label htmlFor="admin-password">Admin password</label>
            <input id="admin-password" name="password" type="password" minLength={12} autoComplete="current-password" required />
            <button type="submit">Sign in</button>
          </form>
        </section>
      ) : (
        <section className="ds-admin-card">
          <h1>Content management</h1>
          <p>Edit the site records backed by PostgreSQL. Only published records override site defaults. JSON objects are required.</p>
          <nav aria-label="Content categories" className="ds-admin-tabs">
            {KEYS.map((item) => <a key={item} href={`/admin?key=${item}`} aria-current={item === key ? "page" : undefined}>{item}</a>)}
          </nav>
          {params.status && <p role="status">{params.status === "saved" ? "Changes saved." : "Changes could not be saved. Check the content and server configuration."}</p>}
          <form action={saveSiteDocument}>
            <input type="hidden" name="key" value={key} />
            <label htmlFor="site-content">Editable {key} document</label>
            <textarea key={key} id="site-content" name="json" rows={21} spellCheck={false} defaultValue={JSON.stringify(Object.keys(document).length ? document : examples[key], null, 2)} />
            <button type="submit">Save {key}</button>
          </form>
          {key === "media" && <MediaUploader />}
        </section>
      )}
    </main>
  );
}
