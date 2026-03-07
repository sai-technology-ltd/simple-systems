import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Simple Hiring",
  description: "Terms of Service for Simple Hiring, operated by SAI Technology Ltd.",
};

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28">
      <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-400">Terms of Service</p>
      <h1 className="mt-4 text-4xl font-bold text-zinc-900">Terms of Service</h1>
      <p className="mt-4 text-zinc-500">
        These terms apply to the use of Simple Hiring provided by SAI Technology Ltd. Product
        onboarding details, pricing, and delivery terms may supplement these general terms.
      </p>

      <div className="mt-10 space-y-8 text-zinc-600">
        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Use of the service</h2>
          <p className="mt-3">
            Customers may use Simple Hiring for legitimate business purposes in accordance with
            these terms and any product-specific instructions we provide during onboarding.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Accounts and access</h2>
          <p className="mt-3">
            Customers are responsible for maintaining the confidentiality of account credentials and
            for activity that occurs under their accounts.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Payments</h2>
          <p className="mt-3">
            Fees, billing terms, and product access conditions are presented at checkout or during
            the sales process. Access may depend on successful payment and completion of onboarding
            where applicable.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Service changes</h2>
          <p className="mt-3">
            We may update, improve, or adjust our products from time to time. Material changes that
            affect active customers should be communicated through reasonable product or account
            notices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-zinc-900">Liability and warranty</h2>
          <p className="mt-3">
            Simple Hiring is provided on a practical, business-use basis. Final language covering
            warranties, limitation of liability, governing law, and dispute resolution should be
            confirmed during legal review.
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
