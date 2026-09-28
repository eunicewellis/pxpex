import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Headset,
  MapPin,
  PackageCheck,
  Send,
  User,
} from "lucide-react";
import { ProductImage } from "@/components/shared/ProductImage";
import { formatDate, formatDateTime } from "@/lib/utils";
import type { Courier } from "@/data/couriers";
import type { Shipment, SiteSettings } from "@/types";

export function CourierTrackResult({
  shipment,
  courier,
  settings,
}: {
  shipment: Shipment;
  courier: Courier;
  settings: SiteSettings;
}) {
  const steps = settings.statusSteps ?? [];
  const foundIndex = steps.findIndex((s) => s.key === shipment.statusCode);
  const currentIndex = foundIndex === -1 ? steps.length - 1 : foundIndex;

  const destination = [
    shipment.destinationAddress,
    shipment.destinationCity,
    shipment.destinationState,
    shipment.destinationZip,
  ]
    .filter(Boolean)
    .join(", ");

  const subject = `Inquiry about shipment ${shipment.trackingNumber}`;
  const body = `Hello ${settings.companyName} team,\n\nI would like to get more information about my shipment.\n\nTracking number: ${shipment.trackingNumber}\nProduct: ${shipment.productName}\n\nThank you.`;
  const mailto = `mailto:${settings.companyEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  const primary = courier.theme.primary;

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-5">
      {/* Details */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card lg:col-span-3">
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5"
          style={{ backgroundColor: courier.theme.light }}
        >
          <h2 className="text-xl font-bold" style={{ color: courier.theme.text }}>
            Shipment Details
          </h2>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 font-mono text-xs font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            {shipment.trackingNumber}
          </span>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
          <div>
            <ProductImage
              src={shipment.productImage}
              alt={shipment.productName}
              className="aspect-[4/3] w-full rounded-xl"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </p>
            <h3 className="mt-1 text-lg font-semibold" style={{ color: courier.theme.text }}>
              {shipment.productName}
            </h3>

            <dl className="mt-5 space-y-3 text-sm">
              {shipment.recipientName && (
                <div className="flex items-start gap-2.5">
                  <User className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                  <div>
                    <dt className="text-slate-400">Recipient</dt>
                    <dd className="font-medium text-slate-700">
                      {shipment.recipientName}
                    </dd>
                  </div>
                </div>
              )}
              {(shipment.senderName || shipment.senderEmail || shipment.senderAddress) && (
                <div className="flex items-start gap-2.5">
                  <Send className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                  <div className="space-y-0.5">
                    <dt className="text-slate-400">Sender</dt>
                    {shipment.senderName && (
                      <dd className="font-medium text-slate-700">{shipment.senderName}</dd>
                    )}
                    {shipment.senderEmail && (
                      <dd className="text-slate-500">{shipment.senderEmail}</dd>
                    )}
                    {shipment.senderAddress && (
                      <dd className="text-slate-500">{shipment.senderAddress}</dd>
                    )}
                  </div>
                </div>
              )}
              {shipment.origin && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                  <div>
                    <dt className="text-slate-400">Origin</dt>
                    <dd className="font-medium text-slate-700">{shipment.origin}</dd>
                  </div>
                </div>
              )}
              {shipment.estimatedDelivery && (
                <div className="flex items-start gap-2.5">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0" style={{ color: primary }} />
                  <div>
                    <dt className="text-slate-400">Estimated delivery</dt>
                    <dd className="font-medium text-slate-700">
                      {formatDate(shipment.estimatedDelivery)}
                    </dd>
                  </div>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card sm:p-6 lg:col-span-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold" style={{ color: courier.theme.text }}>
            Delivery Status
          </h2>
          <PackageCheck className="h-6 w-6" style={{ color: courier.theme.secondary }} />
        </div>

        <div
          className="mt-4 rounded-xl px-4 py-3"
          style={{ backgroundColor: courier.theme.light }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: primary }}
          >
            Current status
          </p>
          <p
            className="mt-0.5 flex items-center gap-2 text-lg font-bold"
            style={{ color: courier.theme.text }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span
                className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                style={{ backgroundColor: courier.theme.secondary }}
              />
              <span
                className="relative inline-flex h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: primary }}
              />
            </span>
            {shipment.statusLabel}
          </p>
        </div>

        {/* Timeline */}
        <ol className="mt-6 space-y-0">
          {steps.map((step, i) => {
            const isDone = i < currentIndex;
            const isCurrent = i === currentIndex;
            return (
              <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
                {i !== steps.length - 1 && (
                  <span
                    className="absolute left-[13px] top-7 h-full w-0.5"
                    style={{
                      backgroundColor: isDone ? courier.theme.light : "#e2e8f0",
                    }}
                  />
                )}
                <span className="relative z-10 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center">
                  {isDone ? (
                    <CheckCircle2 className="h-7 w-7" style={{ color: primary }} />
                  ) : isCurrent ? (
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-white ring-4"
                      style={{
                        backgroundColor: primary,
                        borderColor: courier.theme.secondary,
                      }}
                    >
                      <span className="h-2 w-2 animate-pulse-dot rounded-full bg-white" />
                    </span>
                  ) : (
                    <Circle className="h-7 w-7 text-slate-300" />
                  )}
                </span>
                <div className="pt-0.5">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      color: isCurrent
                        ? courier.theme.text
                        : isDone
                          ? "#334155"
                          : "#94a3b8",
                    }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p className="mt-0.5 text-xs text-slate-400">
                      Updated {formatDateTime(shipment.updatedAt)}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        {/* Destination */}
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Shipping to
          </p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-700">
            {destination || "Address not provided"}
          </p>
        </div>

        {/* Contact CTA */}
        <a href={mailto} className="c-btn mt-6 w-full">
          <Headset className="h-5 w-5" />
          {settings.contactCtaText}
        </a>
      </div>
    </div>
  );
}