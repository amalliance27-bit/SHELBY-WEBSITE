import React, { useState, useEffect } from 'react';
import { CHEF_TOUR_PIC } from './chefTourPic';

// The Tour — Master Paul's order, Nov 3, 2026: Shelby-27's chef portrait is
// the Tour button on the right side of the site. Press it and a panel opens
// with four tour sections — Seafood, Breakfast, Lunch, Dinner. Picking a
// section starts its tour: one page per dish, cycling on the Sliding Menu's
// own rhythm (7 seconds, slow melt-fade, counter, pause, gold-ring arrows).
//
// The dishes were picked from Shelby's own YouTube catalog (243 videos,
// pulled Oct 27, 2026): ranked by view count — the popularity signal the
// catalog carries — and kept to dishes she can actually sell and cater.
// Every picture is that dish's own YouTube video picture, and every page
// links back to the video it came from.

export interface TourDish {
  name: string;
  videoId: string;
  views: string;
  videoTitle: string;
}

export interface TourSection {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  dishes: TourDish[];
}

export const TOUR_SECTIONS: TourSection[] = [
  {
    id: 'seafood',
    label: 'Seafood',
    icon: '🦐',
    blurb: 'From her most-watched waters',
    dishes: [
      { name: 'Stew Collard Greens Tilapia', videoId: 'f4IFBzS7GKQ', views: '12,000', videoTitle: 'STEW COLLARD GREENS TILAPIA WITH FRENCH BAGUETTE!' },
      { name: 'Fried Calamari', videoId: 'K2ByeJ-j334', views: '10,000', videoTitle: "FRIED CALAMARI RECIPE, MY HUSBAND'S FAVORITE!!" },
      { name: 'Garlic Butter Shrimp Pasta', videoId: 'XhSe_QIyj7k', views: '8,500', videoTitle: 'DELICIOUS GARLIC BUTTER SHRIMP PASTA' },
      { name: 'Butter Garlic Salmon', videoId: 'V3Q8qPfU3VA', views: '8,400', videoTitle: 'HOW TO MAKE A TASTY BUTTER GARLIC SALMON!' },
      { name: 'Grilled Conch', videoId: 'WsClPCAo_00', views: '8,300', videoTitle: 'HOW TO MAKE A DELICIOUS GRILLED CONCH!' },
      { name: 'Creamy Lobster Bites', videoId: '5FA6bkXEXA4', views: '7,900', videoTitle: "CREAMY LOBSTER BITES, THE BEST DINNER YOU'LL EVER HAVE!!!" },
    ],
  },
  {
    id: 'breakfast',
    label: 'Breakfast',
    icon: '🍳',
    blurb: 'Island mornings, her way',
    dishes: [
      { name: 'Steak & Eggs Breakfast', videoId: '-2bKmf1i4gw', views: '8,400', videoTitle: 'STEAK AND EGGS BREAKFAST!!!' },
      { name: 'Old School Island Breakfast — Ackee & Codfish', videoId: 'o0aZKgVt3ck', views: '7,600', videoTitle: 'OLD SCHOOL ISLAND BREAKFAST ACKEE, CODFISH, YUCA, SWEET POTATO, MALANGA, AND AVOCADO!' },
      { name: 'Swedish Pancake', videoId: 'AY5U7sf-ucU', views: '6,500', videoTitle: 'HOW TO MAKE A DELICIOUS SWEDISH PANCAKE!' },
      { name: 'Haitian Spaghetti with Herring (Aransò)', videoId: '1HgVuraNkvg', views: '4,000', videoTitle: 'HAITIAN SPAGHETTI WITH HERRING! (ARANSÒ)' },
      { name: 'Spinach Scrambled Eggs & Toasted Flat Bread', videoId: '2o8SbRuwYOw', views: '3,700', videoTitle: 'SPINACH SCRAMBLED EGGS AND TOASTED FLAT BREAD!!!' },
      { name: 'Ham & Eggs Burritos', videoId: 'dh4r2r4S7wA', views: '2,800', videoTitle: 'DELIOUS HAM & EGGS BURRITOS!' },
    ],
  },
  {
    id: 'lunch',
    label: 'Lunch',
    icon: '🥗',
    blurb: 'Light, fresh, midday plates',
    dishes: [
      { name: 'Salmon Tacos', videoId: '7Sn7gscJxAY', views: '8,600', videoTitle: "MY FAMILY'S FAVORITE RECIPE, SALMON TACOS!" },
      { name: 'Summer Steak Caesar Salad', videoId: '9JTvCCLd4e8', views: '8,600', videoTitle: 'SUMMER STEAK CAESAR SALAD' },
      { name: "Shelby's Taco Salad", videoId: 'kJWDO7ZL_-o', views: '8,300', videoTitle: "SHELBY'S HOMEMADE TACO SALAD!!" },
      { name: 'Chicken Caesar Wraps', videoId: 'eg_RjRlWk_o', views: '5,600', videoTitle: 'DELICIOUS CHICKEN CAESAR WRAPS!' },
      { name: 'Tuna Wraps', videoId: 'N0AJE5dyrTw', views: '4,400', videoTitle: 'HOW TO MAKE THE BEST TUNA WRAPS AT HOME!' },
      { name: 'Seafood Dumplings Bouillon', videoId: 'JWr4ausMfK8', views: '3,900', videoTitle: 'DELICIOUS SEAFOOD DUMPLINGS BOUILLON RECIPE!!!' },
    ],
  },
  {
    id: 'dinner',
    label: 'Dinner',
    icon: '🍽️',
    blurb: 'The full-plate headliners',
    dishes: [
      { name: 'Jambalaya', videoId: 'pdA8bh0cHjs', views: '12,000', videoTitle: 'How to Make a DELICIOUS Jambalaya!' },
      { name: 'Bourbon Chicken', videoId: 'RAj4tj4QNfM', views: '10,000', videoTitle: 'EASY AND DELICIOUS BOURBON CHICKEN!!' },
      { name: 'Haitian Stew Goat with Cashews', videoId: 'EHVjnna99Rc', views: '9,100', videoTitle: 'HAITIAN STEW GOAT WITH CASHEWS RECIPE!!!' },
      { name: 'Curry Shrimp', videoId: 'EcfFGJLtXiw', views: '4,200', videoTitle: 'HOW TO MAKE A DELICIOUS CURRY SHRIMP!' },
      { name: 'Seafood Gumbo', videoId: 'ZzIlVupYeFQ', views: '3,500', videoTitle: 'HOW TO MAKE A DELICIOUS SEAFOOD GUMBO!' },
      { name: 'Haitian Griot & Bannann Fri', videoId: 'n_hkFsnHB8Q', views: '2,300', videoTitle: 'HOW TO MAKE HAITIAN GRIOT AND BANNANN FRI!!!' },
    ],
  },
];

const THUMB_STAGES = ['maxresdefault', 'sddefault', 'hqdefault'];

// One tour picture: try the video's picture from full size down — most of
// her older videos never got a full-size version, the standard one always
// exists. Verified live Nov 3, 2026: maxres on 2 of 24 tour videos,
// sd on nearly all, hq on all.
const TourImg: React.FC<{ dish: TourDish; active: boolean }> = ({ dish, active }) => {
  const [stage, setStage] = useState(0);
  return (
    <img
      src={`https://i.ytimg.com/vi/${dish.videoId}/${THUMB_STAGES[stage]}.jpg`}
      onError={() => setStage(s => Math.min(s + 1, THUMB_STAGES.length - 1))}
      alt={dish.name}
      loading={active ? 'eager' : 'lazy'}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ opacity: active ? 1 : 0, transition: 'opacity 1.8s ease-in-out' }}
    />
  );
};

const arrowStyle: React.CSSProperties = {
  border: '2px solid #E8BE5A',
  background: 'rgba(90,18,10,0.72)',
  color: '#F5D67B',
};

export const TourGuide: React.FC<{ onOrder: () => void }> = ({ onOrder }) => {
  const [mode, setMode] = useState<'closed' | 'panel' | 'tour'>('closed');
  const [section, setSection] = useState<TourSection | null>(null);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  const dishes = section?.dishes ?? [];
  const n = dishes.length;

  useEffect(() => {
    if (mode !== 'tour' || paused || n === 0) return;
    const t = setInterval(() => setIdx(i => (i + 1) % n), 7000);
    return () => clearInterval(t);
  }, [mode, paused, n, idx]);

  useEffect(() => {
    if (mode === 'closed') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMode('closed');
      if (mode === 'tour' && n > 0) {
        if (e.key === 'ArrowRight') setIdx(i => (i + 1) % n);
        if (e.key === 'ArrowLeft') setIdx(i => (i - 1 + n) % n);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, n]);

  const startTour = (s: TourSection) => {
    setSection(s);
    setIdx(0);
    setPaused(false);
    setMode('tour');
  };

  const step = (d: number) => n > 0 && setIdx(i => (i + d + n) % n);
  const dish = n > 0 ? dishes[idx] : null;

  return (
    <>
      {/* The Tour button — right side, chef portrait, above the voice button */}
      {mode === 'closed' && (
        <button
          onClick={() => setMode('panel')}
          aria-label="Take a tour of Shelby's food"
          className="fixed right-4 bottom-28 z-[70] flex flex-col items-center group"
        >
          <img
            src={CHEF_TOUR_PIC}
            alt="Shelby-27, your tour guide"
            className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shadow-2xl transition-transform group-hover:scale-105"
            style={{ border: '3px solid #E8BE5A' }}
          />
          <span className="relative -mt-3 bg-red-700 text-white text-[11px] md:text-xs font-black tracking-[0.2em] px-3 py-1 rounded-full shadow-lg" style={{ border: '2px solid #E8BE5A' }}>
            TOUR
          </span>
        </button>
      )}

      {/* The panel — pick a section */}
      {mode === 'panel' && (
        <div className="fixed inset-0 z-[80] bg-black/60 flex items-end md:items-center justify-center" onClick={() => setMode('closed')}>
          <div
            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl overflow-hidden shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-label="Choose a tour"
          >
            <div className="bg-red-900 px-5 py-4 flex items-center gap-3">
              <img src={CHEF_TOUR_PIC} alt="" className="w-12 h-12 rounded-full object-cover" style={{ border: '2px solid #E8BE5A' }} />
              <div className="flex-1 text-left">
                <p className="text-white font-serif font-black text-xl leading-tight">Take the Tour</p>
                <p className="text-yellow-400 text-sm font-bold">Shelby tastes soo good</p>
              </div>
              <button onClick={() => setMode('closed')} aria-label="Close the tour panel" className="text-white/80 hover:text-white text-2xl leading-none w-9 h-9">✕</button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {TOUR_SECTIONS.map(s => (
                <button
                  key={s.id}
                  onClick={() => startTour(s)}
                  className="flex items-center gap-4 text-left bg-stone-50 hover:bg-red-50 border-2 border-stone-200 hover:border-red-700 rounded-2xl px-4 py-3 transition-all"
                >
                  <span className="text-3xl">{s.icon}</span>
                  <span className="flex-1">
                    <span className="block font-serif font-black text-red-900 text-xl">{s.label}</span>
                    <span className="block text-stone-500 text-sm">{s.blurb} · {s.dishes.length} dishes</span>
                  </span>
                  <span className="text-red-700 text-2xl font-black">›</span>
                </button>
              ))}
              <p className="text-center text-stone-500 text-sm px-2 pb-1">
                Every dish picked from Shelby's own YouTube — the ones her viewers watch most.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* The tour itself — one page per dish, cycling */}
      {mode === 'tour' && section && dish && (
        <div className="fixed inset-0 z-[90] bg-stone-950/[0.98] flex flex-col" role="dialog" aria-label={`${section.label} tour`}>
          <div className="flex items-center gap-3 px-4 py-3 max-w-4xl w-full mx-auto">
            <img src={CHEF_TOUR_PIC} alt="" className="w-10 h-10 rounded-full object-cover" style={{ border: '2px solid #E8BE5A' }} />
            <p className="flex-1 text-left text-white font-serif font-black text-lg md:text-xl">
              {section.icon} {section.label} Tour
              <span className="text-yellow-400 text-sm font-sans font-bold ml-2">{idx + 1} / {n}</span>
            </p>
            <button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play the tour' : 'Pause the tour'} className="bg-white/10 hover:bg-white/20 text-white text-xs w-9 h-9 rounded-full">{paused ? '▶' : '❚❚'}</button>
            <button onClick={() => setMode('panel')} className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 h-9 rounded-full">Sections</button>
            <button onClick={() => setMode('closed')} aria-label="Close the tour" className="bg-white/10 hover:bg-white/20 text-white text-lg w-9 h-9 rounded-full">✕</button>
          </div>

          <div className="relative flex-1 w-full max-w-4xl mx-auto min-h-0">
            {dishes.map((d, i) => (
              <TourImg key={d.videoId} dish={d} active={i === idx} />
            ))}
            <button onClick={() => step(-1)} aria-label="Previous dish" style={arrowStyle} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full text-3xl leading-none flex items-center justify-center">‹</button>
            <button onClick={() => step(1)} aria-label="Next dish" style={arrowStyle} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full text-3xl leading-none flex items-center justify-center">›</button>
          </div>

          <div className="max-w-4xl w-full mx-auto px-4 py-4 text-center">
            <div className="flex justify-center gap-2 mb-3">
              {dishes.map((d, i) => (
                <button
                  key={d.videoId}
                  onClick={() => setIdx(i)}
                  aria-label={`Go to ${d.name}`}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: i === idx ? '#E8BE5A' : 'rgba(255,255,255,0.3)' }}
                />
              ))}
            </div>
            <h3 className="text-yellow-400 font-serif font-black text-2xl md:text-3xl">{dish.name}</h3>
            <p className="text-stone-300 mt-1 text-sm md:text-base">
              ♥ {dish.views} views on Shelby's YouTube · from her video “{dish.videoTitle}”
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-3 pb-2">
              <a
                href={`https://www.youtube.com/watch?v=${dish.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="bg-red-700 hover:bg-red-600 text-white font-bold px-6 py-3 rounded-full shadow-lg"
              >
                ▶ Watch Shelby Make It
              </a>
              <button
                onClick={() => { setMode('closed'); onOrder(); }}
                className="bg-yellow-500 hover:bg-yellow-400 text-red-950 font-black px-6 py-3 rounded-full shadow-lg"
              >
                Order Catering
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
