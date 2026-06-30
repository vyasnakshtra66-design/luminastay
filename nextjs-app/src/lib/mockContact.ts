import { ContactInfo } from "@/types";

export const MOCK_CONTACT: ContactInfo = {
  phone: "+1 (555) 123-4567",
  email: "hello@luminastay.com",
  address: "1 Sheikh Mohammed Bin Rashid Blvd, Dubai, UAE",
  workingHours: "Mon - Sun: 8:00 AM - 10:00 PM (GST)",
  lat: 25.1972,
  lng: 55.2744,
  socials: [
    { platform: "Facebook", url: "#", icon: "Facebook" },
    { platform: "Instagram", url: "#", icon: "Instagram" },
    { platform: "X", url: "#", icon: "Twitter" },
    { platform: "LinkedIn", url: "#", icon: "Linkedin" },
    { platform: "YouTube", url: "#", icon: "Youtube" },
  ],
  supportOptions: [
    { icon: "MessageCircle", title: "Live Chat", description: "Chat with our team in real-time.", action: "Start Chat" },
    { icon: "Mail", title: "Email Support", description: "Send us an email and we'll respond within 2 hours.", action: "Send Email" },
    { icon: "Phone", title: "Phone Support", description: "Speak directly with a travel expert.", action: "Call Now" },
    { icon: "Smartphone", title: "WhatsApp", description: "Message us on WhatsApp for quick help.", action: "WhatsApp Us" },
  ],
  faqs: [
    { question: "How do I cancel my booking?", answer: "You can cancel your booking through your account dashboard under My Bookings. Free cancellation is available up to 48 hours before check-in for most properties." },
    { question: "What payment methods do you accept?", answer: "We accept all major credit cards (Visa, Mastercard, Amex), UPI, Net Banking, and digital wallets including PayPal and Google Pay." },
    { question: "Can I modify my reservation dates?", answer: "Yes, you can modify your reservation dates from your account. Changes are subject to availability and may incur additional charges." },
    { question: "How do I get a refund?", answer: "Refunds are processed automatically to your original payment method within 5-7 business days after cancellation approval." },
    { question: "Do you offer group or corporate bookings?", answer: "Yes, we offer special rates for group and corporate bookings. Please contact our sales team at corporate@luminastay.com for customized quotes." },
  ],
};
