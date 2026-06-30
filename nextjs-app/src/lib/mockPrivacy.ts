import { PrivacyData } from "@/types";

export const MOCK_PRIVACY: PrivacyData = {
  lastUpdated: "June 15, 2026",
  contactEmail: "privacy@luminastay.com",
  sections: [
    {
      id: "info-collect",
      title: "Information We Collect",
      content: "We collect information you provide directly when creating an account, making a booking, or contacting support. This includes your full name, email address, phone number, billing address, payment information, and travel preferences. We also automatically collect certain technical data when you use our platform, including your IP address, browser type, device information, operating system, and usage patterns through cookies and similar tracking technologies. Additionally, we may collect information from third-party services if you choose to sign in using Google, Facebook, or other social login providers.",
      highlight: "We only collect data that is necessary to provide you with a seamless booking experience. We never sell your personal information to third parties.",
    },
    {
      id: "data-use",
      title: "How We Use Your Data",
      content: "We use the collected data to process and manage your hotel bookings, send booking confirmations and reminders, provide customer support, personalize your experience by recommending relevant hotels and offers, process payments and prevent fraudulent transactions, comply with legal obligations, send promotional communications (with your consent), and improve our platform through analytics and user behavior analysis. We may also use anonymized data for business intelligence and product development purposes.",
      highlight: "Your data is used primarily to fulfill your bookings and improve your experience. Marketing communications are opt-in only.",
    },
    {
      id: "cookies",
      title: "Cookies Policy",
      content: "LuminaStay uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our audience comes from. Essential cookies are necessary for the basic functioning of our website, including secure login and booking processing. Functional cookies remember your preferences and settings. Analytics cookies help us understand how you interact with our platform so we can improve it. Advertising cookies (with your consent) help us show you relevant offers. You can control cookie preferences through your browser settings at any time. Disabling certain cookies may affect the functionality of our platform.",
      highlight: "You can manage your cookie preferences at any time through your browser settings. Essential cookies cannot be disabled as they are required for the platform to function.",
    },
    {
      id: "third-party",
      title: "Third-Party Services",
      content: "We integrate with trusted third-party services to provide you with the best booking experience. These include payment processors (Razorpay, Stripe, PayPal) who handle your payment data securely, analytics providers (Google Analytics, Mixpanel) who help us understand usage patterns, cloud infrastructure providers (AWS, Google Cloud) who host our platform, customer support tools (Zendesk, Intercom) who help us manage inquiries, email service providers (SendGrid, Mailchimp) who deliver transactional and promotional emails, and mapping services (Google Maps) who display hotel locations. All third-party providers are carefully vetted and contractually obligated to protect your data.",
    },
    {
      id: "data-sharing",
      title: "Data Sharing Policy",
      content: "We share your information only in the following circumstances: with hotels and property managers to fulfill your booking, with payment processors to complete transactions, with service providers who assist in our business operations, when required by law or to protect our legal rights, in connection with a business transfer (merger, acquisition, or sale of assets), and with your explicit consent. We do not sell your personal information to third parties for their marketing purposes. International data transfers are governed by standard contractual clauses and adequate data protection mechanisms.",
      highlight: "We never sell your personal data. Your information is shared only with trusted partners necessary to fulfill your booking.",
    },
    {
      id: "data-security",
      title: "Data Security",
      content: "We implement industry-standard security measures to protect your personal information. This includes 256-bit SSL/TLS encryption for all data transmitted between your browser and our servers, AES-256 encryption for stored data, regular security audits and penetration testing, PCI-DSS compliance for payment processing, strict access controls and employee training, multi-factor authentication for administrative access, and continuous monitoring for suspicious activity. While no system is completely secure, we are committed to maintaining the highest security standards and promptly addressing any vulnerabilities.",
      highlight: "Your security is our priority. We use enterprise-grade encryption and follow PCI-DSS standards for all payment processing.",
    },
    {
      id: "user-rights",
      title: "Your Rights",
      content: "Depending on your jurisdiction, you have the following rights regarding your personal data: the right to access the personal data we hold about you, the right to request correction of inaccurate data, the right to request deletion of your data ('right to be forgotten'), the right to restrict processing of your data, the right to data portability, the right to object to processing for direct marketing, the right to withdraw consent at any time, and the right to lodge a complaint with a data protection authority. To exercise any of these rights, please contact our Data Protection Officer at privacy@luminastay.com.",
    },
    {
      id: "data-retention",
      title: "Data Retention",
      content: "We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, and reporting requirements. Generally, account information is retained for the duration of your account plus 3 years after your last interaction. Booking data is retained for 5 years to comply with tax and legal obligations. Communications with our support team are retained for 2 years. Anonymized analytics data may be retained indefinitely. You can request deletion of your data at any time, subject to legal retention requirements.",
    },
    {
      id: "children-privacy",
      title: "Children's Privacy",
      content: "LuminaStay does not knowingly collect personal information from children under the age of 16. Our platform is designed for adult travelers and general audiences. If we become aware that we have collected personal data from a child without verification of parental consent, we will take steps to delete that information promptly. Parents or guardians who believe their child has provided us with personal data should contact us immediately at privacy@luminastay.com so we can investigate and take appropriate action.",
    },
    {
      id: "policy-changes",
      title: "Changes to This Policy",
      content: "We may update this Privacy Policy from time to time to reflect changes in our practices, legal requirements, or operational needs. When we make material changes, we will notify you through email (if you have an account with us) and/or a prominent notice on our website prior to the change becoming effective. The 'Last Updated' date at the top of this page will always indicate when the policy was last revised. We encourage you to review this policy periodically to stay informed about how we protect your information.",
    },
  ],
};
