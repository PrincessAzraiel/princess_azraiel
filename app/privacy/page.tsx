export const metadata = {
  title: "Privacy Policy — Princess Azraiel",
  description: "Privacy Policy (GDPR/DSGVO) for the Princess Azraiel website.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-pink-100">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-pink-300">Privacy Policy</h1>
        <p className="mt-2 text-pink-100/80">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="prose prose-invert prose-pink max-w-none">
        <p className="lead">
          THIS IS STILL AN EXAMPLE PAGE AND IS NOT EVEN CLOSE TO DONE YET. 
          This Privacy Policy explains how we process personal data when you use this website
          (the “Service”). We act as <strong>controller</strong> under the EU General Data
          Protection Regulation (GDPR).
        </p>

        <h2>1. Controller & Contact</h2>
        <p>
          Controller: Princess Azraiel (project). Contact:{" "}
          <a href="mailto:privacy@princessazraiel.example">privacy@princessazraiel.example</a>
        </p>

        <h2>2. What Data We Process</h2>
        <ul>
          <li>
            <strong>Technical data</strong>: IP address, device/browser info, pages viewed,
            timestamps, basic diagnostics and security logs.
          </li>
          <li>
            <strong>Cookies/local storage</strong>: e.g., your age-gate decision (<code>age_ok</code>).
          </li>
          <li>
            <strong>Contact/Report submissions</strong>: the info you send us via forms or email.
          </li>
          <li>
            <strong>Payments/Donations</strong> (if used): processed by third-party providers
            (e.g., Ko-fi, Throne, Stripe). We receive limited info necessary for fulfilment and
            support; full card data never touches our servers.
          </li>
        </ul>

        <h2>3. Purposes & Legal Bases</h2>
        <ul>
          <li>
            <em>Provide and secure the Service</em> (Art. 6(1)(f) GDPR — legitimate interests).
          </li>
          <li>
            <em>Consent-based features</em>, e.g., cookies not strictly necessary (Art. 6(1)(a) GDPR).
          </li>
          <li>
            <em>Contract/transactions</em> when you purchase or donate via third parties (Art. 6(1)(b) GDPR).
          </li>
          <li>
            <em>Legal obligations</em> such as accounting or responding to lawful requests (Art. 6(1)(c) GDPR).
          </li>
        </ul>

        <h2>4. Cookies</h2>
        <p>
          We use essential cookies (e.g., age-gate). Where required, we’ll request consent for
          non-essential cookies/analytics. You can clear cookies in your browser settings at any time.
        </p>

        <h2>5. Recipients & Transfers</h2>
        <p>
          We may share data with service providers (hosting, security, analytics, payment/donation
          processors) under data-processing agreements. If data is transferred outside the EEA, we
          use appropriate safeguards (e.g., SCCs) where required.
        </p>

        <h2>6. Retention</h2>
        <p>
          We keep data only as long as necessary for the purposes collected, or as required by law.
          For example, the age-gate cookie is kept up to 12 months; support emails are kept as long
          as needed to resolve the issue; transaction records as required by tax law.
        </p>

        <h2>7. Your Rights (EU/EEA)</h2>
        <ul>
          <li>Access, rectification, and erasure.</li>
          <li>Restriction and objection to processing.</li>
          <li>Data portability.</li>
          <li>Withdraw consent at any time (does not affect prior processing).</li>
          <li>
            Lodge a complaint with your local authority. In Austria:{" "}
            <a href="https://www.dsb.gv.at/">Österreichische Datenschutzbehörde (DSB)</a>.
          </li>
        </ul>

        <h2>8. Minors</h2>
        <p>
          The Service is for adults only. We do not knowingly collect data from minors. If you
          believe a minor has provided data, contact us to delete it.
        </p>

        <h2>9. Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect personal data,
          considering the state of the art and risks involved.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Policy; material changes will be posted here with a new date.
        </p>

        <h2>11. Contact</h2>
        <p>
          Privacy questions or requests:{" "}
          <a href="mailto:privacy@princessazraiel.example">privacy@princessazraiel.example</a>
        </p>
      </article>
    </main>
  );
}
