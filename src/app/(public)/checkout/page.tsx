import type { Metadata } from "next";

import { CheckoutClient } from "@/components/public/checkout-client";

export const metadata: Metadata = {
  title: "Carrito",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
