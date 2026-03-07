import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Simple Systems",
  description: "Terms of Service for Simple Systems, operated by SAI Technology Ltd.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Terms of Service</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Terms of Service</h1>
      <p className="mt-4 text-zinc-500">
        These terms apply to the use of Simple Systems products provided by SAI Technology Ltd.
        Product-specific onboarding details, pricing, and delivery terms may supplement these
        general terms.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Use of the service</h2>
          <p className="mt-3">
            Customers may use Simple Systems for legitimate business purposes and in line with any
            reasonable product instructions we provide during setup and support.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Accounts and access</h2>
          <p className="mt-3">
            Customers are responsible for the accuracy of onboarding information, the security of
            their account access, and the way their team uses connected workspaces.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Payments and delivery</h2>
          <p className="mt-3">
            Product pricing and access terms are presented before purchase. Access is delivered
            digitally and may depend on successful payment and completion of onboarding steps.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Service updates</h2>
          <p className="mt-3">
            We may improve, maintain, or adjust the products over time. When a material change
            affects active customers, we will aim to communicate it in a reasonable way.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Liability</h2>
          <p className="mt-3">
            Simple Systems is provided on a practical, business-use basis. Final legal language for
            warranties, limitations of liability, governing law, and dispute handling should be
            confirmed as part of legal review.
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
