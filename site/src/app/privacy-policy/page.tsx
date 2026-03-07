import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Simple Systems",
  description: "Privacy Policy for Simple Systems, operated by SAI Technology Ltd in Accra, Ghana.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Privacy Policy</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Privacy Policy</h1>
      <p className="mt-4 text-zinc-500">
        Simple Systems is operated by SAI Technology Ltd, based in Accra, Ghana. This policy
        explains, at a high level, how we handle customer and visitor information across the Simple
        Systems product line.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Information we collect</h2>
          <p className="mt-3">
            We may collect contact details, billing information, onboarding details, and limited
            product usage information needed to deliver access, support customers, and operate
            Simple Systems products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">How we use information</h2>
          <p className="mt-3">
            We use information to provide product access, complete onboarding, process payments,
            respond to support requests, send essential service communications, and improve the
            reliability of our products.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Third-party services</h2>
          <p className="mt-3">
            We may use third-party providers for payments, hosting, email delivery, analytics, and
            connected workspace functionality where reasonably necessary to deliver the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Retention</h2>
          <p className="mt-3">
            We keep information for as long as needed to provide the service, meet legal and
            financial obligations, resolve disputes, and maintain business records.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Your choices</h2>
          <p className="mt-3">
            You can contact us to request updates to your account information or to ask questions
            about how your information is used in relation to a Simple Systems product.
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
