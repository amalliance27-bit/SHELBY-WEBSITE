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
const LOGO_URL = "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

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
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&playsinline=1`;
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
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
        <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" alt="Food Background" className="w-full h-full object-cover opacity-40" />
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
        addToCart({ id: "Shelby Crema", name: "Shelby Crema", price: 35.00 });
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
                <span className="text-lg font-bold text-stone-800">$35.00</span>
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

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const { language, setLanguage, t } = useLanguage();
  const { scrollToSection } = useScroll();
  
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
                            <span className="bg-yellow-200 px-1 font-bold text-red-900 border-b-2 border-red-600">{t('welcome.highlight')}</span>
                            {t('welcome.p5_end')}
                        </p>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <button onClick={() => setCurrentPage(Page.ABOUT_US)} className="text-red-600 font-bold hover:underline text-xl block">{t('welcome.read_story')}</button>
                            <button onClick={() => setCurrentPage(Page.FOOD_GALLERY)} className="text-stone-600 font-bold hover:underline text-xl block border-l-2 border-stone-300 pl-4">{t('welcome.gallery_btn')}</button>
                        </div>
                        
                        {/* Second Video Panel */}
                        <div className="mt-8">
                            <VideoPanel videoSrc="https://www.youtube.com/watch?v=PeFGdSrFTUw" titleOverride="Nous parlons Français" />
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
                        <img src="https://images.unsplash.com/photo-1507048331197-7d4ac2b7cd29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Chef" className="rounded-2xl shadow-xl mb-8" />
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
                            <img 
                                src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Curry Goat" 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                            />
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-xl font-bold mb-2 text-red-700">Curry Goat (special of the month)</h3>
                            <p className="text-stone-500 text-sm mb-4">Freshly prepared with premium ingredients.</p>
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
                        { name: "Griot", price: 70.00 },
                        { name: "Tassot", price: 80.00 },
                        { name: "Chicken Strips", price: 50.00 },
                        { name: "Coconut Seafood Soup", price: 90.00 },
                        { name: "Gumbo", price: 85.00 },
                        { name: "Tuna Wrap", price: 12.00 },
                        { name: "Chicken Wrap", price: 10.00 },
                        { name: "Turkey Wrap", price: 10.00 },
                        { name: "Fried Chicken", price: 60.00 },
                        { name: "Seafood Rice", price: 80.00 },
                        { name: "Alfredo Pasta with Shrimp", price: 85.00 },
                        { name: "Baked Cheese Oyster", price: 100.00 },
                        { name: "Lasagna", price: 75.00 },
                        { name: "Steak Combo", price: 90.00 },
                        { name: "Ribs Combo", price: 85.00 },
                        { name: "Fillet of Fish", price: 75.00 },
                        { name: "Ravioli Salad", price: 50.00 }
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-xl shadow-md border border-stone-100 hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col">
                            <div className="h-48 bg-stone-200 rounded-lg mb-4 overflow-hidden relative flex-shrink-0">
                                <img 
                                    src={`https://source.unsplash.com/featured/?food,${item.name.split(' ')[0]}`} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                />
                            </div>
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold mb-2 text-red-900">{item.name}</h3>
                                <p className="text-stone-500 text-sm mb-4">Freshly prepared with premium ingredients.</p>
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
                    {Array.from({ length: 28 }).map((_, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-xl shadow-md aspect-square bg-stone-200">
                            <img 
                                src={`https://picsum.photos/seed/shelbyfood${idx}/800/800`} 
                                alt={`Food Gallery Item ${idx + 1}`} 
                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                <span className="text-white opacity-0 group-hover:opacity-100 font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-all">Delight {idx + 1}</span>
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

        <NavBar currentPage={currentPage} setPage={setCurrentPage} t={t} />
      </div>
      <main className={`flex-grow transition-opacity duration-300 ease-in-out ${currentPage === Page.HOME ? 'pb-0' : 'pb-10'}`}>
        <div ref={scrollRef} className="h-0 w-full absolute top-0" />
        {renderContent()}
        {currentPage !== Page.HOME && <ReturnButton onClick={() => setCurrentPage(Page.HOME)} />}
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
