import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const WHATSAPP_NUMBER = "573105679517";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export const getWhatsAppUrl = (message?: string) => {
  if (!message) return WHATSAPP_URL;
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
};

