export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 animate-in fade-in">
      <h1 className="text-4xl font-bold tracking-tight mb-8">Privacy Policy</h1>
      
      <div className="prose prose-green dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, avatar image, and payment records.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
          <p>
            We use the information we collect about you to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process transactions and send you related information, including confirmations and receipts.</li>
            <li>Send you technical notices, updates, security alerts, and support and administrative messages.</li>
            <li>Respond to your comments, questions, and requests, and provide customer service.</li>
            <li>Communicate with you about products, services, offers, and events offered by Ecofy.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">3. Sharing of Information</h2>
          <p>
            We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With third-party service providers (like Stripe for payments and BetterAuth for authentication) to enable them to provide services on our behalf.</li>
            <li>In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.</li>
            <li>When you post content on community forums or comment sections, it is visible to the public.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">4. Cookies</h2>
          <p>
            We use cookies to manage sessions (authentication tokens), remember your preferences, and track analytics. You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies.
          </p>
        </section>
      </div>
    </div>
  );
}
