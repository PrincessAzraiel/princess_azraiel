// /pre-order is a legacy URL for the same product page as /infection.
//
// It renders the identical component rather than a copy of it, so prices,
// tiers and personas are only ever edited in one place. Its metadata points
// the canonical at /infection, so search engines don't see two products.
//
// `dynamic` and `fetchCache` are declared here rather than re-exported:
// Next reads route segment config statically and rejects a re-export.
import { metadata as infectionMetadata } from "@/app/(experiences)/infection/page";
import InfectionClient from "@/app/(experiences)/infection/PreOrderClient";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const metadata = infectionMetadata;

export default function PreOrderPage() {
  return <InfectionClient />;
}
