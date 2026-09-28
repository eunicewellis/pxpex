import type { Metadata } from "next";
import { PageHero } from "@/components/shared/PageHero";
import { CourierSelector } from "@/components/tracking/CourierSelector";

export const metadata: Metadata = {
  title: "Track Shipment",
  description:
    "Choose a delivery service and track your package in real time using your tracking number.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TrackPage() {
  return (
    <>
      <PageHero
        eyebrow="Shipment tracking"
        title="Choose your delivery service"
        subtitle="Select the carrier that's handling your package, then enter your tracking number on their tracking page."
      />

      <section className="container-site py-14">
        <div className="mx-auto max-w-6xl">
          <CourierSelector />
        </div>
      </section>
    </>
  );
}
