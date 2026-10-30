import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import Lenis from 'lenis';
import { Page } from './types';
import { useGeminiLive } from './hooks/useGeminiLive';
import { NavBar } from './components/NavBar';
import { VoiceIndicator } from './components/VoiceIndicator';
import { CheckoutPage } from './components/CheckoutPage';
import { COMPANY_INFO, PAGE_CONTENT } from './constants';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { ScrollProvider, useScroll } from './contexts/ScrollContext';

// --- Constants ---
const LOGO_URL = "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/cropped-LOGO1.png?fit=739%2C242&ssl=1";

// --- Helper Functions ---
const getPageBackground = (page: Page) => {
  switch(page) {
    case Page.HOME: return "bg-stone-50";
    case Page.ABOUT_US: return "bg-orange-50";
    case Page.CATERING_MENU: return "bg-red-50";
    case Page.RECIPE_HIGHLIGHT: return "bg-yellow-50";
    case Page.CART: return "bg-white";
    case Page.CHECKOUT: return "bg-stone-100";
    case Page.CONTACT_US: return "bg-slate-900 text-white";
    default: return "bg-stone-50";
  }
};

// --- Components ---

const TopTicker = () => {
    const { t } = useLanguage();
    const [time, setTime] = useState(new Date());
    const [visitorCount, setVisitorCount] = useState(12458);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Simulate slow visitor count increase
        const visitorTimer = setInterval(() => {
            setVisitorCount(prev => prev + Math.floor(Math.random() * 2));
        }, 5000);
        return () => clearInterval(visitorTimer);
    }, []);

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const tickerItems = [
        {
            icon: "🕒",
            label: "",
            text: `${formatDate(time)} | ${formatTime(time)}`,
            color: "text-yellow-400",
            labelColor: "text-yellow-200"
        },
        {
            icon: "👥",
            label: t('ticker.visitors'),
            text: visitorCount.toLocaleString(),
            color: "text-cyan-400",
            labelColor: "text-cyan-200"
        },
        {
            icon: "🌎",
            label: "",
            text: t('ticker.se_habla'),
            color: "text-yellow-400",
            labelColor: "text-yellow-200"
        },
        {
            icon: "🥘",
            label: t('ticker.recipe'),
            text: t('ticker.recipe_name'),
            color: "text-orange-400",
            labelColor: "text-orange-200"
        },
        {
            icon: "🥥",
            label: t('ticker.specials'),
            text: t('ticker.specials_text'),
            color: "text-lime-400",
            labelColor: "text-lime-200"
        },
        {
            icon: "🍹",
            label: t('ticker.thursday'),
            text: t('ticker.thursday_text'),
            color: "text-fuchsia-400",
            labelColor: "text-fuchsia-200"
        },
        {
            icon: "🌎",
            label: "",
            text: "On Parlons Français",
            color: "text-green-500",
            labelColor: "text-green-300"
        },
        {
            icon: "⭐",
            label: t('ticker.rate_us'),
            text: t('ticker.taste_so_good'),
            color: "text-yellow-500",
            labelColor: "text-yellow-200"
        }
    ];

    return (
        <div className="bg-black py-3 border-b-2 border-yellow-600 overflow-hidden relative z-[60] shadow-lg">
            <div className="flex overflow-hidden relative w-full">
                <div className="animate-marquee whitespace-nowrap flex gap-8 items-center" style={{ animationDuration: '240s' }}>
                    {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, index) => (
                        <span key={index} className="flex items-center gap-3 text-lg font-medium">
                            <span className="text-2xl filter drop-shadow-md">{item.icon}</span> 
                            {item.label && <span className={`font-bold uppercase tracking-wider ${item.labelColor}`}>{item.label}</span>}
                            <span className={`font-bold ${item.color} drop-shadow-sm`}>{item.text}</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

const ReturnButton = ({ onClick }: { onClick: () => void }) => {
  const { t } = useLanguage();
  return (
    <button 
        onClick={onClick}
        className="mx-auto mt-8 mb-8 flex items-center gap-2 bg-yellow-500 text-red-900 px-6 py-2 rounded-full shadow-lg border-2 border-red-700 font-bold text-lg hover:scale-105 hover:bg-yellow-400 transition-all group animate-fade-in"
    >
        <span className="text-2xl group-hover:-translate-x-1 transition-transform">←</span>
        {t('btn.return')}
    </button>
  );
};

const VideoPanel = ({ videoSrc, className = "", unmutedCycle = false, titleOverride }: { videoSrc?: string, className?: string, unmutedCycle?: boolean, titleOverride?: string }) => {
    const { t } = useLanguage();
    const defaultVideo = "https://raw.githubusercontent.com/askmorpheus247-cmd/Shelby-world/a57b05a41bb1e5772f5d3bbfb2aab8eb756879b7/Shelby%20best%20video%20male%20for%20upload.mp4";
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(!unmutedCycle);
    const [shouldLoop, setShouldLoop] = useState(!unmutedCycle);

    const isYouTube = videoSrc?.includes('youtube.com') || videoSrc?.includes('youtu.be');

    const getYouTubeEmbedUrl = (url: string) => {
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1];
            const ampersandPosition = videoId.indexOf('&');
            if (ampersandPosition !== -1) {
                videoId = videoId.substring(0, ampersandPosition);
            }
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1];
        }
        // autoplay=1: Autoplays the video
        // mute=1: Mutes the video (required for autoplay in most browsers)
        // controls=0: Hides player controls
        // loop=1: Loops the video
        // playlist=[VIDEO_ID]: Required for loop to work on single video embeds
        // rel=0: Hides related videos
        // playsinline=1: Plays inline on mobile
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&rel=0&playsinline=1&origin=${origin}`;
    };

    const handleEnded = () => {
        if (unmutedCycle && !shouldLoop && !isYouTube) {
            setShouldLoop(true);
            setIsMuted(true);
            if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play().catch(e => console.error("Autoplay failed:", e));
            }
        }
    };

    return (
        <div className={`flex flex-col items-center w-full max-w-4xl mx-auto ${className || 'mt-12'}`}>
            <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 transform transition-transform duration-500 hover:scale-[1.02] w-full">
                <div className="aspect-video relative w-full bg-black">
                    {isYouTube && videoSrc ? (
                         <iframe 
                            src={getYouTubeEmbedUrl(videoSrc)}
                            className="w-full h-full"
                            title={titleOverride || t('video.title')}
                            frameBorder="0"
                            referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <video 
                            ref={videoRef}
                            src={videoSrc || defaultVideo} 
                            className="w-full h-full object-contain"
                            autoPlay
                            loop={shouldLoop}
                            muted={isMuted}
                            playsInline
                            onEnded={handleEnded}
                        />
                    )}
                </div>
                <div className="p-4 bg-slate-900 text-center">
                    <h3 className="text-white text-xl font-bold">{titleOverride || t('video.title')}</h3>
                </div>
            </div>
        </div>
    );
};

const TestimonialTicker = () => {
    const { t } = useLanguage();
    const testimonials = [
        {
            name: "Sarah J.",
            role: "Food Critic",
            quote: "The Curry Goat is a revelation! The blend of spices is unlike anything I've tasted.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "Michael R.",
            role: "Local Guide",
            quote: "Shelby's passion for cooking is evident in every bite. The Griot was tender and flavorful.",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "David L.",
            role: "Verified Customer",
            quote: "Authentic Jamaican flavors right here in Miami. The Coconut Seafood Soup is a must-try!",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "Emily W.",
            role: "Event Planner",
            quote: "I ordered catering for my family reunion and everyone was raving about the food. Thank you Shelby!",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        },
        {
            name: "Chris P.",
            role: "Chef",
            quote: "The Maca powder in the curry gives it such a unique kick. Absolutely delicious.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"
        }
    ];

    return (
        <div className="bg-stone-100 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
                <h2 className="text-3xl font-bold text-red-900 font-serif">{t('testimonials.title')}</h2>
                <div className="w-16 h-1 bg-yellow-400 mx-auto mt-4"></div>
            </div>
            <div className="relative w-full flex overflow-x-hidden group">
                <div className="flex animate-marquee whitespace-nowrap gap-8 py-4">
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div key={i} className="inline-block w-80 md:w-96 bg-white p-6 rounded-xl shadow-lg border border-stone-200 whitespace-normal flex-shrink-0 transform transition-transform hover:scale-105">
                            <div className="flex items-center gap-4 mb-4">
                                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400" />
                                <div>
                                    <h4 className="font-bold text-red-900">{t.name}</h4>
                                    <p className="text-stone-500 text-sm">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-stone-700 italic">"{t.quote}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const Hero = ({ onOrder }: { onOrder: () => void }) => {
  const { t } = useLanguage();
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden shadow-2xl min-h-[80vh] flex flex-col items-center justify-center py-20">
        <div className="absolute inset-0 z-0">
        <img src="https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Menu-Home-Page-I-1.png?fit=652%2C806&ssl=1" alt="Food Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center w-full">
            <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 drop-shadow-lg text-yellow-400 font-serif">
                    {t('hero.title')}
                </h1>
                <p className="text-2xl md:text-4xl text-red-100 font-light tracking-widest uppercase mb-8">
                    {t('hero.subtitle')}
                </p>
                <p className="text-xl md:text-2xl text-white/90 italic mb-12 max-w-2xl mx-auto">
                    {t('hero.tagline')}
                </p>
                <button onClick={onOrder} className="px-12 py-5 bg-red-600 text-white text-2xl font-bold rounded-full hover:bg-red-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(220,38,38,0.5)] uppercase tracking-wider mb-12">
                    {t('hero.view_menu')}
                </button>
                
                <VideoPanel />
            </div>
        </div>
    </div>
  );
};

const Section = ({ title, subtitle, children, className = "", id }: { title: string, subtitle?: string, children?: React.ReactNode, className?: string, id?: string }) => (
  <div id={id} className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      <div className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-red-900 font-serif mb-4">
            {title}
          </h2>
          {subtitle && <p className="text-xl text-stone-600 font-medium italic">{subtitle}</p>}
          <div className="w-24 h-1 bg-yellow-400 mx-auto mt-6"></div>
      </div>
      <div className="text-lg text-stone-800 leading-relaxed">
        {children}
      </div>
    </div>
  </div>
);

const AddToCartButton = ({ item }: { item: { name: string, price: number } }) => {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent any parent click handlers
        addToCart({ id: item.name, name: item.name, price: item.price });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <button 
            onClick={handleAdd}
            className={`px-4 py-2 text-sm font-bold rounded-full transition-all shadow-md uppercase tracking-wide transform active:scale-95 ${
                isAdded 
                ? "bg-green-600 text-white hover:bg-green-500 scale-105" 
                : "bg-red-600 text-white hover:bg-red-500 hover:scale-105"
            }`}
        >
            {isAdded ? "Added!" : "Add to Cart"}
        </button>
    );
};

const MenuGrid = ({ items }: { items: { name: string, price: number }[] }) => {
    const { t } = useLanguage();

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, idx) => {
                const isSpecial = item.name.toLowerCase().includes("special of the month");
                return (
                    <div key={idx} className={isSpecial 
                        ? "bg-yellow-50 p-6 rounded-xl shadow-xl border-2 border-yellow-400 transform scale-105 hover:scale-110 transition-all group relative overflow-hidden flex flex-col"
                        : "bg-white p-6 rounded-xl shadow-md border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col"
                    }>
                        {isSpecial && (
                            <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
                                Special
                            </div>
                        )}
                        <div className="h-48 bg-stone-200 rounded-lg mb-4 overflow-hidden relative flex-shrink-0">
                            <img 
                                src={item.name.includes("Curry Goat") 
                                    ? "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                    : `https://source.unsplash.com/featured/?food,${item.name.split(' ')[0]}`} 
                                alt={item.name} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                            />
                        </div>
                        <div className="flex-grow">
                            <h3 className={`text-xl font-bold mb-2 ${isSpecial ? "text-red-700" : "text-red-900"}`}>{item.name}</h3>
                            <p className="text-stone-500 text-sm mb-4">Freshly prepared with premium ingredients.</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                            <span className="text-lg font-bold text-stone-800">${item.price.toFixed(2)}</span>
                            <AddToCartButton item={item} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const RecipeStep = ({ step, title, desc, image }: { step: number, title: string, desc: string, image?: string }) => (
    <div className="flex flex-col md:flex-row gap-8 items-center mb-16">
        <div className="md:w-1/2">
            <div className="flex items-center gap-4 mb-4">
                <span className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-400 text-red-900 flex items-center justify-center text-2xl font-bold">{step}</span>
                <h3 className="text-2xl font-bold text-red-900">{title}</h3>
            </div>
            <p className="text-lg text-stone-700 leading-relaxed">{desc}</p>
        </div>
        {image && (
            <div className="md:w-1/2">
                <img src={image} alt={title} className="rounded-xl shadow-lg rotate-2 hover:rotate-0 transition-transform duration-500" />
            </div>
        )}
    </div>
);

const ShelbyCremaPanel = () => {
    const { setIsAutoScrolling } = useScroll();
    const { addToCart } = useCart();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isAdded, setIsAdded] = useState(false);

    const handleTap = () => {
        if (videoRef.current) {
            setIsAutoScrolling(false);
            videoRef.current.muted = false;
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsMuted(false);
        }
    };

    const handleEnded = () => {
        if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play(); // Loop muted
        }
        setIsAutoScrolling(true);
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addToCart({ id: "Shelby Crema", name: "Shelby Crema", price: 30.00 });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div 
            className="bg-white p-6 rounded-xl shadow-md border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col cursor-pointer h-full"
            onClick={handleTap}
        >
            <div className="h-48 bg-black rounded-lg mb-4 overflow-hidden relative flex-shrink-0 group-hover:scale-[1.02] transition-transform duration-500">
                <div className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${isMuted ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}>
                    <span className="bg-black/60 text-white px-3 py-1 rounded-full backdrop-blur-sm text-xs font-bold border border-white/20">
                        Tap for Sound 🔊
                    </span>
                </div>
                <video 
                    ref={videoRef}
                    src="https://raw.githubusercontent.com/askmorpheus247-cmd/Shelby-world/5a25ab326b0267b5ce6b8eee09f31c4b1ebd27d0/crema%20ce%20bon%20video.mp4" 
                    className="w-full h-full object-cover"
                    autoPlay
                    loop={false}
                    muted={true}
                    playsInline
                    onEnded={handleEnded}
                />
            </div>
            <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2 text-red-900 font-serif">Shelby Crema</h3>
                <p className="text-stone-500 text-sm mb-4">"Crémas C'est Bon" - Rich, Creamy, Delicious</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                <span className="text-lg font-bold text-stone-800">$30.00</span>
                <button 
                    onClick={handleAddToCart}
                    className={`px-4 py-2 text-sm font-bold rounded-full transition-all shadow-md uppercase tracking-wide transform active:scale-95 ${
                        isAdded 
                        ? "bg-green-600 text-white hover:bg-green-500 scale-105" 
                        : "bg-red-600 text-white hover:bg-red-500 hover:scale-105"
                    }`}
                >
                    {isAdded ? "Added!" : "Add to Cart"}
                </button>
            </div>
        </div>
    );
};

// --- Main App Component ---


// Dish knowledge for the splash pages — every word from Shelby's own recipe videos.
const DISH_INFO: Record<string, { about: string; source: string }> = {
    "Griot": { about: "It starts in the marinade: pork shoulder sitting a full hour in Shelby's seasoning, then a slow boil in that same marinade until it goes tender. Then the crisp — fried golden in one telling, oven-finished in the other — with fried plantains and a spoon of pikliz for the heat. The marinade itself is her secret; she has never itemized it, on any video.", source: "BEST HAITIAN GRIOT!" },
    "Coconut Seafood Soup": { about: "Mussels, scallops, shrimp, and crawfish meat in a coconut-milk broth that goes silky with butter — her fresh garlic paste, a touch of tomato paste, potatoes and carrots cut and waiting in water so they stay bright. Warm, rich, a little sweet: the coast at dusk, in a bowl.", source: "HOW TO MAKE COCONUT SEAFOOD SOUP!!!" },
    "Gumbo": { about: "Blue crabs, split in two, and seafood she cleans the way she always does — salt water, vinegar, and limes. Okra, four cloves of garlic, tomato paste, and her spice mix: paprika, Creole seasoning, bay leaves, oregano, sweet peppers. Dark, peppery, and deep — a gumbo that coats the spoon.", source: "HOW TO MAKE A DELICIOUS SEAFOOD GUMBO!" },
    "Tuna Wrap": { about: "From her home-kitchen video: tuna wraps made fresh and simple, seasoned her way — cool, bright, and ready in minutes.", source: "HOW TO MAKE THE BEST TUNA WRAPS AT HOME!" },
    "Fried Chicken": { about: "Her tasty spicy fried chicken: a crust that shatters, meat that stays juicy, and heat that builds bite after bite.", source: "TASTY SPICY FRIED CHICKEN!" },
    "Seafood Rice": { about: "Washed rice cooked golden with her curry powder, loaded with shrimp, mussels, and crawfish, green peas and garlic through it — and plated the way she insists: with the crawfish showing on top.", source: "Jerk Chicken & Curry Seafood Rice" },
    "Alfredo Pasta with Shrimp": { about: "Fourteen minutes, start to finish: pasta twirled through a silky cream sauce with plump shrimp. Stay for the end — her first bite, eyes closed, is the whole review.", source: "HOW TO MAKE CREAMY SHRIMP ALFREDO PASTA RECIPE IN 14 MINUTES!" },
    "Baked Cheese Oyster": { about: "Oysters, cleaned and tucked under melted cheese and parsley butter, with garlic powder, black pepper, and a touch of Louisiana hot sauce. Briny, buttery, bubbling.", source: "Coconut Seafood Soup with Baked Oysters" },
    "Lasagna": { about: "Her weeknight build: noodles, chicken, and spinach all pre-cooked and layered with sauce, so the oven only has to marry it — 350 degrees, 45 minutes, until the top is golden and the edges bubble.", source: "CHICKEN & SPINACH LASAGNA RECIPE" },
    "Curry Chicken": { about: "Wings marinated a full hour, then curry powder — 'not too much,' she says — turmeric, paprika, and ginger, which she puts in everything she makes. Served with rice and pigeon peas. Golden, warm, and deep.", source: "CURRY CHICKEN WINGS WITH RICE PIGEON PEAS!" },
    "Curry Shrimp": { about: "Shrimp that go in already marinated her way, then garlic, parsley, thyme, two bay leaves, bouillon, and a squeeze of lime to wake it all up — served over turmeric yellow rice, with her shrimp mashed-potato salad beside it.", source: "HOW TO MAKE A DELICIOUS CURRY SHRIMP!" }
};

const GALLERY_PHOTOS: { src: string; label: string }[] = [
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Soup-Joumou-I.png?fit=620%2C679&ssl=1", label: "Soup Joumou" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tassot-Cabrit-I-1.png?fit=726%2C669&ssl=1", label: "Tassot" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Seafood-Rice-I.png?fit=621%2C689&ssl=1", label: "Seafood Rice" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Lasagna-I.png?fit=614%2C707&ssl=1", label: "Lasagna" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Gumbo-I.png?fit=598%2C681&ssl=1", label: "Gumbo" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Coconut-Seafood-Soup-I.png?fit=629%2C687&ssl=1", label: "Coconut Seafood Soup" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Fish-w-Fried-Plantain-I.png?fit=597%2C683&ssl=1", label: "Fried Fish & Plantains" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Spagheti-Shrimp-or-Chicken-w-Garlic-Bread-I.png?fit=599%2C680&ssl=1", label: "Spaghetti & Shrimp" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Side-order-of-Fried-Sweet-Potato-Akra-Pikliz-I.png?fit=616%2C677&ssl=1", label: "Akra & Pikliz" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Side-order-of-rice-bean-I.png?fit=620%2C680&ssl=1", label: "Rice & Beans" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Pikliz-for-Sales-I.png?fit=634%2C678&ssl=1", label: "Pikliz" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Shelbys-Famous-Burger.png?fit=961%2C905&ssl=1", label: "Shelby's Famous Burger" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Thanksgiving-Dinner-I-1.png?fit=626%2C688&ssl=1", label: "Thanksgiving Dinner" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Turkey-Platter-I.png?fit=553%2C617&ssl=1", label: "Fried Turkey Platter" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Bouillion-Soup-I.png?fit=638%2C684&ssl=1", label: "Bouillon" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/SHEL-B-CREMAS-III.png?fit=503%2C676&ssl=1", label: "Shelby's Cremas" }
];

// Plays one of Shelby's YouTube videos and calls onEnded when the video finishes.
const YouTubeSplashPlayer = ({ videoId, onEnded }: { videoId: string; onEnded: () => void }) => {
    const holderRef = useRef<HTMLDivElement>(null);
    const endedRef = useRef(onEnded);
    endedRef.current = onEnded;
    const [useFallback, setUseFallback] = useState(false);

    useEffect(() => {
        let player: any = null;
        let cancelled = false;
        let created = false;
        const create = () => {
            if (cancelled || created || !holderRef.current) return;
            const YT = (window as any).YT;
            if (!YT || !YT.Player) return;
            created = true;
            player = new YT.Player(holderRef.current, {
                videoId,
                playerVars: { autoplay: 1, rel: 0, playsinline: 1 },
                events: {
                    onStateChange: (e: any) => { if (e.data === 0) endedRef.current(); },
                    onError: () => setUseFallback(true)
                }
            });
        };
        if ((window as any).YT && (window as any).YT.Player) {
            create();
        } else {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            document.body.appendChild(tag);
            const prev = (window as any).onYouTubeIframeAPIReady;
            (window as any).onYouTubeIframeAPIReady = () => { if (prev) prev(); create(); };
        }
        const timer = setTimeout(() => { if (!created) setUseFallback(true); }, 6000);
        return () => { cancelled = true; clearTimeout(timer); if (player && player.destroy) player.destroy(); };
    }, [videoId]);

    if (useFallback) {
        return (
            <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer" className="block aspect-video w-full bg-black relative group">
                <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt="Watch Shelby's video on YouTube" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <span className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-red-600 text-white text-xl font-bold px-6 py-3 rounded-full shadow-2xl">▶ Watch on YouTube</span>
                </span>
            </a>
        );
    }
    return (
        <div className="aspect-video w-full bg-black" style={{ backgroundImage: `url(https://i.ytimg.com/vi/${videoId}/hqdefault.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <div ref={holderRef} className="w-full h-full" />
        </div>
    );
};

// The dish splash page: her video plays, the dish is explained from her own recipe,
// and when the video ends the page returns to where you were.
const DishSplash = ({ name, video, img, onBack }: { name: string; video: string; img?: string; onBack: () => void }) => {
    const info = DISH_INFO[name];
    const [ended, setEnded] = useState(false);
    const timerRef = useRef<any>(null);
    const { setIsAutoScrolling } = useScroll();

    // While her video plays, the page holds still.
    useEffect(() => {
        setIsAutoScrolling(false);
        return () => setIsAutoScrolling(true);
    }, []);

    const handleEnded = () => {
        setEnded(true);
        timerRef.current = setTimeout(onBack, 1500);
    };
    useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

    return (
        <Section title={name} subtitle="Watch Shelby make it">
            <div className="max-w-4xl mx-auto">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 relative bg-black">
                    <YouTubeSplashPlayer videoId={video} onEnded={handleEnded} />
                    {ended && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                            <p className="text-white text-2xl font-bold">Mèsi! Thanks for watching — taking you back…</p>
                        </div>
                    )}
                </div>
                {info && (
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 mt-8 text-left flex flex-col md:flex-row gap-8">
                        {img && <img src={img} alt={name} className="w-full md:w-64 h-64 object-cover rounded-xl shadow-md flex-shrink-0" />}
                        <div>
                            <h3 className="text-2xl font-bold text-red-900 mb-4">About this dish</h3>
                            <p className="text-lg text-stone-700 mb-4">{info.about}</p>
                            <p className="text-stone-500 italic">From her video: “{info.source}”</p>
                        </div>
                    </div>
                )}
                <ReturnButton onClick={onBack} />
            </div>
        </Section>
    );
};



const SLIDESHOW_PHOTOS = [
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Delivered-Catering-Curry-Chicken-I.png?fit=466%2C679&ssl=1", label: "Curry Chicken Trays" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tassot-Cabrit-I-2.png?fit=726%2C669&ssl=1", label: "Tassot (Goat)" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Curry-Shrimp-I.png?fit=618%2C673&ssl=1", label: "Curry Shrimp and Rice Combo" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Steak-Combo.png?fit=586%2C633&ssl=1", label: "Steak Combo with Yellow Rice and Broccoli" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Pasta-Shrimp-w-Alfredo-Sause.png?fit=577%2C620&ssl=1", label: "Alfredo Pasta with Shrimp" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Baked-Oyster-I.png?fit=631%2C674&ssl=1", label: "Baked Cheese Oyster" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Bouillion-Soup-I.png?fit=638%2C684&ssl=1", label: "Bouillon" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Chicken-Tender-I.png?fit=615%2C683&ssl=1", label: "Chicken Strips" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Coconut-Seafood-Soup-I.png?fit=629%2C687&ssl=1", label: "Coconut Seafood Soup" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Curry-Chicken-I.png?fit=606%2C675&ssl=1", label: "Curry Chicken" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fish-Fillet-Combo-I.png?fit=610%2C680&ssl=1", label: "Fillet of Fish Combo" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Fish-w-Fried-Plantain-I.png?fit=597%2C683&ssl=1", label: "Fried Fish & Plantains" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Plantain-w-Sauteed-Shrimp-I.png?fit=624%2C691&ssl=1", label: "Fried Plantain with Sauteed Shrimp" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fried-Turkey-Platter-I.png?fit=553%2C617&ssl=1", label: "Fried Turkey Platter" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Gumbo-I.png?fit=598%2C681&ssl=1", label: "Seafood Gumbo" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Lasagna-I.png?fit=614%2C707&ssl=1", label: "Lasagna" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Pikliz-for-Sales-I.png?fit=634%2C678&ssl=1", label: "Pikliz" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Qter-Ribs-I.png?fit=618%2C676&ssl=1", label: "1/4 Rack Ribs Combo" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Ravioli-Salad-I.png?fit=605%2C680&ssl=1", label: "Ravioli Salad" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Seafood-Rice-I.png?fit=621%2C689&ssl=1", label: "Seafood Rice" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Side-order-of-Fried-Sweet-Potato-Akra-Pikliz-I.png?fit=616%2C677&ssl=1", label: "Akra, Sweet Potato & Pikliz" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Side-order-of-rice-bean-I.png?fit=620%2C680&ssl=1", label: "Rice & Beans" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Soup-Joumou-I.png?fit=620%2C679&ssl=1", label: "Soup Joumou" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Spagheti-Shrimp-or-Chicken-w-Garlic-Bread-I.png?fit=599%2C680&ssl=1", label: "Spaghetti with Shrimp & Garlic Bread" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tuna-Wrap-I.png?fit=619%2C690&ssl=1", label: "Tuna Wrap" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Turkey-Wrap-I.png?fit=617%2C686&ssl=1", label: "Turkey Wrap" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Thanksgiving-Dinner-I-1.png?fit=626%2C688&ssl=1", label: "Thanksgiving Dinner" },
    { src: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/SHEL-B-CREMAS-III.png?fit=503%2C676&ssl=1", label: "Shelby's Cremas" }
];

// The Sliding Menu — the old site's captioned dish slideshow (28 slides of
// her cooking, arrows, counter, pause), carried into the new site on Master
// Paul's word, Oct 29. Her real dishes only.
const SlidingMenu = () => {
    const [idx, setIdx] = useState(0);
    const [paused, setPaused] = useState(false);
    const n = SLIDESHOW_PHOTOS.length;
    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => setIdx(i => (i + 1) % n), 7000);
        return () => clearInterval(t);
    }, [paused, n]);
    const slide = SLIDESHOW_PHOTOS[idx];
    const step = (d: number) => setIdx(i => (i + d + n) % n);
    return (
        <section className="bg-white py-14">
            <style>{`@keyframes sfcFadeSlow { from { opacity: 0; transform: scale(1.03); } to { opacity: 1; transform: scale(1); } }`}</style>
            <div className="max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-red-900 mb-8">The Sliding Menu</h2>
                <div className="relative">
                    <img key={idx} src={slide.src} alt={slide.label} style={{ animation: 'sfcFadeSlow 1.6s ease-in-out' }} className="w-full h-[420px] md:h-[520px] object-cover rounded-2xl shadow-xl" />
                    <button onClick={() => step(-1)} aria-label="Previous dish" className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white text-3xl leading-none w-11 h-11 rounded-full">‹</button>
                    <button onClick={() => step(1)} aria-label="Next dish" className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/45 hover:bg-black/65 text-white text-3xl leading-none w-11 h-11 rounded-full">›</button>
                    <button onClick={() => setPaused(p => !p)} aria-label={paused ? 'Play the slideshow' : 'Pause the slideshow'} className="absolute right-3 top-3 bg-black/45 hover:bg-black/65 text-white text-xs w-9 h-9 rounded-full">{paused ? '▶' : '❚❚'}</button>
                    <span className="absolute left-3 bottom-3 bg-black/55 text-white text-sm font-bold px-3 py-1 rounded-full">{idx + 1} / {n}</span>
                </div>
                <div className="mx-auto mt-6 h-1 w-20 bg-yellow-500 rounded-full" />
                <p className="mt-3 text-red-900 uppercase tracking-[0.14em] text-xl md:text-2xl font-extrabold font-serif" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>{slide.label}</p>
            </div>
        </section>
    );
};

// Bottom sliding menu bar — added on Master Paul's order, Oct 29: the new site
// gets the old site's convenience in her brand. Slides up once a visitor
// scrolls; hidden while a dish video plays and at checkout.
const BottomMenuBar = ({ currentPage, go }: { currentPage: Page; go: (p: Page) => void }) => {
    const { cartCount } = useCart();
    const [shown, setShown] = useState(false);
    useEffect(() => {
        const onScroll = () => setShown(window.scrollY > 200);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    const icon = (paths: string[]) => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            {paths.map((d, i) => <path key={i} d={d} />)}
        </svg>
    );
    const item = "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-bold uppercase tracking-wide transition-colors";
    const tone = (p: Page) => currentPage === p ? "text-yellow-400" : "text-stone-300 hover:text-white";
    return (
        <nav className={`fixed bottom-0 inset-x-0 z-[70] bg-black/90 backdrop-blur border-t-2 border-yellow-500 shadow-[0_-6px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 ${shown ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="max-w-xl mx-auto grid grid-cols-5">
                <button onClick={() => go(Page.HOME)} className={`${item} ${tone(Page.HOME)}`}>
                    {icon(["M3 10.5 12 3l9 7.5", "M5 9.5V21h14V9.5"])}
                    Home
                </button>
                <button onClick={() => go(Page.CATERING_MENU)} className={`${item} ${tone(Page.CATERING_MENU)}`}>
                    {icon(["M4 7h16", "M4 12h16", "M4 17h10"])}
                    Menu
                </button>
                <button onClick={() => go(Page.FOOD_GALLERY)} className={`${item} ${tone(Page.FOOD_GALLERY)}`}>
                    {icon(["M3 5h18v14H3z", "M3 16l5.5-5.5L13 15l3-3 5 5", "M8.5 10.5h.01"])}
                    Gallery
                </button>
                <a href={`tel:+1${COMPANY_INFO.phone.replace(/[^0-9]/g, '')}`} className={`${item} text-stone-300 hover:text-white`}>
                    {icon(["M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"])}
                    Call
                </a>
                <button onClick={() => go(Page.CART)} className={`${item} ${tone(Page.CART)} relative`}>
                    <span className="relative">
                        {icon(["M3 4h2l2.4 12.2A2 2 0 0 0 9.4 18h8.9a2 2 0 0 0 2-1.6L21.6 8H6", "M10 21h.01", "M18 21h.01"])}
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{cartCount}</span>
                        )}
                    </span>
                    Cart
                </button>
            </div>
        </nav>
    );
};

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [splash, setSplash] = useState<{ name: string; video: string; img?: string } | null>(null);
  const go = (p: Page) => { setSplash(null); setCurrentPage(p); };
  const { language, setLanguage, t } = useLanguage();
  const { scrollToSection, lenis } = useScroll();
  
  // Every page opens at the top (Master Paul, Oct 29).
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [currentPage, splash, lenis]);

  const { connect, disconnect, isActive, isSpeaking, sendPageContext, error } = useGeminiLive({
    onPageChange: (page) => setCurrentPage(page),
    currentPage,
    onScrollToSection: scrollToSection,
    setLanguage
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'auto', block: 'start' });
    if (isActive) sendPageContext(currentPage);
  }, [currentPage, isActive]);

  const toggleVoice = () => { isActive ? disconnect() : connect(); };

  const renderContent = () => {
    switch (currentPage) {
      case Page.HOME:
        return (
          <>
            <Hero onOrder={() => setCurrentPage(Page.CATERING_MENU)} />
            <SlidingMenu />
            <Section id="welcome" title={t('section.welcome')} subtitle={t('welcome.subtitle')}>
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 text-lg leading-relaxed space-y-6">
                        <p className="font-bold text-xl mb-4">{t('welcome.intro')}</p>
                        
                        <p>{t('welcome.p1')}</p>
                        
                        <div className="relative pl-4 border-l-4 border-yellow-400 italic bg-stone-50 p-4 rounded-r-lg shadow-sm">
                            <span className="text-5xl float-left mr-2 mt-[-10px] font-serif text-red-900 font-bold">B</span>
                            <p className="inline">{t('welcome.p2_start').substring(1)}</p>
                        </div>

                        <p>{t('welcome.p3')}</p>
                        <p>{t('welcome.p4')}</p>
                        
                        <p>
                            {t('welcome.p5_start')}
                            <span className="bg-yellow-200 px-1 font-bold text-red-900">{t('welcome.highlight')}</span>
                            {t('welcome.p5_end')}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <button onClick={() => setCurrentPage(Page.ABOUT_US)} className="text-red-600 font-bold hover:underline text-xl block">{t('welcome.read_story')}</button>
                            <button onClick={() => setCurrentPage(Page.FOOD_GALLERY)} className="text-stone-600 font-bold hover:underline text-xl block border-l-2 border-stone-300 pl-4">{t('welcome.gallery_btn')}</button>
                        </div>
                        
                        {/* Second Video Panel */}
                        <div className="mt-8">
                            <VideoPanel videoSrc="https://www.youtube.com/watch?v=hsnHq2F-4fg" titleOverride="Nous parlons Français" />
                        </div>
                    </div>
                </div>
            </Section>
            
            <div id="featured-dish" className="bg-red-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold mb-8 font-serif">{t('section.featured')}: Morpheus Curry Goat</h2>
                    <p className="text-xl mb-12 max-w-3xl mx-auto">A Jamaican Stovetop Classic. A masterclass in heat, spice, and patience.</p>
                    <button onClick={() => setCurrentPage(Page.RECIPE_HIGHLIGHT)} className="px-10 py-4 bg-yellow-400 text-red-900 font-bold rounded-full hover:bg-yellow-300 transition-all shadow-lg uppercase tracking-wide">
                        View Recipe
                    </button>
                </div>
            </div>

            {/* Chef Spotlight Section */}
            <div className="py-24 bg-stone-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                    <div className="absolute left-0 bottom-0 w-96 h-96 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                </div>
                
                <div className="max-w-6xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-16">
                        <div className="md:w-1/2 relative group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-yellow-400 transform rotate-3 rounded-3xl opacity-30 blur-lg group-hover:rotate-6 transition-transform duration-500"></div>
                            <img 
                                src="https://raw.githubusercontent.com/askmorpheus247-cmd/Shelby-world/b09304471126e62b87b35d9678d027608e2ad261/Chef%20Sheby.png" 
                                alt="Chef Shelby" 
                                className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transform transition duration-500 hover:-translate-y-2 border-4 border-white object-cover"
                            />
                        </div>
                        <div className="md:w-1/2 text-center md:text-left">
                            <h2 className="text-5xl md:text-7xl font-serif font-bold text-red-900 mb-6 tracking-tight">
                                Chef Shelby
                            </h2>
                            <p className="text-2xl text-stone-600 font-light leading-relaxed mb-8">
                                "Every dish tells a story of tradition, passion, and flavor."
                            </p>
                            <div className="inline-block p-6 border-l-8 border-yellow-400 bg-white shadow-xl rounded-r-2xl transform hover:scale-105 transition-transform duration-300">
                                <p className="text-xl font-bold text-red-900 uppercase tracking-widest">Entrepreneur, Lover of Fine Cuisine</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="testimonials">
                <TestimonialTicker />
            </div>

            <div className="bg-white flex justify-center py-12 m-0 w-full">
                <button onClick={() => setCurrentPage(Page.WEB_DESIGN)} className="px-8 py-3 bg-black text-[#00FF41] font-mono font-bold text-lg rounded border border-[#00FF41] hover:bg-gray-900 transition-all uppercase tracking-[0.3em] animate-pulse">
                    Web Design by Jarvis-27
                </button>
             </div>
          </>
        );

      case Page.WEB_DESIGN:
        return (
            <div className="min-h-screen bg-black text-[#00FF41] font-mono p-4 sm:p-8 relative overflow-hidden flex flex-col items-center">
                 <div className="max-w-4xl w-full z-10 relative mt-8">
                    <div className="mb-8 border-2 border-[#00FF41] rounded-lg overflow-hidden bg-black">
                        <video src="https://raw.githubusercontent.com/amalliance27-bit/soundbars-media/1e60280ee552a2c609d5af7ef0f08b59b912b340/Jarvis-27complete%20flash.mp4" className="w-full" autoPlay playsInline loop muted />
                    </div>
                    
                    <div className="space-y-8 text-lg md:text-xl leading-relaxed bg-black p-6 sm:p-10 rounded-xl border border-[#003300]">
                        
                        <div className="border-b border-[#00FF41]/30 pb-6">
                             <h2 className="text-3xl md:text-5xl font-bold mb-8 uppercase tracking-widest text-center text-[#00FF41]">Web Design by Jarvis-27</h2>
                             <div className="text-left space-y-4 text-[#00FF41]">
                                <p>Jarvis-27 designs front-end UI websites and web apps for new developers and everyday clients who want clear, functional, modern design.</p>
                                <p>Whether you are building from scratch or upgrading an existing site, Jarvis-27 helps you bring it together—clean, simple, and effective. No job is too small.</p>
                             </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 text-[#00FF41]">
                            <div>
                                <h3 className="text-2xl font-bold mb-4 uppercase">What Jarvis-27 Helps With</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Front-end UI design</li>
                                    <li>Landing pages and single-page sites</li>
                                    <li>Website upgrades and clean-ups</li>
                                    <li>Beginner-friendly builds</li>
                                    <li>AI-assisted design workflows</li>
                                </ul>
                            </div>
                             <div>
                                <h3 className="text-2xl font-bold mb-4 uppercase">Why It Works</h3>
                                <p className="mb-4">Let’s be real—people hate to read. Jarvis-27 uses clean layouts and AI-assisted design to keep things visual, focused, and easy to navigate.</p>
                                <p>Built with modern front-end tools and practical workflows, designed for speed, clarity, and real-world use.</p>
                            </div>
                        </div>

                        <div className="text-[#00FF41]">
                            <h3 className="text-2xl font-bold mb-4 uppercase">How It Works</h3>
                            <p>You send an email, WhatsApp message, or voice note. We clarify your goal. We agree on an estimate. And Jarvis-27 builds or upgrades your site.</p>
                        </div>

                        <div className="bg-black border border-[#00FF41] p-8 rounded-xl mt-8 transform hover:scale-[1.01] transition-transform text-center relative overflow-hidden text-[#00FF41]">
                            <h3 className="font-bold mb-6 uppercase tracking-wider text-2xl relative z-10">Connect to ALLIANCE</h3>
                            
                            <div className="mb-8 relative z-10">
                                <p className="text-xl mb-2">WhatsApp:</p>
                                <a href="https://wa.me/17789535496" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-white underline text-3xl md:text-4xl font-bold font-sans tracking-wide">778-953-5496</a>
                            </div>

                            <div className="mb-8 relative z-10">
                                <p className="text-xl mb-2">Email:</p>
                                <a href="mailto:AskMorpheus247@gmail.com" className="text-yellow-300 hover:text-white underline text-lg sm:text-2xl font-bold font-sans tracking-wide">AskMorpheus247@gmail.com</a>
                            </div>
                            
                            <div className="border-t border-[#00FF41]/30 pt-6 mb-6 relative z-10">
                                <p className="font-bold text-xl uppercase mb-2">Business Hours</p>
                                <div className="space-y-1 text-lg">
                                    <p>11 AM – 9 PM EST</p>
                                    <p>8 AM – 7 PM PST</p>
                                </div>
                            </div>

                            <div className="text-lg opacity-90 relative z-10">
                                <p>Just leave a voice note or message.</p>
                                <p className="font-bold mt-1">You will receive a response within 24 hours.</p>
                            </div>

                             <div className="mt-8 pt-4 border-t border-[#00FF41]/30 text-center relative z-10 opacity-70">
                                <p className="text-xl font-bold tracking-widest uppercase mb-2">AMA</p>
                                <p className="text-sm font-bold tracking-widest uppercase mb-1">Ask Morpheus Alliance</p>
                                <p className="text-sm font-bold tracking-widest uppercase">We connect.</p>
                             </div>
                        </div>
                    </div>
                 </div>
            </div>
        );

      case Page.ABOUT_US:
        return (
            <Section title={t('about.title')} subtitle={t('about.subtitle')}>
                <div className="mb-12">
                    <VideoPanel />
                </div>
                <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="flex-1">
                        <img src="https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/About-us-pic.png?fit=610%2C490&ssl=1" alt="Chef" className="rounded-2xl shadow-xl mb-8" />
                        <div className="bg-white p-8 rounded-xl shadow-lg border-l-8 border-yellow-400">
                            <p className="text-xl font-serif italic text-stone-600">{t('about.quote')}</p>
                            <p className="text-right mt-4 font-bold text-red-900">- {t('about.chef')}</p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 text-lg">
                        <p>{t('about.p1')}</p>
                        <p>{t('about.p2')}</p>
                        <p>{t('about.p3')}</p>
                        <div className="pt-8">
                            <button 
                                onClick={() => setCurrentPage(Page.HOME)}
                                className="flex items-center gap-2 text-red-600 font-bold hover:underline text-lg transition-colors"
                            >
                                <span>←</span> {t('btn.return')}
                            </button>
                        </div>
                    </div>
                </div>
            </Section>
        );

      case Page.CATERING_MENU:
        return (
            <Section title="Catering Menu" subtitle="Dishes for any occasion">
                <VideoPanel 
                    videoSrc="https://raw.githubusercontent.com/askmorpheus247-cmd/Shelby-world/87f10d436ff40a85812c74142d3f95901a48f810/Shelby%20so%20Good%20final.mp4"
                    className="mb-8"
                    unmutedCycle={true}
                />
                <p className="text-center mb-8 text-xl max-w-3xl mx-auto">All of our dishes are prepared with fresh ingredients; our seafood and meat are thoroughly clean before seasoning is applied.</p>
                
                <div className="max-w-3xl mx-auto mb-12 text-center">
                    <blockquote className="text-2xl font-serif italic text-red-900 mb-2">
                        {t('quote.leah')}
                    </blockquote>
                    <cite className="text-stone-600 font-bold block not-italic">— {t('quote.leah_author')}</cite>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* First item: Curry Goat */}
                    <div className="bg-yellow-50 p-6 rounded-xl shadow-xl border-2 border-yellow-400 transform scale-105 hover:scale-110 transition-all group relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider z-10">
                            Special
                        </div>
                        <div className="h-48 bg-stone-200 rounded-lg mb-4 overflow-hidden relative flex-shrink-0">
                            <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-800 to-stone-900 flex flex-col items-center justify-center text-center">
                                <span className="font-serif text-4xl font-bold text-yellow-400">Shelby's</span>
                                <span className="text-stone-200 tracking-[0.3em] text-xs mt-1">FINE CUISINE</span>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-red-700">Curry Goat (special of the month)</h3>
                            <p className="text-stone-500 text-sm mb-4">A Jamaican stovetop classic — slow heat, deep spice, and a coconut-milk finish that silks the whole pot.</p>
                        </div>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                            <span className="text-lg font-bold text-stone-800">$85.00</span>
                            <AddToCartButton item={{ name: "Curry Goat (special of the month)", price: 85.00 }} />
                        </div>
                    </div>

                    {/* Shelby Crema Panel */}
                    <ShelbyCremaPanel />

                    {/* Remaining Items */}
                    {[
                        { name: "Curry Chicken", price: 75.00, desc: "Catering trays from $75 — golden curry, with ginger and turmeric warm in every bite.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Delivered-Catering-Curry-Chicken-I.png?fit=466%2C679&ssl=1", video: "0J2D2LnKh4k" },
                        { name: "Curry Shrimp", price: 85.00, desc: "Catering trays from $85 — shrimp slicked in curry with garlic, thyme, and a squeeze of lime.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Curry-Shrimp-I.png?fit=618%2C673&ssl=1", video: "EcfFGJLtXiw" },
                        { name: "Griot", price: 70.00, desc: "Pork shoulder, marinated deep, boiled tender, then fried to a crisp — pikliz heat on the side.", img: "https://i.ytimg.com/vi/XN8l8SiiF00/hqdefault.jpg", video: "XN8l8SiiF00" },
                        { name: "Tassot", price: 120.00, desc: "Goat, seasoned and fried the Haitian way — crisp edges, rich and peppery. Trays from $120.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tassot-Cabrit-I-1.png?fit=726%2C669&ssl=1" },
                        { name: "Chicken Strips", price: 50.00, desc: "Golden, crunchy strips with Shelby's seasoning in every bite.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Chicken-Tender-I.png?fit=615%2C683&ssl=1" },
                        { name: "Coconut Seafood Soup", price: 90.00, desc: "Mussels, scallops, shrimp, and crawfish swimming in coconut milk — warm, rich, a little sweet.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Coconut-Seafood-Soup-I.png?fit=629%2C687&ssl=1", video: "PWJsNq4ZS5k" },
                        { name: "Gumbo", price: 85.00, desc: "Blue crab and seafood in a dark, peppery gumbo with okra — deep Creole flavor, Shelby style.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Gumbo-I.png?fit=598%2C681&ssl=1", video: "ZzIlVupYeFQ" },
                        { name: "Tuna Wrap", price: 12.00, desc: "Cool, fresh tuna wraps — light, bright, and seasoned her way.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Tuna-Wrap-I.png?fit=619%2C690&ssl=1", video: "N0AJE5dyrTw" },
                        { name: "Chicken Wrap", price: 10.00, desc: "Juicy chicken wrapped up warm with Shelby's seasoning.", img: "" },
                        { name: "Turkey Wrap", price: 10.00, desc: "Fresh turkey wraps — simple, clean, satisfying.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Turkey-Wrap-I.png?fit=617%2C686&ssl=1" },
                        { name: "Fried Chicken", price: 60.00, desc: "Spicy fried chicken — shattering crisp outside, juicy and hot inside.", img: "https://i.ytimg.com/vi/Jxlm39XwYHA/hqdefault.jpg", video: "Jxlm39XwYHA" },
                        { name: "Seafood Rice", price: 80.00, desc: "Golden curry rice loaded with shrimp, mussels, and crawfish — the crawfish riding on top.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Seafood-Rice-I.png?fit=621%2C689&ssl=1", video: "qjYLhTeFxQw" },
                        { name: "Alfredo Pasta with Shrimp", price: 85.00, desc: "Silky cream sauce, plump shrimp, pasta that twirls — the famous first bite says it all.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Pasta-Shrimp-w-Alfredo-Sause.png?fit=577%2C620&ssl=1", video: "yo8HfvdaVDQ" },
                        { name: "Baked Cheese Oyster", price: 100.00, desc: "Oysters under a blanket of melted cheese and parsley butter, with a whisper of hot sauce.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Baked-Oyster-I.png?fit=631%2C674&ssl=1", video: "FEaOpXjYRTk" },
                        { name: "Lasagna", price: 75.00, desc: "Layers of chicken, spinach, and sauce, baked until the top goes golden and bubbly.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Lasagna-I.png?fit=614%2C707&ssl=1", video: "4JXXW8Z5Hxs" },
                        { name: "Steak Combo", price: 90.00, desc: "A full steak combo plate — grilled, seasoned, and piled like catering should be.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Steak-Combo.png?fit=586%2C633&ssl=1" },
                        { name: "Ribs Combo", price: 85.00, desc: "Quarter rack ribs, saucy and tender, with the full combo plate around it.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Qter-Ribs-I.png?fit=618%2C676&ssl=1" },
                        { name: "Fillet of Fish", price: 75.00, desc: "Golden fillet of fish, crisp-edged, with the full combo plate beside it.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Fish-Fillet-Combo-I.png?fit=610%2C680&ssl=1" },
                        { name: "Ravioli Salad", price: 50.00, desc: "Cool ravioli salad — fresh, light, and dressed to wake up the table.", img: "https://i0.wp.com/shelbysfinecuisine.com/wp-content/uploads/2021/11/Ravioli-Salad-I.png?fit=605%2C680&ssl=1" }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                            <div className="h-48 bg-stone-200 rounded-lg mb-4 overflow-hidden relative flex-shrink-0">
                                {item.img ? (
                                    <img 
                                        src={item.img} 
                                        onClick={() => item.video && setSplash({ name: item.name, video: item.video, img: item.img })}
                                        alt={item.name} 
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-red-900 via-red-800 to-stone-900 flex flex-col items-center justify-center text-center">
                                        <span className="font-serif text-4xl font-bold text-yellow-400">Shelby's</span>
                                        <span className="text-stone-200 tracking-[0.3em] text-xs mt-1">FINE CUISINE</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold mb-2 text-red-900">{item.name}</h3>
                                <p className="text-stone-500 text-sm mb-2">{item.desc}</p>
                                {item.video && (
                                    <button type="button" onClick={() => setSplash({ name: item.name, video: item.video, img: item.img })} className="text-red-700 font-bold text-sm hover:underline block mb-4 text-left">▶ Watch Shelby make it</button>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                                <span className="text-lg font-bold text-stone-800">${item.price.toFixed(2)}</span>
                                <AddToCartButton item={item} />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-16 text-center">
                    <button onClick={() => setCurrentPage(Page.CHECKOUT)} className="px-12 py-5 bg-red-600 text-white text-2xl font-bold rounded-full hover:bg-red-500 transition-all shadow-xl uppercase tracking-wide">
                        Place an Order
                    </button>
                </div>
            </Section>
        );

      case Page.FOOD_GALLERY:
        return (
            <Section title={t('gallery.title')} subtitle={t('gallery.subtitle')}>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {GALLERY_PHOTOS.map((photo, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl shadow-md aspect-square bg-stone-200">
                            <img 
                                src={photo.src} 
                                alt={photo.label} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-all">{photo.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <button 
                        onClick={() => setCurrentPage(Page.HOME)}
                        className="px-8 py-3 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition-all shadow-lg"
                    >
                        {t('btn.return')}
                    </button>
                </div>
            </Section>
        );

      case Page.RECIPE_HIGHLIGHT:
        return (
            <Section title="Morpheus Curry Goat" subtitle="A Jamaican Stovetop Classic">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 mb-12">
                        <h3 className="text-2xl font-bold text-red-900 mb-4">The Morpheus Difference</h3>
                        <ul className="grid md:grid-cols-2 gap-4">
                            <li className="flex items-start gap-3"><span className="text-yellow-500 text-xl">★</span><span><strong>The Blend:</strong> Mixing Indian and Asian curry brands for complex depth.</span></li>
                            <li className="flex items-start gap-3"><span className="text-yellow-500 text-xl">★</span><span><strong>The Boost:</strong> Maca powder for distinct earthiness and energy.</span></li>
                            <li className="flex items-start gap-3"><span className="text-yellow-500 text-xl">★</span><span><strong>The Thickener:</strong> Using plantain ends during the sauté.</span></li>
                            <li className="flex items-start gap-3"><span className="text-yellow-500 text-xl">★</span><span><strong>The Cream:</strong> Finishing with coconut milk for velvety texture.</span></li>
                        </ul>
                    </div>

                    <RecipeStep step={1} title="The Foundation" desc="3 lbs Goat Meat, chopped into 2-inch chunks. Rinse thoroughly with water and vinegar to neutralize gamey odors." image="https://images.unsplash.com/photo-1603360946369-dc9bb6f54262?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
                    <RecipeStep step={2} title="The Infusion" desc="Marinate overnight with Jamaican Curry Powder, All-purpose seasoning, Ground Ginger, Allspice, Thyme, and wet aromatics (Garlic, Scallions, Scotch Bonnet)." />
                    <RecipeStep step={3} title="The Sear" desc="Separate meat from aromatics. Brown the meat in oil to build the Maillard reaction. Don't crowd the pot!" image="https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
                    <RecipeStep step={4} title="The Simmer" desc="Return meat to pot, cover with water. Boil > Medium > Low. Simmer until tender." />
                    <RecipeStep step={5} title="The Finish" desc="Add potatoes and WHOLE Scotch Bonnet pepper (don't burst it!). Finish with Coconut Milk for a creamy texture." image="https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" />
                </div>
            </Section>
        );

      case Page.CONTACT_US:
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl max-w-4xl w-full text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 font-serif">Contact Us</h2>
                    <p className="text-xl text-slate-600 mb-12">To place an order, please give us a call or email us.</p>
                    
                    <div className="grid md:grid-cols-2 gap-12 mb-12">
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <span className="text-4xl mb-4 block">📞</span>
                            <h3 className="text-xl font-bold mb-2">Phone</h3>
                            <a href={`tel:${COMPANY_INFO.phone}`} className="text-2xl font-bold text-red-600 hover:underline">{COMPANY_INFO.phone}</a>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <span className="text-4xl mb-4 block">📧</span>
                            <h3 className="text-xl font-bold mb-2">Email</h3>
                            <a href={`mailto:${COMPANY_INFO.email}`} className="text-2xl font-bold text-red-600 hover:underline">{COMPANY_INFO.email}</a>
                        </div>
                    </div>
                    
                    <div className="text-slate-500">
                        <p className="font-bold uppercase tracking-widest mb-2">Location</p>
                        <p className="text-xl">{COMPANY_INFO.address}</p>
                    </div>
                </div>
            </div>
        );

      case Page.CART:
      case Page.CHECKOUT:
         return <CheckoutPage />;

      default: return null;
    }
  };

  const bgClass = getPageBackground(currentPage);

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-900 transition-colors duration-1000 ${bgClass} pt-0`}>
      <div className="sticky top-0 z-[60]">
        <TopTicker />

        <NavBar currentPage={currentPage} setPage={go} t={t} />
      </div>
      <main className={`flex-grow transition-opacity duration-300 ease-in-out ${currentPage === Page.HOME ? 'pb-0' : 'pb-10'}`}>
        <div ref={scrollRef} className="h-0 w-full absolute top-0" />
        {splash ? <DishSplash name={splash.name} video={splash.video} img={splash.img} onBack={() => setSplash(null)} /> : renderContent()}
        {!splash && currentPage !== Page.HOME && <ReturnButton onClick={() => go(Page.HOME)} />}
      </main>
      <VoiceIndicator isActive={isActive} isSpeaking={isSpeaking} toggle={toggleVoice} error={error} />
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800 mt-auto relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center gap-8">
            
            {/* Links above Logo */}
            <div className="flex flex-wrap justify-center gap-8 text-lg font-medium text-stone-300 mb-2 uppercase tracking-tight w-full">
                <button onClick={() => setCurrentPage(Page.HOME)} className="hover:text-white hover:underline transition-all whitespace-nowrap">{t('nav.home')}</button>
                <button onClick={() => setCurrentPage(Page.ABOUT_US)} className="hover:text-white hover:underline transition-all whitespace-nowrap">{t('nav.about')}</button>
                <button onClick={() => setCurrentPage(Page.CONTACT_US)} className="hover:text-white hover:underline transition-all whitespace-nowrap">{t('nav.contact')}</button>
                <button onClick={() => setCurrentPage(Page.CATERING_MENU)} className="hover:text-white hover:underline transition-all whitespace-nowrap">{t('nav.catering')}</button>
            </div>

            <div className="flex flex-col items-center">
                 <button onClick={() => setCurrentPage(Page.HOME)} className="mb-6 hover:opacity-90 transition-opacity"><img src={LOGO_URL} alt="Logo" className="h-24 w-24 rounded-full border-4 border-yellow-400 bg-white object-cover" /></button>
                <h3 className="text-2xl font-bold tracking-wide text-white uppercase mb-2 font-serif">SHELBY'S FINE CUISINE</h3>
                <p className="text-stone-400 text-lg font-bold mb-1">{COMPANY_INFO.address}</p>
                <p className="text-stone-500 text-base font-bold opacity-60">© 2026 All Rights Reserved.</p>
            </div>
        </div>
      </footer>
      {!splash && currentPage !== Page.CHECKOUT && <div className="h-16" />}
      {!splash && currentPage !== Page.CHECKOUT && <BottomMenuBar currentPage={currentPage} go={go} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <CartProvider>
        <ScrollProvider>
          <AppContent />
        </ScrollProvider>
      </CartProvider>
    </LanguageProvider>
  );
};

export default App;
