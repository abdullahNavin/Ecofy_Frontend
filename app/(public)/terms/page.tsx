export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Terms of Service</h1>
      
      <div className="prose prose-green dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Ecofy ("the Platform"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Platform.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">2. User Content</h2>
          <p>
            Our Platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the Platform, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content to the Platform, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">3. Premium Ideas and Payments</h2>
          <p>
            Certain ideas on the Platform may be marked as "Premium" and require a one-time payment to access. All payments are processed securely through Stripe. Refunds are generally not provided, except as required by law or in exceptional circumstances reviewed by our support team.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">4. Code of Conduct</h2>
          <p>
            You agree not to use the Platform to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Post spam or malicious content.</li>
            <li>Harass, abuse, or harm another person.</li>
            <li>Impersonate or attempt to impersonate Ecofy, an Ecofy employee, another user, or any other person or entity.</li>
            <li>Engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Platform.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
