import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Simple Systems",
  description: "Refund Policy for Simple Systems products provided by SAI Technology Ltd.",
};

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Refund Policy</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Refund Policy</h1>
      <p className="mt-4 text-zinc-500">
        Simple Systems products are delivered digitally. This policy is written to be clear and
        practical, and should be reviewed against your final commercial terms before launch.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Before access is delivered</h2>
          <p className="mt-3">
            If a payment is made but access has not yet been delivered or onboarding has not yet
            started, refund requests are generally easier to review and approve.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">After access or onboarding begins</h2>
          <p className="mt-3">
            Once access has been delivered, setup has started, or product-specific work has been
            provisioned for a customer, refunds may be limited or declined.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">How to request a refund</h2>
          <p className="mt-3">
            Email support@simplesystems.app with the purchase email, order details, and a short
            explanation of the issue. We review requests case by case.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Alternative resolutions</h2>
          <p className="mt-3">
            Where appropriate, we may offer support, a setup correction, or another reasonable
            resolution instead of a refund.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Contact</h2>
          <p className="mt-3">
            SAI Technology Ltd
            <br />
            Accra, Ghana
            <br />
            Email: support@simplesystems.app
          </p>
        </section>
      </div>
    </main>
  );
}
