import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Simple Hiring",
  description: "Refund Policy for Simple Hiring provided by SAI Technology Ltd.",
};

export default function RefundPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Refund Policy</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Refund Policy</h1>
      <p className="mt-4 text-zinc-500">
        Simple Hiring is delivered digitally. This policy is written to be clear and practical and
        should be reviewed against your final billing and access model before launch.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Digital product access</h2>
          <p className="mt-3">
            Refund eligibility may depend on whether access has been granted, onboarding has
            started, or the product has already been provisioned for the customer.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Requesting a refund</h2>
          <p className="mt-3">
            Customers should submit refund requests to support@simplesystems.app with their account
            email, order details, and a brief explanation of the issue.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Review process</h2>
          <p className="mt-3">
            We review requests case by case and may approve, decline, or offer an alternative
            resolution depending on the product status and circumstances.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">After access or onboarding begins</h2>
          <p className="mt-3">
            Once access has been delivered or setup has started, refunds may be limited. Where
            appropriate, we may offer support, a setup correction, or another reasonable resolution
            instead of a refund.
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
