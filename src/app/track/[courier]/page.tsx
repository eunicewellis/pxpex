import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, SearchX } from "lucide-react";
import { getCourier } from "@/data/couriers";
import { CourierTheme } from "@/components/tracking/CourierTheme";
import { CourierLogo } from "@/components/shared/CourierLogo";
import { CourierTrackForm } from "@/components/tracking/CourierTrackForm";
import { CourierTrackResult } from "@/components/tracking/CourierTrackResult";
import { getShipments, getSettings } from "@/lib/store";
import { normalizeTrackingNumber } from "@/lib/tracking";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { courier: string };
}): Promise<Metadata> {
  const courier = getCourier(params.courier);
  if (!courier) return { title: "Track Shipment" };
  return {
    title: `${courier.name} Tracking`,
    description: `Track your ${courier.fullName} package using your tracking number.`,
  };
}

export default async function CourierTrackPage({
  params,
  searchParams,
}: {
  params: { courier: string };
  searchParams: { number?: string };
}) {
  const courier = getCourier(params.courier);
  if (!courier) notFound();

  const settings = await getSettings();
  const number = normalizeTrackingNumber(searchParams.number ?? "");

  let shipment = null;
  if (number) {
    const shipments = await getShipments();
    shipment =
      shipments.find(
        (s) =>
          normalizeTrackingNumber(s.trackingNumber) === number &&
          s.courier === courier.id
      ) ?? null;
  }

  return (
    <CourierTheme courier={courier}>
      <div
        className="flex min-h-screen flex-col"
        style={{ backgroundColor: courier.theme.light }}
      >
        {/* Themed header */}
        <header style={{ backgroundColor: courier.theme.dark }}>
          <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-lg bg-white px-2">
                <CourierLogo courier={courier} className="h-7 max-w-full" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="truncate font-bold" style={{ color: courier.theme.onPrimary }}>
                  {courier.name} Tracking
                </p>
                <p
                  className="truncate text-xs opacity-80"
                  style={{ color: courier.theme.onPrimary }}
                >
                  {courier.tagline}
                </p>
              </div>
            </div>
            <Link
              href="/track"
              className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-white/10"
              style={{ color: courier.theme.onPrimary }}
            >
              <ChevronLeft className="h-4 w-4" />
              All carriers
            </Link>
          </div>
        </header>
        {/* Hero with tracking form */}
        <section
          style={{
            background: `linear-gradient(135deg, ${courier.theme.dark} 0%, ${courier.theme.primary} 100%)`,
          }}
        >
          <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 sm:py-16">
            <h1
              className="text-center text-3xl font-black sm:text-4xl"
              style={{ color: courier.theme.onPrimary }}
            >
              Track your {courier.name} package
            </h1>
            <p
              className="mt-3 text-center text-base"
              style={{ color: courier.theme.onPrimary, opacity: 0.9 }}
            >
              Enter your tracking number below to see the latest status and delivery details.
            </p>
            <div className="mx-auto mt-8 rounded-2xl bg-white p-3 shadow-card-lg">
              <CourierTrackForm courier={courier} />
            </div>
          </div>
        </section>

        {/* Result / not found */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">
          {shipment ? (
            <CourierTrackResult
              shipment={shipment}
              courier={courier}
              settings={settings}
            />
          ) : number ? (
            <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-card">
              <span
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
                style={{ backgroundColor: courier.theme.light }}
              >
                <SearchX className="h-7 w-7" style={{ color: courier.theme.primary }} />
              </span>
              <h2 className="mt-4 text-xl font-bold" style={{ color: courier.theme.text }}>
                No {courier.name} shipment found
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                We couldn&apos;t find a {courier.name} shipment with the tracking
                number <span className="font-semibold">{number}</span>. Please
                double-check the number (and that it belongs to {courier.name})
                and try again.
              </p>
              <Link href={`/track/${courier.id}`} className="c-btn mt-6">
                Try another number
              </Link>
            </div>
          ) : null}
        </main>

        {/* Themed footer */}
        <footer style={{ backgroundColor: courier.theme.dark }}>
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs sm:flex-row sm:text-left">
            <p style={{ color: courier.theme.onPrimary, opacity: 0.8 }}>
              © {new Date().getFullYear()} {settings.companyName}. Tracking lookup demo.
            </p>
            <Link
              href="/track"
              className="font-semibold hover:underline"
              style={{ color: courier.theme.onPrimary }}
            >
              Choose a different carrier
            </Link>
          </div>
        </footer>
      </div>
    </CourierTheme>
  );
}