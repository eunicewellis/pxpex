import crypto from "crypto";
import type { CourierId } from "@/data/couriers";
import { getCourierOrThrow } from "@/data/couriers";

// Alphabet excludes easily-confused characters (0/O, 1/I/L).
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const DIGITS = "0123456789";

function randomString(length: number, alphabet: string): string {
  const bytes = crypto.randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[bytes[i] % alphabet.length];
  }
  return out;
}

export function generateTrackingNumber(): string {
  return `CL-${randomString(10, ALPHABET)}`;
}

/**
 * Generate a tracking number that matches the format of the selected courier
 * (e.g. USPS "94…", FedEx 12 digits, UPS "1Z…", DHL 10 digits, Amazon "TBA…").
 */
export function generateCourierTrackingNumber(courierId: CourierId): string {
  const courier = getCourierOrThrow(courierId);
  const alphabet = courier.tracking.numeric ? DIGITS : ALPHABET;
  const suffix = randomString(courier.tracking.length, alphabet);
  return `${courier.tracking.prefix}${suffix}`;
}

export function generateUniqueCourierTrackingNumber(
  courierId: CourierId,
  existing: string[]
): string {
  const set = new Set(existing.map((n) => n.toUpperCase()));
  let number = generateCourierTrackingNumber(courierId);
  while (set.has(number)) {
    number = generateCourierTrackingNumber(courierId);
  }
  return number;
}

export function generateUniqueTrackingNumber(existing: string[]): string {
  const set = new Set(existing.map((n) => n.toUpperCase()));
  let number = generateTrackingNumber();
  while (set.has(number)) {
    number = generateTrackingNumber();
  }
  return number;
}

export function normalizeTrackingNumber(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
