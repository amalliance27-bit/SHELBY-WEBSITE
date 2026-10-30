import { Page } from './types';

export const COMPANY_INFO = {
  name: "Shelby's Fine Cuisine",
  phone: "(786) 877-7585",
  email: "shelbysfinecuisine@gmail.com",
  website: "www.shelbysfinecuisine.com",
  address: "Miami and Broward, Florida",
  hours: "Catering Services - Call for details",
  tagline: "Taste So Good......",
};

export const PAGE_CONTENT: Record<Page, { title: string; summary: string; details: string }> = {
  [Page.HOME]: {
    title: "Shelby's Fine Cuisine",
    summary: "Taste So Good......",
    details: "Welcome to Shelby's Fine Cuisine. We offer an impressive display of dishes for any occasion. From Griot to Tassot, Chicken Strips to Coconut Seafood Soup, we have it all."
  },
  [Page.ABOUT_US]: {
    title: "About Us",
    summary: "A passion for cooking since age 12.",
    details: "Thanks for visiting Shelby's Fine Cuisine. Ever since I was young, I've always had a passion for cooking. I started cooking for my whole family by the age of 12 and I even created a few recipes on my own. Practice makes perfect, I cooked whenever is possible. Now that I have my own family, they are my food tasters. I have numerous recipes of great tasting meals, and I want to share my love of cooking with the world. Be on the lookout for our YouTube channel where I will be sharing some recipes. If you are in the Miami or Broward area, you don't have to wait; give us a call and we'll be more than happy to cater for any events or over a minimum of 5."
  },
  [Page.CATERING_MENU]: {
    title: "Catering Menu",
    summary: "Dishes for any occasion.",
    details: `We offer an impressive display of dishes for any occasion.
    
    Menu Items:
    - Griot
    - Tassot
    - Chicken strips
    - Coconut seafood soup
    - Gumbo
    - Tuna wrap
    - Chicken wrap
    - Turkey wrap
    - Fried chicken
    - Seafood rice
    - Alfredo pasta with shrimp
    - Baked cheese oyster
    - Lasagna shrimp or beef or chicken
    - Steak combo
    - 1/4 rack ribs combo
    - Fillet of fish Combo
    - Ravioli salad
    - Bouillon
    - Thanksgiving Dinner
    
    All of our dishes are prepared with fresh ingredients; our seafood and meat are thoroughly clean before seasoning is applied.`
  },
  [Page.RECIPE_HIGHLIGHT]: {
    title: "Morpheus Curry Goat",
    summary: "A Jamaican Stovetop Classic.",
    details: "A masterclass in heat, spice, and patience. Featuring the Morpheus Difference: A blend of Indian and Asian curry brands, Maca powder for earthiness, plantain ends for thickening, and a coconut milk finish."
  },
  [Page.CART]: {
    title: "Cart",
    summary: "Your selected items.",
    details: "Your cart is currently empty. Return to Shop."
  },
  [Page.CHECKOUT]: {
    title: "Checkout",
    summary: "Complete your order.",
    details: "Please contact us to finalize your catering order."
  },
  [Page.CONTACT_US]: {
    title: "Contact Us",
    summary: "Get in touch for catering.",
    details: `To place an order, please give us a call or text us at ${COMPANY_INFO.phone} or email us at ${COMPANY_INFO.email}. Location: ${COMPANY_INFO.address}.`
  },
  [Page.WEB_DESIGN]: {
    title: "Web Designed by Jarvis-27",
    summary: "Slick Tech AI Design services for your website needs.",
    details: "Jarvis-27 designs front end UI web apps and sites for developers and everyday clients. Featuring high-tech aesthetics and modern AI-driven design. Contact via WhatsApp: 778-953-5496."
  },
  [Page.FOOD_GALLERY]: {
    title: "Food Gallery",
    summary: "A Visual Feast",
    details: "A collection of our finest dishes, prepared with passion and precision."
  }
};