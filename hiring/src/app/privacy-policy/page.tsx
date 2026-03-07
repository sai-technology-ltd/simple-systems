import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Simple Hiring",
  description: "Privacy Policy for Simple Hiring, operated by SAI Technology Ltd in Accra, Ghana.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Privacy Policy</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Privacy Policy</h1>
      <p className="mt-4 text-zinc-500">
        Simple Hiring is operated by SAI Technology Ltd, based in Accra, Ghana. This page explains
        in plain language how we handle information related to the Simple Hiring product.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Information we collect</h2>
          <p className="mt-3">
            We may collect contact details, billing information, onboarding details, and limited
            product usage information needed to provide access to Simple Hiring and support
            customers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">How we use information</h2>
          <p className="mt-3">
            We use information to deliver product access, complete onboarding, process payments,
            provide support, maintain service performance, and communicate important account or
            product updates.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Data sharing</h2>
          <p className="mt-3">
            We may share information with service providers that help us operate the business, such
            as payment, hosting, email, analytics, or customer support providers, where reasonably
            necessary to deliver the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Data retention</h2>
          <p className="mt-3">
            We retain information for as long as needed to provide the service, meet legal and
            financial obligations, resolve disputes, and enforce our agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Your choices</h2>
          <p className="mt-3">
            Customers may contact us to request updates, corrections, or account-related support in
            relation to Simple Hiring.
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
