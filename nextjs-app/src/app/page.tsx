import Link from "next/link";
import Image from "next/image";
import HeroSearch from "@/components/HeroSearch";
import {
  ArrowRight, Star, MapPin, Heart, Quote,
  TrendingUp, Clock, Award, ShieldCheck, Sparkles,
} from "lucide-react";

const FEATURED = [
  { id: 1, name: "Casa Marina", location: "Dubai Marina, UAE", rating: 4.9, price: 389, img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", tags: ["Pool", "Spa", "City View"] },
  { id: 2, name: "Le Pavillon", location: "7th Arrondissement, Paris", rating: 4.8, price: 512, img: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80", tags: ["Garden", "Bistro", "Historic"] },
  { id: 3, name: "Barefoot Blu", location: "South Malé Atoll, Maldives", rating: 4.9, price: 1080, img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", tags: ["Overwater", "Reef", "Diving"] },
  { id: 4, name: "The Mitre", location: "Mayfair, London", rating: 4.7, price: 645, img: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80", tags: ["Library Bar", "Club Lounge"] },
];

const REVIEWS = [
  { id: 1, text: "Booked Casa Marina for our anniversary. The staff remembered my wife's name from the booking note — that level of detail is rare.", author: "Sarah M.", place: "Dubai", initials: "SM", color: "bg-amber-200 text-amber-800" },
  { id: 2, text: "I've used four different platforms. LuminaStay had the best filter for 'actual desk in the room' — saved me hours of squinting at photos.", author: "James K.", place: "London", initials: "JK", color: "bg-stone-200 text-stone-800" },
  { id: 3, text: "Found a villa that was somehow both cheaper and better than other sites. Even the cancellation was painless.", author: "Priya S.", place: "Bali", initials: "PS", color: "bg-teal-200 text-teal-800" },
];

const DESTINATIONS = [
  { name: "Marrakech", desc: "Riads & rooftop markets", img: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=400&q=80", color: "from-amber-900/30" },
  { name: "Kyoto", desc: "Temples & tranquil stays", img: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=80", color: "from-red-900/30" },
  { name: "Tulum", desc: "Beach clubs & boho luxury", img: "https://images.unsplash.com/photo-1713878620016-35be7a276a59?w=400&q=80", color: "from-teal-900/30" },
  { name: "Florence", desc: "Art, wine & hilltop villas", img: "https://images.unsplash.com/photo-1767037447367-99ffa711277c?w=400&q=80", color: "from-stone-900/30" },
];

export default function HomePage() {
  return (
    <div className="flex-1">
      <section className="relative min-h-[85vh] flex items-end bg-stone-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=85"
          alt="Luxury hotel pool"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/30 to-stone-900/10" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
          <HeroSearch />
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-1">Featured</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">This month&apos;s picks</h2>
            </div>
            <Link href="/listing" className="hidden sm:flex items-center gap-1 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED.map((h) => (
              <div key={h.id} className="group bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-stone-300 transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image src={h.img} alt={h.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors cursor-pointer">
                    <Heart size={15} className="text-stone-600" />
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-semibold text-stone-800">
                    ★ {h.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-stone-900">{h.name}</h3>
                  <p className="text-sm text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {h.location}
                  </p>
                  <div className="flex gap-1.5 mt-2">
                    {h.tags.map((t) => (
                      <span key={t} className="text-[11px] px-2 py-0.5 bg-stone-100 rounded-full text-stone-500">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                    <div>
                      <span className="text-lg font-bold text-stone-900">${h.price}</span>
                      <span className="text-xs text-stone-400">/ night</span>
                    </div>
                    <Link href={`/hotel/${h.id}/room/1`}
                      className="px-4 py-2 text-sm font-medium bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all"
                    >Book</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/listing" className="sm:hidden flex items-center justify-center gap-1 text-sm font-medium text-stone-600 mt-6">
            View all <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <section className="relative h-[50vh] sm:h-[60vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=85"
          alt="Hotel room interior with ambient lighting"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <Quote size={32} className="mx-auto mb-4 text-amber-400/60" />
          <blockquote className="text-white/80 text-xl sm:text-2xl leading-relaxed font-light italic">
            &ldquo;The best thing about LuminaStay is that I don&apos;t have to read 200 reviews to know if a hotel is decent. They&apos;ve already done that part.&rdquo;
          </blockquote>
          <p className="text-stone-400 text-sm mt-4">— David C., frequent traveler</p>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-1">Explore</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-8">Trending destinations</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DESTINATIONS.map((d) => (
              <Link key={d.name} href={`/listing?dest=${d.name.toLowerCase()}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-xl"
              >
                <Image src={d.img} alt={d.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className={`absolute inset-0 bg-gradient-to-t ${d.color} via-transparent`} />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-bold">{d.name}</h3>
                  <p className="text-white/60 text-xs">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-1">Guest stories</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-10">From people who actually stayed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REVIEWS.map((r) => (
              <div key={r.id} className="bg-white p-6 rounded-2xl border border-stone-200">
                <div className="flex gap-1 mb-3">
                  {Array(5).fill(0).map((_, s) => <Star key={s} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">&ldquo;{r.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-xs font-semibold`}>{r.initials}</div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{r.author}</p>
                    <p className="text-xs text-stone-400">{r.place}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-medium text-amber-600 uppercase tracking-[0.2em] mb-1">Why us</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-4">We verify every property. Personally.</h2>
              <p className="text-stone-500 leading-relaxed mb-6">
                Before a property goes live on LuminaStay, someone from our team stays there. We check the sheets, measure the desk, photograph the bathroom — so you don&apos;t arrive to surprises.
              </p>
              <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all">
                How it works <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Award, stat: "12K+", label: "Verified properties" },
                { icon: Star, stat: "4.8★", label: "Average rating" },
                { icon: TrendingUp, stat: "2M+", label: "Travelers served" },
                { icon: Clock, stat: "Since 2021", label: "Years in operation" },
              ].map((item) => (
                <div key={item.label} className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                  <item.icon size={18} className="text-stone-400 mb-2" />
                  <div className="text-2xl font-bold text-stone-900">{item.stat}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-6 mb-6 text-xs text-stone-400">
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> SSL encrypted</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Price match guaranteed</span>
            <span className="flex items-center gap-1.5"><ShieldCheck size={14} /> Free cancellation</span>
          </div>
          <div className="bg-stone-900 rounded-2xl p-8 sm:p-12 text-center">
            <Sparkles size={28} className="mx-auto mb-4 text-amber-400/60" />
            <h2 className="text-3xl font-bold text-white mb-2">Ready to travel better?</h2>
            <p className="text-stone-400 text-sm mb-6 max-w-md mx-auto">Join 2 million travelers who start their trip with a room they can trust.</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/signup" className="px-6 py-3 bg-amber-500 text-stone-900 rounded-full text-sm font-semibold hover:bg-amber-400 transition-all">Create free account</Link>
              <Link href="/listing" className="px-6 py-3 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all">Browse hotels</Link>
            </div>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "LuminaStay",
            url: "https://luminastay.com",
            description: "Find your perfect stay. Book verified hotels worldwide.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://luminastay.com/listing?dest={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
