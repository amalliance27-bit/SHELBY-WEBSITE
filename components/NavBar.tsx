import React, { useState } from 'react';
import { Page } from '../types';
import { COMPANY_INFO } from '../constants';
import { useCart } from '../contexts/CartContext';

interface NavBarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  t: (key: string) => string;
}

export const NavBar: React.FC<NavBarProps> = ({ currentPage, setPage, t }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const links = [
    { id: Page.HOME, label: t('nav.home') },
    { id: Page.ABOUT_US, label: t('nav.about') },
    { id: Page.CATERING_MENU, label: t('nav.catering') },
    { id: Page.RECIPE_HIGHLIGHT, label: t('nav.recipe') },
    { id: Page.CONTACT_US, label: t('nav.contact') }
  ];

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsMenuOpen(false);
  };

  // Using the original logo from App.tsx
  const LOGO_URL = "https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80";

  const isHome = currentPage === Page.HOME;

  return (
    <>
      <nav className={`shadow-xl transition-all duration-300 ${isHome ? 'bg-red-900 border-b-4 border-yellow-600' : 'bg-slate-900 border-b border-slate-800'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28"> 
            
            {/* Left: Logo & Title */}
            <div className="flex items-center cursor-pointer group flex-shrink-0 gap-4" onClick={() => handleNavClick(Page.HOME)}>
               <img 
                  src={LOGO_URL}
                  alt="Shelby's Logo" 
                  className="h-20 w-20 md:h-24 md:w-24 rounded-full border-4 border-yellow-400 shadow-md object-cover bg-white transform group-hover:scale-105 transition-transform"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-extrabold text-2xl md:text-3xl text-white leading-none tracking-tight uppercase font-serif">Shelby's</span>
                  <span className="text-sm md:text-base text-yellow-400 font-black uppercase tracking-[0.2em] mt-1 drop-shadow-sm">{t('nav.subtitle')}</span>
                </div>
            </div>

            {/* Right: Navigation Links (Desktop) */}
            <div className="hidden xl:flex items-center justify-end space-x-1">
                {links.map((link) => (
                    <button
                    key={link.id}
                    onClick={() => setPage(link.id)}
                    className={`px-3 py-2 rounded-lg text-lg font-bold transition-all duration-200 ${
                        currentPage === link.id
                        ? 'text-white bg-red-800 shadow-inner'
                        : 'text-red-100 hover:text-white hover:bg-red-800'
                    }`}
                    >
                    {link.label}
                    </button>
                ))}

              {/* Separator */}
              <div className="h-8 w-px bg-red-700 mx-4"></div>
              
              {/* Action Buttons */}
               <div className="flex items-center gap-3">
                  <button 
                    className="px-4 py-2 rounded-full text-base font-bold uppercase tracking-wide bg-red-800 border border-red-600 text-red-100 hover:bg-red-700 transition-colors flex items-center gap-2"
                    onClick={() => setPage(Page.CHECKOUT)}
                  >
                    <span>{t('nav.cart')}</span>
                    {cartCount > 0 && (
                      <span className="bg-yellow-500 text-red-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </button>

                  <button 
                    className="px-6 py-3 rounded-lg text-lg font-bold bg-yellow-500 text-red-900 hover:bg-yellow-400 shadow-md transition-transform hover:scale-105 whitespace-nowrap"
                    onClick={() => setPage(Page.CHECKOUT)}
                  >
                    {t('nav.order')}
                  </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center xl:hidden mb-6 gap-4">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-md text-red-100 hover:bg-red-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                <svg className="block h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-Over Panel Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsMenuOpen(false)}></div>
          
          {/* Panel */}
          <div className="fixed inset-x-0 top-0 bg-red-50 shadow-2xl transform transition-transform duration-300 ease-in-out max-h-screen overflow-y-auto rounded-b-3xl border-b-4 border-yellow-400">
             {/* Panel Header */}
             <div className="flex items-center justify-between px-6 py-6 border-b border-red-100 bg-white">
                <div className="flex items-center gap-3">
                   <img 
                      src={LOGO_URL}
                      alt="Logo"
                      className="h-12 w-12 rounded-full border-2 border-yellow-400 object-cover bg-white"
                   />
                   <div className="flex flex-col">
                      <span className="font-bold text-red-900 leading-none text-xl uppercase font-serif">Shelby's</span>
                      <span className="text-sm text-red-600 font-bold uppercase tracking-wider">{t('nav.subtitle')}</span>
                   </div>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 transition-colors"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
             </div>

             {/* Links List */}
             <div className="p-4 space-y-1 bg-slate-50/50">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`block w-full text-left px-6 py-4 rounded-xl text-xl font-bold transition-all ${
                      currentPage === link.id
                        ? 'bg-red-50 text-red-600 shadow-sm translate-x-1'
                        : 'text-slate-600 hover:bg-white hover:text-red-900 hover:shadow-sm'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
             </div>
             
             {/* Bottom CTA */}
             <div className="p-6 bg-white border-t border-red-100">
                <button 
                   onClick={() => handleNavClick(Page.CONTACT_US)}
                   className="w-full py-4 bg-yellow-500 text-red-900 font-bold rounded-xl shadow-md hover:bg-yellow-400 uppercase tracking-wide text-xl"
                >
                   {t('nav.call_to_order')}
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};