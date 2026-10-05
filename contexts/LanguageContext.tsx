import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'en' | 'es' | 'fr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // NavBar
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.catering': 'Catering Menu',
    'nav.recipe': 'Morpheus Recipe',
    'nav.contact': 'Contact Us',
    'nav.cart': 'Cart',
    'nav.order': 'Order Now',
    'nav.subtitle': 'Fine Cuisine',
    'nav.call_to_order': 'Call to Order',

    // Top Ticker
    'ticker.visitors': 'Visitors:',
    'ticker.recipe': 'Recipe of the Month:',
    'ticker.specials': 'Specials:',
    'ticker.thursday': 'Thirsty Thursday:',
    'ticker.thursday_text': '2-for-1 Drink Specials & Live Music!',
    'ticker.se_habla': 'Se Habla Español',
    'ticker.rate_us': 'Rate Us:',
    'ticker.taste_so_good': 'Taste So Good......',
    'ticker.recipe_name': 'Morpheus Curry Goat',
    'ticker.specials_text': 'Coconut Seafood Soup & Griot Platter',

    // Hero
    'hero.title': "SHELBY'S",
    'hero.subtitle': 'Fine Cuisine',
    'hero.tagline': '"Taste So Good......"',
    'hero.view_menu': 'View Menu',
    
    // Video Panel
    'video.title': 'Se Habla Español',
    'video.subtitle': 'Taste So Good......',

    // Testimonials
    'testimonials.title': 'What Our Customers Say',

    // Common
    'btn.return': 'Return to Home',
    
    // Sections
    'section.welcome': 'Welcome',
    'section.featured': 'Featured Dish',
    'welcome.subtitle': 'A Passion for Cooking',
    'welcome.intro': 'Thanks for visiting Shelby’s Fine Cuisine.',
    'welcome.p1': 'Ever since I was young, cooking has been more than a hobby — it has been a calling.',
    'welcome.p2_start': 'By the age of 12, I was already preparing meals for my entire family, learning that food has the power to bring people together.',
    'welcome.p3': 'Over time, I began creating my own recipes, blending tradition with creativity and discovering the joy of turning simple ingredients into memorable experiences.',
    'welcome.p4': 'Practice truly makes perfect. I cooked whenever possible — after school, on weekends, for gatherings and celebrations. Each dish became an opportunity to refine flavor, balance texture, and present meals with care. Now that I have my own family, they are my food tasters. I have numerous recipes of great tasting meals, and I want to share my love of cooking with the world.',
    'welcome.p5_start': 'Be on the lookout for our YouTube channel where I will be sharing some recipes. If you are in the Miami or Broward area, you don’t have to wait; give us a call and we’ll be more than happy to cater for any events or for a ',
    'welcome.highlight': 'minimum of 5 people',
    'welcome.p5_end': '. Through years of dedication, I’ve developed a collection of flavorful, home-crafted recipes that consistently bring comfort and delight to the table.',
    'welcome.read_story': 'Read Our Story →',
    'welcome.gallery_btn': 'View Food Gallery',
    'gallery.title': 'Food Gallery',
    'gallery.subtitle': 'A Visual Feast',

    // About Us
    'about.title': 'About Us',
    'about.subtitle': 'Trustworthy. Dedicated. Family First.',
    'about.chef': 'Chef Shelby',
    'about.quote': '"My life\'s dream is to share my love of cooking with the world."',
    'about.p1': 'Thanks for visiting Shelby’s Fine Cuisine. Ever since I was young, cooking has been more than a hobby — it has been a calling. By the age of 12, I was already preparing meals for my entire family, learning that food has the power to bring people together. Over time, I began creating my own recipes, blending tradition with creativity and discovering the joy of turning simple ingredients into memorable experiences.',
    'about.p2': 'Practice truly makes perfect. I cooked whenever possible — after school, on weekends, for gatherings and celebrations. Each dish became an opportunity to refine flavor, balance texture, and present meals with care. Now that I have my own family, they are my food tasters. I have numerous recipes of great tasting meals, and I want to share my love of cooking with the world. Be on the lookout for our YouTube channel where I will be sharing some recipes. If you are in the Miami or Broward area, you don’t have to wait; give us a call and we’ll be more than happy to cater for any events or for a minimum of 5 people. Through years of dedication, I’ve developed a collection of flavorful, home-crafted recipes that consistently bring comfort and delight to the table.',
    'about.p3': 'At Shelby’s Fine Cuisine, every meal is prepared with intention, heart, and a commitment to quality. My goal is simple: to share authentic, beautifully prepared dishes that feel both comforting and elevated. Whether you are enjoying a casual family dinner or celebrating a special occasion, I invite you to experience food made with passion, precision, and genuine love.',
    
    // Quotes
    'quote.leah': '"The best way to know people is through food."',
    'quote.leah_author': 'Chef Leah Chase',
  },
  es: {
    // NavBar
    'nav.home': 'Inicio',
    'nav.about': 'Nosotros',
    'nav.catering': 'Menú Catering',
    'nav.recipe': 'Receta Morpheus',
    'nav.contact': 'Contáctenos',
    'nav.cart': 'Carrito',
    'nav.order': 'Ordenar Ahora',
    'nav.subtitle': 'Cocina Fina',
    'nav.call_to_order': 'Llamar para Ordenar',

    // Top Ticker
    'ticker.visitors': 'Visitantes:',
    'ticker.recipe': 'Receta del Mes:',
    'ticker.specials': 'Especiales:',
    'ticker.thursday': 'Jueves de Sed:',
    'ticker.thursday_text': '¡2x1 en Bebidas y Música en Vivo!',
    'ticker.se_habla': 'Se Habla Español',
    'ticker.rate_us': 'Califícanos:',
    'ticker.taste_so_good': 'Sabe Tan Bien......',
    'ticker.recipe_name': 'Morpheus Curry de Cabra',
    'ticker.specials_text': 'Sopa de Mariscos con Coco y Plato de Griot',

    // Hero
    'hero.title': "SHELBY'S",
    'hero.subtitle': 'Cocina Fina',
    'hero.tagline': '"Sabe Tan Bien......"',
    'hero.view_menu': 'Ver Menú',
    
    // Video Panel
    'video.title': 'Se Habla Español',
    'video.subtitle': 'Sabe Tan Bien......',

    // Testimonials
    'testimonials.title': 'Lo Que Dicen Nuestros Clientes',

    // Common
    'btn.return': 'Volver al Inicio',

    // Sections
    'section.welcome': 'Bienvenido',
    'section.featured': 'Plato Destacado',
    'welcome.subtitle': 'Una Pasión por la Cocina',
    'welcome.p1': 'Gracias por visitar Shelby’s Fine Cuisine. Desde que era joven, siempre he tenido pasión por la cocina. Comencé a cocinar para toda mi familia a los 12 años e incluso creé algunas recetas propias.',
    'welcome.p2': 'La práctica hace al maestro, cocinaba siempre que era posible. Ahora que tengo mi propia familia, ellos son mis catadores. Tengo numerosas recetas de comidas deliciosas y quiero compartir mi amor por la cocina con el mundo.',
    'welcome.read_story': 'Lee Nuestra Historia →',

    // About Us
    'about.title': 'Sobre Nosotros',
    'about.subtitle': 'Confiable. Dedicado. La Familia Primero.',
    'about.chef': 'Chef Shelby',
    'about.quote': '"El sueño de mi vida es compartir mi amor por la cocina con el mundo."',
    'about.p1': "Gracias por visitar Shelby's Fine Cuisine. Desde que era joven, siempre he tenido pasión por la cocina. Comencé a cocinar para toda mi familia a los 12 años e incluso creé algunas recetas propias. La práctica hace al maestro, cocinaba siempre que era posible. Ahora que tengo mi propia familia, ellos son mis catadores. Tengo numerosas recetas de comidas deliciosas y quiero compartir mi amor por la cocina con el mundo.",
    'about.p2': "Estén atentos a nuestro canal de YouTube donde compartiré algunas recetas. Si estás en el área de Miami o Broward, no tienes que esperar; llámanos y estaremos más que felices de atender cualquier evento o para un mínimo de 5 personas.",

    // Quotes
    'quote.leah': '"La mejor forma de conocer a las personas es a través de la comida."',
    'quote.leah_author': 'Chef Leah Chase',
  },
  fr: {
    // NavBar
    'nav.home': 'Accueil',
    'nav.about': 'À Propos',
    'nav.catering': 'Menu Traiteur',
    'nav.recipe': 'Recette Morpheus',
    'nav.contact': 'Contactez-nous',
    'nav.cart': 'Panier',
    'nav.order': 'Commander',
    'nav.subtitle': 'Cuisine Fine',
    'nav.call_to_order': 'Appeler pour Commander',

    // Top Ticker
    'ticker.visitors': 'Visiteurs:',
    'ticker.recipe': 'Recette du Mois:',
    'ticker.specials': 'Spéciaux:',
    'ticker.thursday': 'Jeudi Soif:',
    'ticker.thursday_text': 'Spéciaux 2 pour 1 et Musique Live!',
    'ticker.se_habla': 'Se Habla Español',
    'ticker.rate_us': 'Évaluez-nous:',
    'ticker.taste_so_good': 'Si Bon......',
    'ticker.recipe_name': 'Morpheus Curry de Chèvre',
    'ticker.specials_text': 'Soupe de Fruits de Mer au Coco et Plat Griot',

    // Hero
    'hero.title': "SHELBY'S",
    'hero.subtitle': 'Cuisine Fine',
    'hero.tagline': '"Si Bon......"',
    'hero.view_menu': 'Voir le Menu',
    
    // Video Panel
    'video.title': 'Se Habla Español',
    'video.subtitle': 'Si Bon......',

    // Testimonials
    'testimonials.title': 'Ce Que Disent Nos Clients',

    // Common
    'btn.return': 'Retour à l\'Accueil',

    // Sections
    'section.welcome': 'Bienvenue',
    'section.featured': 'Plat En Vedette',
    'welcome.subtitle': 'Une Passion pour la Cuisine',
    'welcome.p1': 'Merci de visiter Shelby’s Fine Cuisine. Depuis mon plus jeune âge, j\'ai toujours eu une passion pour la cuisine. J\'ai commencé à cuisiner pour toute ma famille à l\'âge de 12 ans et j\'ai même créé quelques recettes moi-même.',
    'welcome.p2': 'C\'est en forgeant qu\'on devient forgeron, je cuisinais dès que possible. Maintenant que j\'ai ma propre famille, ce sont mes goûteurs. J\'ai de nombreuses recettes de plats délicieux et je veux partager mon amour de la cuisine avec le monde.',
    'welcome.read_story': 'Lire Notre Histoire →',

    // About Us
    'about.title': 'À Propos de Nous',
    'about.subtitle': 'Digne de confiance. Dévoué. La Famille d\'Abord.',
    'about.chef': 'Chef Shelby',
    'about.quote': '"Le rêve de ma vie est de partager mon amour de la cuisine avec le monde."',
    'about.p1': "Merci de visiter Shelby's Fine Cuisine. Depuis mon plus jeune âge, j'ai toujours eu une passion pour la cuisine. J'ai commencé à cuisiner pour toute ma famille à l'âge de 12 ans et j'ai même créé quelques recettes moi-même. C'est en forgeant qu'on devient forgeron, je cuisinais dès que possible. Maintenant que j'ai ma propre famille, ce sont mes goûteurs. J'ai de nombreuses recettes de plats délicieux et je veux partager mon amour de la cuisine avec le monde.",
    'about.p2': "Soyez à l'affût de notre chaîne YouTube où je partagerai quelques recettes. Si vous êtes dans la région de Miami ou de Broward, vous n'avez pas à attendre ; appelez-nous et nous serons plus qu'heureux de servir pour tout événement ou pour un minimum de 5 personnes.",

    // Quotes
    'quote.leah': '"La meilleure façon de connaître les gens est à travers la nourriture."',
    'quote.leah_author': 'Chef Leah Chase',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
