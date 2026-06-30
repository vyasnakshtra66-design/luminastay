export interface AmadeusAddress {
  lines: string[];
  postalCode: string;
  cityName: string;
  countryCode: string;
}

export interface AmadeusGeoCode {
  latitude: number;
  longitude: number;
}

export interface AmadeusRoomType {
  category: string;
  beds: number;
  bedType: string;
}

export interface AmadeusRoom {
  type: string;
  typeEstimated: AmadeusRoomType;
  description?: { text: string };
}

export interface AmadeusPrice {
  currency: string;
  base: string;
  total: string;
  taxes?: { code: string; amount: string; currency: string; included: boolean }[];
}

export interface AmadeusCancellation {
  type: string;
  deadline: string;
  amount?: string;
}

export interface AmadeusPolicy {
  cancellations?: AmadeusCancellation[];
  paymentType?: string;
}

export interface AmadeusOffer {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  rateCode: string;
  room: AmadeusRoom;
  guests: { adults: number; childAges?: number[] };
  price: AmadeusPrice;
  policies?: AmadeusPolicy;
  commission?: { percentage: string };
}

export interface AmadeusHotelOfferResponse {
  data: AmadeusOffer[];
  meta?: { count: number };
  warnings?: { code: number; title: string; detail: string }[];
}

export interface RoomDetails {
  id: string;
  name: string;
  type: string;
  bedType: string;
  bedCount: number;
  maxGuests: number;
  description: string;
  size?: string;
  pricePerNight: number;
  currency: string;
  totalPrice: number;
  taxes: { amount: number; included: boolean }[];
  checkIn: string;
  checkOut: string;
  nights: number;
  availableRooms: number;
  breakfast: boolean;
  freeCancellation: boolean;
  cancellationDeadline?: string;
  amenities: string[];
  images: string[];
  houseRules?: HouseRule[];
}

export interface Amenity {
  id: string;
  label: string;
  icon: string;
}

export interface HouseRule {
  label: string;
  value: string;
  icon: string;
}

export interface SimilarRoom {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  rating: number;
  bedType: string;
  guests: number;
}

export type NotificationCategory =
  | "booking"
  | "payment"
  | "offer"
  | "account";

export interface DestinationData {
  _id: string;
  city: string;
  country: string;
  image: string;
  description: string;
  hotelCount: number;
  startingPrice: number;
  currency: string;
  category: string[];
  rating: number;
  latitude: number;
  longitude: number;
  popular: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeaturedHotel {
  _id: string;
  hotelId: number;
  name: string;
  image: string;
  location: string;
  rating: number;
  price: number;
  currency: string;
  destinationId: string;
}

export interface TravelGuide {
  _id: string;
  title: string;
  description: string;
  image: string;
  destinationId: string;
}

export interface NotificationData {
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: NotificationCategory;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OfferCategory =
  | "weekend"
  | "family"
  | "honeymoon"
  | "business"
  | "luxury"
  | "budget";

export interface OfferData {
  _id: string;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  hotelLocation: string;
  rating: number;
  title: string;
  description: string;
  discountPercent: number;
  couponCode: string;
  validUntil: string;
  startingPrice: number;
  currency: string;
  category: OfferCategory;
  featured: boolean;
  flashSale: boolean;
  seasonal: boolean;
  terms: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  socials: { platform: string; url: string }[];
}

export interface Testimonial {
  _id: string;
  name: string;
  position: string;
  image: string;
  rating: number;
  text: string;
}

export interface Statistic {
  key: string;
  label: string;
  value: number;
  suffix: string;
  icon: string;
}

export interface CompanyInfo {
  mission: string;
  vision: string;
  story: string;
  storyImage: string;
  features: { icon: string; title: string; description: string }[];
  partners: { name: string; logo: string }[];
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  workingHours: string;
  lat: number;
  lng: number;
  socials: { platform: string; url: string; icon: string }[];
  supportOptions: { icon: string; title: string; description: string; action: string }[];
  faqs: { question: string; answer: string }[];
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt?: string;
}

export interface FAQData {
  _id: string;
  question: string;
  answer: string;
  category: string;
  popular: boolean;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicySection {
  id: string;
  title: string;
  content: string;
  highlight?: string;
}

export interface PrivacyData {
  lastUpdated: string;
  sections: PolicySection[];
  contactEmail: string;
}

export interface TermsData {
  lastUpdated: string;
  sections: PolicySection[];
  contactEmail: string;
}
