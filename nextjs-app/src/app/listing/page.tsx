"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, MapPin, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Check, Coffee, X, ArrowUpDown, SearchX, RotateCcw } from "lucide-react";
import { getAllHotels, TOTAL_PAGES } from "@/lib/hotelData";
import ListingFilters from "@/components/ListingFilters";

const SORT_OPTIONS = ["Recommended", "Lowest Price", "Highest Price", "Best Rating"];

function getPageNumbers(current: number, total: number): (number | "dots")[] {
  const pages: (number | "dots")[] = [];
  if (total <= 7) { for (let i = 1; i <= total; i++) pages.push(i); return pages; }
  pages.push(1);
  if (current > 3) pages.push("dots");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("dots");
  pages.push(total);
  return pages;
}

const PRICE_RANGES = [
  { label: "Under $200", min: 0, max: 200 },
  { label: "$200 - $400", min: 200, max: 400 },
  { label: "$400 - $600", min: 400, max: 600 },
  { label: "$600 - $900", min: 600, max: 900 },
  { label: "Above $900", min: 900, max: Infinity },
];

function ListingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [showTop, setShowTop] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState<Record<number, number>>({});

  const [selPrice, setSelPrice] = useState<Set<string>>(new Set((searchParams.get("price") || "").split(",").filter(Boolean)));
  const [selStars, setSelStars] = useState<Set<number>>(new Set((searchParams.get("stars") || "").split(",").filter(Boolean).map(Number)));
  const [selRating, setSelRating] = useState(searchParams.get("rating") || "");
  const [selType, setSelType] = useState<Set<string>>(new Set((searchParams.get("type") || "").split(",").filter(Boolean)));
  const [selAmen, setSelAmen] = useState<Set<string>>(new Set((searchParams.get("amen") || "").split(",").filter(Boolean)));
  const [destFilter, setDestFilter] = useState(searchParams.get("dest") || "");
  const [sortActive, setSortActive] = useState(searchParams.get("sort") || "Recommended");

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setCurrentPage(Math.max(1, Math.min(TOTAL_PAGES, p || 1)));
  }, [searchParams]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 1) params.set("page", String(currentPage));
    if (selPrice.size) params.set("price", Array.from(selPrice).join(","));
    if (selStars.size) params.set("stars", Array.from(selStars).join(","));
    if (selRating) params.set("rating", selRating);
    if (selType.size) params.set("type", Array.from(selType).join(","));
    if (selAmen.size) params.set("amen", Array.from(selAmen).join(","));
    if (destFilter) params.set("dest", destFilter);
    if (sortActive !== "Recommended") params.set("sort", sortActive);
    const qs = params.toString();
    router.replace(qs ? `/listing?${qs}` : "/listing", { scroll: false });
  }, [currentPage, selPrice, selStars, selRating, selType, selAmen, destFilter, sortActive, router]);

  const goToPage = useCallback((p: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(p === 1 ? "/listing" : `/listing?page=${p}`, { scroll: false });
  }, [router]);

  const toggleSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    setter(prev => { const next = new Set(prev); if (next.has(value)) next.delete(value); else next.add(value); return next; });
  };

  const allHotels = useMemo(() => getAllHotels(), []);

  const filteredHotels = useMemo(() => {
    return allHotels.filter(h => {
      if (selPrice.size > 0) {
        const match = Array.from(selPrice).some(l => {
          const r = PRICE_RANGES.find(p => p.label === l);
          return r ? h.price >= r.min && h.price < r.max : false;
        });
        if (!match) return false;
      }
      if (selStars.size > 0 && !selStars.has(h.stars)) return false;
      if (selRating) {
        const min = selRating === "Excellent 9+" ? 9 : selRating === "Very Good 8+" ? 8 : selRating === "Good 7+" ? 7 : 0;
        if (h.rating < min) return false;
      }
      if (selType.size > 0 && !selType.has(h.propertyType)) return false;
      if (selAmen.size > 0 && !Array.from(selAmen).every(a => h.amenities.includes(a))) return false;
      if (destFilter && !h.location.toLowerCase().includes(destFilter.toLowerCase()) && !h.name.toLowerCase().includes(destFilter.toLowerCase())) return false;
      return true;
    });
  }, [allHotels, selPrice, selStars, selRating, selType, selAmen, destFilter]);

  const sortedHotels = useMemo(() => {
    const list = [...filteredHotels];
    if (sortActive === "Lowest Price") return list.sort((a, b) => a.price - b.price);
    if (sortActive === "Highest Price") return list.sort((a, b) => b.price - a.price);
    if (sortActive === "Best Rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [filteredHotels, sortActive]);

  const totalFilteredPages = useMemo(() => Math.max(1, Math.ceil(sortedHotels.length / 6)), [sortedHotels]);
  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * 6;
    return sortedHotels.slice(start, start + 6);
  }, [sortedHotels, currentPage]);

  const resetFilters = () => { setSelPrice(new Set()); setSelStars(new Set()); setSelRating(""); setSelType(new Set()); setSelAmen(new Set()); };
  const activeCount = selPrice.size + selStars.size + (selRating ? 1 : 0) + selType.size + selAmen.size;
  const pageNumbers = getPageNumbers(currentPage, totalFilteredPages);

  const activeTags = [
    ...Array.from(selPrice).map(l => ({ key: l, label: l, onRemove: () => toggleSet(setSelPrice, l) })),
    ...Array.from(selStars).map(s => ({ key: `s${s}`, label: `${s}★`, onRemove: () => toggleSet(setSelStars, s) })),
    ...(selRating ? [{ key: "rating", label: selRating, onRemove: () => setSelRating("") }] : []),
    ...Array.from(selType).map(t => ({ key: t, label: t, onRemove: () => toggleSet(setSelType, t) })),
    ...Array.from(selAmen).map(a => ({ key: a, label: a, onRemove: () => toggleSet(setSelAmen, a) })),
  ];

  return (
    <>
      <div className="relative h-[260px] sm:h-[300px] overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=85" alt="World" fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase mb-2">Find Your Perfect Stay</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">Hotels <span className="text-amber-300">Worldwide</span></h1>
          <p className="text-white/70 text-sm max-w-lg">Discover 690+ handpicked hotels — from luxury resorts to budget-friendly stays</p>
          <div className="flex items-center gap-6 mt-4 text-white/60 text-xs">
            <div className="text-center"><div className="text-white font-bold text-base">690+</div>Hotels</div>
            <div className="w-px h-7 bg-white/20" />
            <div className="text-center"><div className="text-white font-bold text-base">{TOTAL_PAGES}</div>Pages</div>
            <div className="w-px h-7 bg-white/20" />
            <div className="text-center"><div className="text-white font-bold text-base">4.7</div>Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex gap-6">
          <ListingFilters
            selPrice={selPrice} selStars={selStars} selRating={selRating} selType={selType} selAmen={selAmen}
            onTogglePrice={(l) => toggleSet(setSelPrice, l)}
            onToggleStars={(s) => toggleSet(setSelStars, s)}
            onSetRating={(r) => setSelRating(selRating === r ? "" : r)}
            onToggleType={(t) => toggleSet(setSelType, t)}
            onToggleAmen={(a) => toggleSet(setSelAmen, a)}
            onReset={resetFilters} activeCount={activeCount}
            filterOpen={filterOpen} onToggle={() => setFilterOpen(!filterOpen)}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-3 mb-4 pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">
                <strong className="text-gray-900">{filteredHotels.length}</strong> hotels
                {activeCount > 0 && <span className="text-gray-300"> of {allHotels.length}</span>}
                <span className="text-gray-300 mx-1">&middot;</span>
                <span className="text-gray-400">Page {currentPage}/{totalFilteredPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setFilterOpen(true)} className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                  <RotateCcw size={14} /> Filters {activeCount > 0 && <span className="px-1 py-0.5 bg-gray-900 text-white text-[10px] rounded-full">{activeCount}</span>}
                </button>
                <div className="relative">
                  <button onClick={() => setSortOpen(!sortOpen)}
                    className="flex items-center gap-1.5 text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-500 hover:border-gray-400 outline-none whitespace-nowrap">
                    <ArrowUpDown size={13} />{sortActive} <ChevronDown size={13} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {sortOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                        {SORT_OPTIONS.map(s => (
                          <button key={s} onClick={() => { setSortActive(s); setSortOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${s === sortActive ? 'font-semibold text-gray-900 bg-gray-50' : 'text-gray-500'}`}>
                            {s === sortActive && <Check size={13} className="inline mr-1.5" />}{s}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {paginatedHotels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 mb-5 rounded-full bg-gray-100 flex items-center justify-center">
                  <SearchX size={30} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No results found</h3>
                <p className="text-sm text-gray-400 max-w-xs mb-4">
                  {destFilter ? `No hotels match "${destFilter}" with your current filters.` : "Try adjusting or clearing your filters to see more hotels."}
                </p>
                {activeTags.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-1.5 mb-4 max-w-sm">
                    {activeTags.map(t => (
                      <button key={t.key} onClick={t.onRemove}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full hover:bg-gray-200 transition-colors">
                        {t.label} <X size={12} />
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={resetFilters} className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all">
                  <RotateCcw size={14} /> Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedHotels.map((h) => (
                  <div key={h.id} className="flex flex-col sm:flex-row border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <div className="sm:w-[260px] lg:w-[300px] flex-shrink-0">
                      <div className="relative h-[200px] sm:h-[160px] overflow-hidden bg-gray-100">
                        {h.discount && (
                          <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded-full z-10">-{h.discount}%</span>
                        )}
                        <div className="absolute bottom-2 left-2 flex gap-0.5 z-10">
                          {Array(h.stars).fill(0).map((_, i) => <Star key={i} size={11} className="fill-white text-white drop-shadow-sm" />)}
                        </div>
                        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-white/90 backdrop-blur-sm rounded text-[11px] font-bold text-gray-900 z-10 shadow-sm">{h.rating}</div>
                        <Image
                          src={h.images[activeImgIdx[h.id] || 0]}
                          alt={h.name}
                          fill
                          sizes="(max-width: 640px) 100vw, 300px"
                          className="object-cover transition-opacity duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" }}
                        />
                      </div>
                      <div className="flex gap-1 px-1 pt-1.5">
                        {h.images.map((url, i) => (
                          <button key={i} onClick={() => setActiveImgIdx(p => ({...p, [h.id]: i}))}
                            className={`flex-1 h-[42px] rounded-md overflow-hidden border-2 transition-all ${(activeImgIdx[h.id] || 0) === i ? 'border-gray-900 ring-1 ring-gray-900 opacity-100' : 'border-gray-200 opacity-60 hover:opacity-100'}`}>
                            <Image src={url} alt={h.name} width={100} height={42} className="object-cover w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{h.name}</h3>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><MapPin size={11} />{h.location}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-gray-900">
                              {h.original ? <><span className="text-xs text-gray-300 line-through mr-1">${h.original}</span> <span className="text-red-500">${h.price}</span></> : <>${h.price}</>}
                            </div>
                            <div className="text-[11px] text-gray-400">per night</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{h.dist} &middot; {h.room}</p>
                        <div className="flex gap-1.5 mt-2 flex-wrap items-center">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[11px] font-medium rounded">{h.propertyType}</span>
                          {h.amenities.slice(0, 3).map(a => (
                            <span key={a} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[11px] rounded">{a}</span>
                          ))}
                          {h.amenities.length > 3 && <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[11px] rounded">+{h.amenities.length - 3}</span>}
                          {h.freeCancel && <span className="text-[11px] flex items-center gap-0.5 text-green-600 ml-1"><Check size={11} /> Free Cancel</span>}
                          {h.breakfast && <span className="text-[11px] flex items-center gap-0.5 text-green-600"><Coffee size={11} /> Breakfast</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <Link href={`/hotel/${h.id}/room/1`} className="text-sm text-gray-500 hover:text-gray-900">View Details</Link>
                        <Link href={`/hotel/${h.id}/room/1`} className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800">Book Now</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {paginatedHotels.length > 0 && (
              <nav className="flex items-center justify-center gap-1.5 mt-8" aria-label="Pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage <= 1}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={16} />
                </button>
                {pageNumbers.map((p, idx) =>
                  p === "dots" ? <span key={`d${idx}`} className="w-9 h-9 flex items-center justify-center text-sm text-gray-300">...</span>
                  : <button key={p} onClick={() => goToPage(p)}
                      aria-current={p === currentPage ? "page" : undefined}
                      className={`w-9 h-9 text-sm rounded-lg font-medium ${p === currentPage ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
                      {p}
                    </button>
                )}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage >= totalFilteredPages}
                  className="flex items-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronRight size={16} />
                </button>
              </nav>
            )}
          </div>
        </div>

        {showTop && (
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg z-30">
            <ChevronUp size={20} />
          </button>
        )}
      </div>
    </>
  );
}

export default function ListingPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" /></div>}>
      <ListingContent />
    </Suspense>
  );
}
