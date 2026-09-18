/**
 * Single source of truth for contact links used across the site.
 * Change the number / message here and every button updates.
 */
export const WHATSAPP_NUMBER = "918082068480";
export const CONTACT_EMAIL = "r.k.prajapati0307@gmail.com";
export const CONTACT_PHONE_DISPLAY = "+91 80820 68480";

const quoteMessage =
  "Hi Rohit, I found your portfolio. I need a website for: ______ (business / shop / portfolio / other). " +
  "My budget is roughly: ______. Can you share a quote?";

const generalMessage = "Hi Rohit, I'm interested in your web development services. Can we talk?";

export const WHATSAPP_QUOTE_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(quoteMessage)}`;
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(generalMessage)}`;
