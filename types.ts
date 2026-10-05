export enum Page {
  HOME = 'HOME',
  ABOUT_US = 'ABOUT_US',
  CATERING_MENU = 'CATERING_MENU',
  RECIPE_HIGHLIGHT = 'RECIPE_HIGHLIGHT',
  CART = 'CART',
  CHECKOUT = 'CHECKOUT',
  CONTACT_US = 'CONTACT_US',
  WEB_DESIGN = 'WEB_DESIGN',
  FOOD_GALLERY = 'FOOD_GALLERY'
}

export interface NavigationState {
  currentPage: Page;
  isScrolling: boolean;
}