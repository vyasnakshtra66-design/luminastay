export interface ListingHotel {
  id: number;
  name: string;
  location: string;
  rating: number;
  stars: number;
  price: number;
  original: number | null;
  discount: number | null;
  img: string;
  images: string[];
  room: string;
  dist: string;
  freeCancel: boolean;
  breakfast: boolean;
  propertyType: string;
  amenities: string[];
  lat: number;
  lng: number;
}

const PREFIXES = [
  "Grand", "Royal", "The", "Al", "Golden", "Silver", "Majestic", "Palm", "Pearl", "Dubai",
  "Creek", "Desert", "Oasis", "Emirates", "Arabian", "Gulf", "City", "Stellar", "Crystal", "Elite",
];

const NAMES = [
  "Plaza", "Tower", "Palace", "Resort", "Hotel", "Suites", "Inn", "Villas", "Retreat", "Spa",
  "Heights", "Marina", "View", "Bay", "Palm", "Gardens", "Grandeur", "Luxury", "Premier", "Regency",
  "Continental", "Riviera", "Sanctuary", "Haven", "Terrace", "Skylight", "Horizon", "Summit", "Prestige", "Heritage",
  "Ambassador", "Crown", "Diamond", "Sapphire", "Emerald", "Ruby", "Opal", "Platinum", "Gold", "Silver",
  "Star", "Moonlight", "Sunset", "Sunrise", "Skyline", "Skyview", "Lakeview", "Seaview", "Mountain", "Valley",
  "Garden", "Park", "Square", "Central", "Metro", "Urban", "Modern", "Classic", "Vintage", "Timeless",
  "Executive", "Business", "Commerce", "Trade", "Financial", "Capital", "Sultan", "Prince", "Kings", "Queens",
  "Palm Jumeirah", "Marina Walk", "Deira", "Bur Dubai", "JBR", "Downtown", "Business Bay", "Al Barsha", "Mirdif", "JLT",
  "Arabian Ranches", "The Palm", "Bluewaters", "City Walk", "Al Furjan", "Dubai Hills", "Dubai Creek", "Al Qudra", "Hatta", "Fujairah",
];

const LOCATIONS = [
  "Dubai Marina, UAE", "Palm Jumeirah, Dubai", "Downtown Dubai, UAE", "Jumeirah Beach, Dubai",
  "Abu Dhabi, UAE", "Business Bay, Dubai", "Deira, Dubai", "Sharjah, UAE",
  "Al Barsha, Dubai", "Dubai Creek, UAE", "JLT, Dubai", "Ras Al Khaimah, UAE",
  "Ajman, UAE", "Fujairah, UAE", "Hatta, Dubai", "Al Ain, UAE",
  "Mirdif, Dubai", "Dubai Silicon Oasis", "Dubai South", "City Walk, Dubai",
  // India
  "Mumbai, India", "Delhi, India", "Jaipur, India", "Goa, India",
  "Agra, India", "Varanasi, India", "Udaipur, India", "Kerala, India",
  "Bengaluru, India", "Chennai, India", "Kolkata, India", "Hyderabad, India",
  "Rishikesh, India", "Shimla, India", "Manali, India", "Darjeeling, India",
  // Singapore & Hong Kong & Paris
  "Marina Bay, Singapore", "Sentosa, Singapore", "Orchard Road, Singapore",
  "Central, Hong Kong", "Kowloon, Hong Kong", "Lantau Island, Hong Kong",
  "Paris, France", "Montmartre, Paris", "Le Marais, Paris", "Versailles, France",
];

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "Dubai Marina, UAE": { lat: 25.0805, lng: 55.1403 },
  "Palm Jumeirah, Dubai": { lat: 25.1124, lng: 55.1390 },
  "Downtown Dubai, UAE": { lat: 25.2048, lng: 55.2708 },
  "Jumeirah Beach, Dubai": { lat: 25.2150, lng: 55.2370 },
  "Abu Dhabi, UAE": { lat: 24.4539, lng: 54.3773 },
  "Business Bay, Dubai": { lat: 25.1863, lng: 55.2634 },
  "Deira, Dubai": { lat: 25.2600, lng: 55.3120 },
  "Sharjah, UAE": { lat: 25.3463, lng: 55.4209 },
  "Al Barsha, Dubai": { lat: 25.1060, lng: 55.1970 },
  "Dubai Creek, UAE": { lat: 25.2422, lng: 55.3160 },
  "JLT, Dubai": { lat: 25.0680, lng: 55.1400 },
  "Ras Al Khaimah, UAE": { lat: 25.8000, lng: 55.9500 },
  "Ajman, UAE": { lat: 25.4050, lng: 55.5130 },
  "Fujairah, UAE": { lat: 25.1288, lng: 56.3415 },
  "Hatta, Dubai": { lat: 24.8180, lng: 56.1340 },
  "Al Ain, UAE": { lat: 24.2075, lng: 55.7447 },
  "Mirdif, Dubai": { lat: 25.2290, lng: 55.4170 },
  "Dubai Silicon Oasis": { lat: 25.0650, lng: 55.3200 },
  "Dubai South": { lat: 24.9000, lng: 55.1700 },
  "City Walk, Dubai": { lat: 25.2020, lng: 55.2570 },
  // India
  "Mumbai, India": { lat: 19.0760, lng: 72.8777 },
  "Delhi, India": { lat: 28.7041, lng: 77.1025 },
  "Jaipur, India": { lat: 26.9124, lng: 75.7873 },
  "Goa, India": { lat: 15.4909, lng: 73.8278 },
  "Agra, India": { lat: 27.1767, lng: 78.0081 },
  "Varanasi, India": { lat: 25.3176, lng: 82.9739 },
  "Udaipur, India": { lat: 24.5854, lng: 73.7125 },
  "Kerala, India": { lat: 10.8505, lng: 76.2711 },
  "Bengaluru, India": { lat: 12.9716, lng: 77.5946 },
  "Chennai, India": { lat: 13.0827, lng: 80.2707 },
  "Kolkata, India": { lat: 22.5726, lng: 88.3639 },
  "Hyderabad, India": { lat: 17.3850, lng: 78.4867 },
  "Rishikesh, India": { lat: 30.0869, lng: 78.2676 },
  "Shimla, India": { lat: 31.1048, lng: 77.1734 },
  "Manali, India": { lat: 32.2396, lng: 77.1887 },
  "Darjeeling, India": { lat: 27.0410, lng: 88.2663 },
  // Singapore
  "Marina Bay, Singapore": { lat: 1.2834, lng: 103.8607 },
  "Sentosa, Singapore": { lat: 1.2494, lng: 103.8302 },
  "Orchard Road, Singapore": { lat: 1.3049, lng: 103.8318 },
  // Hong Kong
  "Central, Hong Kong": { lat: 22.2799, lng: 114.1588 },
  "Kowloon, Hong Kong": { lat: 22.3193, lng: 114.1694 },
  "Lantau Island, Hong Kong": { lat: 22.2665, lng: 113.9387 },
  // Paris
  "Paris, France": { lat: 48.8566, lng: 2.3522 },
  "Montmartre, Paris": { lat: 48.8867, lng: 2.3431 },
  "Le Marais, Paris": { lat: 48.8594, lng: 2.3619 },
  "Versailles, France": { lat: 48.8049, lng: 2.1204 },
};

const ROOM_TYPES = [
  "Standard Room", "Deluxe Room", "Executive Suite", "Junior Suite",
  "Presidential Suite", "Ocean View Room", "Sea View Room", "City View Room",
  "Pool View Room", "Corner Suite", "Penthouse Suite", "Garden Villa",
  "Beach Bungalow", "Family Room", "Twin Room", "King Room",
  "Ambassador Suite", "Royal Suite", "Studio", "Apartment",
];

const ROOM_EXTRAS = [
  "· Ocean View", "· Sea View", "· City View", "· Pool View",
  "· Garden View", "· Skyline View", "· Marina View", "· Creek View",
  "· Beachfront", "· Corner Room", "", "", "", "",
];

const DISTANCES = [
  "0.3 km", "0.5 km", "0.8 km", "1.0 km", "1.2 km", "1.5 km", "1.8 km",
  "2.0 km", "2.3 km", "2.5 km", "2.8 km", "3.0 km", "3.2 km", "3.5 km",
  "4.0 km", "4.2 km", "4.5 km", "5.0 km", "6.0 km", "7.0 km", "8.0 km",
  "10 km", "12 km", "15 km", "20 km", "25 km",
];

const PROPERTY_TYPES = ["Hotel", "Resort", "Villa", "Apartment", "Boutique"];
const ALL_AMENITIES = ["Pool", "Spa", "Gym", "Restaurant", "Free Wi-Fi", "Parking", "Airport Shuttle"];

const IMAGES = [
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80",
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
  "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80",
  "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80",
  "https://images.unsplash.com/photo-1601918774946-25832a0be0d9?w=600&q=80",
  "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80",
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80",
  "https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=600&q=80",
  "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=600&q=80",
  "https://images.unsplash.com/photo-1602075432748-82d264e2b7d5?w=600&q=80",
  "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=600&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  "https://images.unsplash.com/photo-1600595950808-5663771c083f?w=600&q=80",
  "https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=600&q=80",
  "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80",
  "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&q=80",
  "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=600&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80",
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600&q=80",
  "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=600&q=80",
  "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=600&q=80",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80",
  "https://images.unsplash.com/photo-1549638441-b787d2e11f14?w=600&q=80",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
];

function pseudoRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pickN<T>(arr: T[], n: number, rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

export function getHotelImages(hotelId: number): string[] {
  const rand = pseudoRandom(hotelId * 9973);
  return pickN(IMAGES, 4, rand);
}

export function getHotelsForPage(page: number): ListingHotel[] {
  const hotels: ListingHotel[] = [];
  const startId = (page - 1) * 6 + 1;

  for (let i = 0; i < 6; i++) {
    const id = startId + i;
    const seed = id * 9973;
    const rand = pseudoRandom(seed);

    const prefix = PREFIXES[Math.floor(rand() * PREFIXES.length)];
    const name = NAMES[Math.floor(rand() * NAMES.length)];
    const fullName = prefix === "The" || prefix === "Al"
      ? `${prefix} ${name}`
      : `${prefix} ${name}`;

    const location = LOCATIONS[Math.floor(rand() * LOCATIONS.length)];
    const coords = LOCATION_COORDS[location] || { lat: 25.2, lng: 55.3 };
    const stars = [5, 5, 4, 4, 4, 3, 3][Math.floor(rand() * 7)];
    const rating = +(4.0 + rand() * 1.0).toFixed(1);
    const basePrice = 80 + rand() * 900;
    const hasDiscount = rand() > 0.55;
    const discountPct = hasDiscount ? [10, 15, 18, 20, 25, 30][Math.floor(rand() * 6)] : null;
    const price = Math.round(hasDiscount ? basePrice * (1 - (discountPct ?? 0) / 100) : basePrice);
    const original = hasDiscount ? Math.round(basePrice) : null;

    const images = pickN(IMAGES, 4, rand);
    const roomType = ROOM_TYPES[Math.floor(rand() * ROOM_TYPES.length)];
    const extra = ROOM_EXTRAS[Math.floor(rand() * ROOM_EXTRAS.length)];
    const room = `${roomType}${extra}`;
    const dist = DISTANCES[Math.floor(rand() * DISTANCES.length)] + " from center";

    const freeCancel = rand() > 0.25;
    const breakfast = rand() > 0.4;
    const propertyType = PROPERTY_TYPES[Math.floor(rand() * PROPERTY_TYPES.length)];
    const amenityCount = 2 + Math.floor(rand() * 4);
    const amenities = pickN(ALL_AMENITIES, amenityCount, rand);

    hotels.push({
      id,
      name: fullName,
      location,
      rating,
      stars,
      price,
      original,
      discount: discountPct,
      img: images[0],
      images,
      room,
      dist,
      freeCancel,
      breakfast,
      propertyType,
      amenities,
      lat: coords.lat + (rand() - 0.5) * 0.02,
      lng: coords.lng + (rand() - 0.5) * 0.02,
    });
  }

  return hotels;
}

let allHotelsCache: ListingHotel[] | null = null;

export function getAllHotels(): ListingHotel[] {
  if (allHotelsCache) return allHotelsCache;
  const hotels: ListingHotel[] = [];
  for (let page = 1; page <= TOTAL_PAGES; page++) {
    hotels.push(...getHotelsForPage(page));
  }
  allHotelsCache = hotels;
  return hotels;
}

export const TOTAL_PAGES = 115;
export const HOTELS_PER_PAGE = 6;
