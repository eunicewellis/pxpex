// Shared domain types for Carters Logistics

import type { CourierId } from "@/data/couriers";

export type StatusCode =
  | "order_created"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered";

export interface Shipment {
  id: string;
  trackingNumber: string;
  /** Courier (delivery service) this shipment belongs to. */
  courier: CourierId;
  /** Id of the admin user who created this shipment (null for seeded demo). */
  ownerId: string | null;
  productName: string;
  productImage: string | null; // path (e.g. /api/uploads/...) or full URL
  recipientName: string;
  clientEmail?: string;
  senderName?: string;
  senderEmail?: string;
  senderAddress?: string;
  origin: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
  destinationZip: string;
  statusCode: StatusCode;
  statusLabel: string; // editable display text, e.g. "In Transit"
  description?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StatusStep {
  key: StatusCode;
  label: string;
}

export interface SiteSettings {
  companyName: string;
  companyEmail: string;
  contactCtaText: string;
  trackingTitle: string;
  trackingSubtitle: string;
  statusSteps: StatusStep[];
}

export interface AdminRecord {
  salt: string;
  passwordHash: string;
}

/** A registered admin user (multi-admin signup/login). */
export interface AdminUser {
  id: string;
  username: string;
  email: string;
  salt: string;
  passwordHash: string;
  createdAt: string;
}

/** Public-safe admin user shape returned to the client. */
export interface AdminUserPublic {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

