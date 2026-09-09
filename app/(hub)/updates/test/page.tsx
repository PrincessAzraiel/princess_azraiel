import { notFound } from "next/navigation";

// A scratch page that was reachable in production. Hidden with the rest of
// /updates; delete outright if it is not needed again.
export default function Page() {
  notFound();
}
