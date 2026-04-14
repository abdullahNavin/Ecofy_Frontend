import { Suspense } from "react";
import PaymentSuccessPageClient from "./PaymentSuccessPageClient";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessPageClient />
    </Suspense>
  );
}
