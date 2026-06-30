import { CompanyInfo, TeamMember, Testimonial, Statistic } from "@/types";

export const MOCK_COMPANY: CompanyInfo = {
  mission: "To make luxury travel accessible to everyone by connecting travelers with the world's finest accommodations at unbeatable prices, delivering a seamless booking experience powered by technology and trust.",
  vision: "To become the world's most trusted hotel booking platform, redefining how people discover, book, and experience accommodations — making every journey unforgettable.",
  story: "LuminaStay was born in 2020 from a simple idea: travel should be effortless. Our founders, seasoned travelers themselves, recognized that booking luxury accommodations was fragmented, opaque, and often overpriced. They set out to build a platform that combines cutting-edge technology with human touch — curating only the finest hotels, negotiating exclusive rates, and providing 24/7 support. What started as a small team of four in a shared workspace has grown into a global team of 200+ travel enthusiasts serving customers in over 50 countries.",
  storyImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  features: [
    { icon: "BadgeCheck", title: "Best Price Guarantee", description: "Found a lower price elsewhere? We'll match it and give you an additional 10% off." },
    { icon: "ShieldCheck", title: "Verified Hotels", description: "Every property is personally verified for quality, cleanliness, and service standards." },
    { icon: "Lock", title: "Secure Payments", description: "Your transactions are protected with enterprise-grade encryption and fraud detection." },
    { icon: "Headphones", title: "24/7 Customer Support", description: "Our travel experts are available around the clock to assist you, in 12 languages." },
    { icon: "Zap", title: "Instant Booking", description: "Get immediate confirmation with real-time availability — no waiting, no delays." },
    { icon: "CalendarCheck", title: "Free Cancellation", description: "Most bookings include free cancellation up to 48 hours before check-in." },
  ],
  partners: [
    { name: "Marriott", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Marriott_Logo.svg/2560px-Marriott_Logo.svg.png" },
    { name: "Hilton", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Hilton_logo.svg/2560px-Hilton_logo.svg.png" },
    { name: "IHG", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/IHG_logo.svg/2560px-IHG_logo.svg.png" },
    { name: "Accor", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Accor_logo.svg/2560px-Accor_logo.svg.png" },
    { name: "Hyatt", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Hyatt_logo.svg/2560px-Hyatt_logo.svg.png" },
    { name: "Wyndham", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Wyndham_Hotels_%26_Resorts_logo.svg/2560px-Wyndham_Hotels_%26_Resorts_logo.svg.png" },
  ],
};

export const MOCK_TEAM: TeamMember[] = [
  { _id: "t1", name: "Sarah Chen", position: "CEO & Co-Founder", bio: "Former hospitality executive with 15+ years at Marriott and Accor. Passionate about redefining travel experiences through technology.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }, { platform: "twitter", url: "#" }] },
  { _id: "t2", name: "James Mitchell", position: "CTO & Co-Founder", bio: "Engineering leader from Google and Airbnb. Builds scalable platforms that serve millions of travelers worldwide.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }, { platform: "github", url: "#" }] },
  { _id: "t3", name: "Priya Patel", position: "VP of Product", bio: "Product strategist who led growth at Booking.com. Focused on creating intuitive, delightful booking experiences.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }, { platform: "twitter", url: "#" }] },
  { _id: "t4", name: "Marcus Williams", position: "VP of Partnerships", bio: "Built strategic partnerships across 50+ countries. Ensures LuminaStay offers the best hotel inventory globally.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }] },
  { _id: "t5", name: "Aiko Tanaka", position: "Head of Design", bio: "Award-winning designer who shaped experiences at Airbnb and Uber. Believes great design is invisible.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }, { platform: "dribbble", url: "#" }] },
  { _id: "t6", name: "Carlos Rodriguez", position: "VP of Customer Experience", bio: "Customer-obsessed leader from Zappos and Ritz-Carlton. Ensures every interaction exceeds expectations.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80", socials: [{ platform: "linkedin", url: "#" }, { platform: "twitter", url: "#" }] },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { _id: "rev1", name: "Emily Johnson", position: "Frequent Traveler", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", rating: 5, text: "LuminaStay completely transformed how I book hotels. The prices are unbeatable and the 24/7 support team rescued me when I missed a flight. Highly recommended!" },
  { _id: "rev2", name: "David Kim", position: "Business Executive", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", rating: 5, text: "As someone who travels weekly for work, LuminaStay's instant booking and free cancellation features are lifesavers. Their corporate rates are unmatched." },
  { _id: "rev3", name: "Sophie Laurent", position: "Travel Blogger", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80", rating: 5, text: "I've reviewed hotels in 40+ countries and LuminaStay consistently offers the best curated selection. Their verified hotel program means no unpleasant surprises." },
  { _id: "rev4", name: "Raj Mehta", position: "Family Vacationer", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80", rating: 4, text: "Booked our entire family vacation through LuminaStay — 3 cities, 5 hotels. Everything went smoothly. The kids loved the activity recommendations too!" },
  { _id: "rev5", name: "Lisa Anderson", position: "Digital Nomad", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80", rating: 5, text: "I've been using LuminaStay for all my stays across Southeast Asia. The budget hotel deals are incredible and the booking process takes less than a minute." },
];

export const MOCK_STATS: Statistic[] = [
  { key: "hotels", label: "Hotels Available", value: 3750, suffix: "+", icon: "Building2" },
  { key: "cities", label: "Cities Covered", value: 180, suffix: "+", icon: "MapPin" },
  { key: "customers", label: "Happy Customers", value: 250000, suffix: "+", icon: "Users" },
  { key: "bookings", label: "Successful Bookings", value: 500000, suffix: "+", icon: "CalendarCheck" },
];
