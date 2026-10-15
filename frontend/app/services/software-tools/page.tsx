import { redirect } from "next/navigation";

// Software sales are no longer part of the public marketing-services catalog.
export default function SoftwareToolsPage() {
  redirect("/book-a-demo");
}
