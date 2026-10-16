import { logIn } from "../actions";
export const metadata = { title: "Admin Sign In | HavocX", robots: { index: false, follow: false } };
export default function Login() {
  return <main style={{ minHeight: "100vh", background: "#050d20", color: "#f6f9ff", padding: "10vh 6vw" }}>
    <h1>HavocX content administration</h1>
    <p>Authorized editors only.</p>
    <form action={logIn} style={{ maxWidth: 440, display: "grid", gap: 16 }}>
      <label htmlFor="admin-pass">Admin password</label>
      <input id="admin-pass" type="password" name="password" required autoComplete="current-password" style={{ padding: 16, color: "#050d20" }} />
      <button type="submit" style={{ padding: 16, background: "#2779f5", color: "white" }}>Sign in</button>
    </form>
    <p role="status">Invalid credentials return to this page without granting access.</p>
  </main>;
}
