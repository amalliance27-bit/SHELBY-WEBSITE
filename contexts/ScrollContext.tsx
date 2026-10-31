import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

interface ScrollContextType {
  lenis: Lenis | null;
  isAutoScrolling: boolean;
  setIsAutoScrolling: (isScrolling: boolean) => void;
  scrollToSection: (id: string) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const reqRef = useRef<number>();

  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: 0.7,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 2,
    });

    setLenis(lenisInstance);

    function raf(time: number) {
      lenisInstance.raf(time);
      reqRef.current = requestAnimationFrame(raf);
    }

    reqRef.current = requestAnimationFrame(raf);

    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
      lenisInstance.destroy();
    };
  }, []);

  // Auto-scroll logic. Master Paul's rule (Oct 30, 2026): the moment the
  // visitor touches the scroll, the auto-scroll RELEASES — no fighting their
  // hand — and it only returns after 2 minutes without a touch.
  useEffect(() => {
    if (!lenis || !isAutoScrolling) return;

    let direction = 1;
    let userInteracting = false;
    let resumeTimeout: ReturnType<typeof setTimeout> | undefined;

    const handleInteraction = () => {
      userInteracting = true;
      if (resumeTimeout) clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        userInteracting = false;
      }, 120000);
    };

    window.addEventListener('pointerdown', handleInteraction);
    window.addEventListener('wheel', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction);

    const scrollInterval = setInterval(() => {
      // Ensure we have a valid scroll limit and user is not interacting
      if (lenis.limit > 0 && !userInteracting) {
        // Check limits for bounce with a small buffer
        if (lenis.scroll >= lenis.limit - 5) {
          direction = -1; // Switch to scrolling UP
        } else if (lenis.scroll <= 5) {
          direction = 1; // Switch to scrolling DOWN
        }

        // Scroll by 1 pixel every 20ms (approx 50px/sec)
        // immediate: true prevents smooth easing for this tick, creating a constant linear motion
        lenis.scrollTo(lenis.scroll + direction, { immediate: true });
      }
    }, 20);

    return () => {
      clearInterval(scrollInterval);
      if (resumeTimeout) clearTimeout(resumeTimeout);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('wheel', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [lenis, isAutoScrolling]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element && lenis) {
      lenis.scrollTo(element, { offset: 0 });
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, isAutoScrolling, setIsAutoScrolling, scrollToSection }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};
