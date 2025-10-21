export const metadata = {
  title: "Terms of Service — Princess Azraiel",
  description: "Terms of Service for the Princess Azraiel website.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12 text-pink-100">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-pink-300">Terms of Service</h1>
        <p className="mt-2 text-pink-100/80">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </header>

      <article className="prose prose-invert prose-pink max-w-none">
        <p className="lead">
          THIS IS STILL AN EXAMPLE PAGE AND IS NOT EVEN CLOSE TO DONE YET. 
          These Terms of Service (“Terms”) govern your access to and use of this website,
          services, and content (collectively, the “Service”). By accessing or using the
          Service, you agree to be bound by these Terms.
        </p>

        <h2>1. Audience & Eligibility (+18)</h2>
        <p>
          The Service contains fictional, adult-themed material intended <strong>solely for persons
          18 years or older (or the age of majority in your jurisdiction)</strong>. You must not
          allow any minor to access the Service. By using the Service you represent and warrant
          that you meet the legal age requirement and that access is lawful in your location.
        </p>

        <h2>2. Nature of Content</h2>
        <p>
          Content is fictional and for entertainment. You are responsible for your own use of the
          Service and for ensuring that viewing such content is legal where you are located.
        </p>

        <h2>3. Accounts & Purchases</h2>
        <p>
          Certain features may involve third-party platforms (e.g., donations or purchases via
          providers such as Ko-fi, Throne, Stripe, etc.). Those are governed by the third party’s
          terms and policies. We are not responsible for third-party services.
        </p>

        <h2>4. Acceptable Use</h2>
        <ul>
          <li>No sharing of content with minors or facilitating minor access.</li>
          <li>No illegal, infringing, harassing, hateful, or abusive behavior.</li>
          <li>No attempts to bypass security, scrape at scale, or disrupt the Service.</li>
          <li>No uploading or linking to unlawful content.</li>
        </ul>

        <h2>5. Intellectual Property</h2>
        <p>
          Unless otherwise noted, the Service and all related content are owned by us or licensed
          to us and are protected by applicable IP laws. You may not reproduce, distribute, or
          create derivative works without prior written permission except as permitted by law.
        </p>

        <h2>6. Privacy</h2>
        <p>
          Your use of the Service is also subject to our{" "}
          <a href="/privacy">Privacy Policy</a>.
        </p>

        <h2>7. Disclaimers</h2>
        <p>
          The Service is provided “as is” and “as available” without warranties of any kind,
          express or implied. We do not guarantee uninterrupted or error-free operation or that
          the Service will meet your requirements.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, we shall not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or any loss of profits or
          revenues, whether incurred directly or indirectly, or any loss of data, use, or
          goodwill, resulting from your access to or use of the Service.
        </p>

        <h2>9. Indemnity</h2>
        <p>
          You agree to indemnify and hold us harmless from any claims, liabilities, damages,
          losses, and expenses arising from or related to your use of the Service or violation of
          these Terms.
        </p>

        <h2>10. Changes</h2>
        <p>
          We may modify these Terms from time to time. Material changes will be posted here with a
          new “Last updated” date. Continued use of the Service after changes constitutes
          acceptance of the updated Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Austria, without regard to conflict-of-laws
          rules. Mandatory consumer protection rules of your country of residence may still apply.
        </p>

        <h2>12. Contact</h2>
        <p>
          Questions about these Terms? Contact:{" "}
          <a href="mailto:legal@princessazraiel.example">legal@princessazraiel.example</a>
        </p>
      </article>
    </main>
  );
}
