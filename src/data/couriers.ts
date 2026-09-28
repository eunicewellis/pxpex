// Courier catalog — the top 5 delivery services in the USA.
//
// NOTE: We intentionally do NOT reproduce any official logo artwork or exact
// copies of the carriers' sites. Each entry here only stores publicly-known
// brand colors (color values are not copyrightable) and a Google Font that is
// a close typographic match. Admin-provided logo files are referenced via
// `logoPath` and rendered by <CourierLogo /> with a styled-text fallback.

export type CourierId = "usps" | "fedex" | "ups" | "dhl" | "amazon";

export interface CourierTheme {
  /** Main brand color — used for primary buttons, headers, links. */
  primary: string;
  /** Darker shade of the primary color for hovers/gradients. */
  primaryDark: string;
  /** Secondary/accent brand color. */
  secondary: string;
  /** Dark background color for the themed page hero/footer. */
  dark: string;
  /** Light tint used for subtle backgrounds. */
  light: string;
  /** Body text color on light backgrounds. */
  text: string;
  /** Text/icon color when placed on the primary color. */
  onPrimary: string;
  /** CSS font stack (maps to a Google Font registered in layout.tsx). */
  font: string;
  /** Fallback wordmark text shown when no logo image is provided. */
  logoText: string;
}

export interface CourierTracking {
  /** Fixed prefix of the generated tracking number ("" when none). */
  prefix: string;
  /** Number of random characters to append after the prefix. */
  length: number;
  /** When true, only digits are used. When false, digits + uppercase letters. */
  numeric: boolean;
}

export interface Courier {
  id: CourierId;
  name: string;
  fullName: string;
  tagline: string;
  website: string;
  /** Path (relative to /public) where an admin-supplied logo lives. */
  logoPath: string;
  tracking: CourierTracking;
  theme: CourierTheme;
}

export const COURIERS: Courier[] = [
  {
    id: "usps",
    name: "USPS",
    fullName: "United States Postal Service",
    tagline: "Track your package with the Postal Service",
    website: "https://www.usps.com",
    logoPath: "/images/couriers/usps.svg",
    tracking: { prefix: "94", length: 20, numeric: true },
    theme: {
      primary: "#004B87",
      primaryDark: "#003A6B",
      secondary: "#DA291C",
      dark: "#002E52",
      light: "#F4F8FB",
      text: "#1f2937",
      onPrimary: "#ffffff",
      font: "var(--font-archivo), 'Archivo', 'Helvetica Neue', Arial, sans-serif",
      logoText: "USPS",
    },
  },
  {
    id: "fedex",
    name: "FedEx",
    fullName: "FedEx Corporation",
    tagline: "The World on Time",
    website: "https://www.fedex.com",
    logoPath: "/images/couriers/fedex.svg",
    tracking: { prefix: "", length: 12, numeric: true },
    theme: {
      primary: "#4D148C",
      primaryDark: "#3B0F6B",
      secondary: "#FF6600",
      dark: "#2F0B57",
      light: "#F6F1FB",
      text: "#1f2937",
      onPrimary: "#ffffff",
      font: "var(--font-montserrat), 'Montserrat', 'Helvetica Neue', Arial, sans-serif",
      logoText: "FedEx",
    },
  },
  {
    id: "ups",
    name: "UPS",
    fullName: "United Parcel Service",
    tagline: "United Problem Solvers",
    website: "https://www.ups.com",
    logoPath: "/images/couriers/ups.svg",
    tracking: { prefix: "1Z", length: 16, numeric: false },
    theme: {
      primary: "#351C15",
      primaryDark: "#2A150D",
      secondary: "#FFB500",
      dark: "#24120C",
      light: "#F8F4F0",
      text: "#1f2937",
      onPrimary: "#FFB500",
      font: "var(--font-roboto), 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      logoText: "UPS",
    },
  },
  {
    id: "dhl",
    name: "DHL",
    fullName: "DHL Express",
    tagline: "Excellence. Simply delivered.",
    website: "https://www.dhl.com",
    logoPath: "/images/couriers/dhl.svg",
    tracking: { prefix: "", length: 10, numeric: true },
    theme: {
      primary: "#D40511",
      primaryDark: "#B2040E",
      secondary: "#FFCC00",
      dark: "#8F030C",
      light: "#FFF8E1",
      text: "#1f2937",
      onPrimary: "#FFCC00",
      font: "var(--font-roboto), 'Roboto', 'Helvetica Neue', Arial, sans-serif",
      logoText: "DHL",
    },
  },
  {
    id: "amazon",
    name: "Amazon",
    fullName: "Amazon Logistics",
    tagline: "Delivery at your door",
    website: "https://www.amazon.com",
    logoPath: "/images/couriers/amazon.svg",
    tracking: { prefix: "TBA", length: 12, numeric: true },
    theme: {
      primary: "#131A22",
      primaryDark: "#0F141B",
      secondary: "#FF9900",
      dark: "#232F3E",
      light: "#F0F2F5",
      text: "#1f2937",
      onPrimary: "#FF9900",
      font: "var(--font-inter), 'Inter', 'Helvetica Neue', Arial, sans-serif",
      logoText: "amazon",
    },
  },
];

export function getCourier(id: string): Courier | undefined {
  return COURIERS.find((c) => c.id === id);
}

export function getCourierOrThrow(id: string): Courier {
  const courier = getCourier(id);
  if (!courier) {
    throw new Error(`Unknown courier: ${id}`);
  }
  return courier;
}
