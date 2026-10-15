import { redirect } from "next/navigation";

// Preserve legacy direct links without keeping checkout under the public service taxonomy.
export default function LegacyCheckoutPage() {
  redirect("/checkout");
}
