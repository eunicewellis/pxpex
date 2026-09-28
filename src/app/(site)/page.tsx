import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Services } from "@/components/home/Services";
import { Process } from "@/components/home/Process";
import { Features } from "@/components/home/Features";
import { Testimonials } from "@/components/home/Testimonials";
import { CTABanner } from "@/components/home/CTABanner";
import { CourierSelector } from "@/components/tracking/CourierSelector";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { getSettings } from "@/lib/store";

export default async function HomePage() {
  const settings = await getSettings();
  return (
    <>
      <Hero />
      <Stats />
      <section className="container-site py-16 sm:py-20">
        <SectionHeading
          eyebrow="Track a package"
          title="Choose your delivery service"
          subtitle="Select the carrier handling your shipment to open their tracking page."
        />
        <div className="mt-10">
          <CourierSelector />
        </div>
      </section>
      <Services />
      <Process />
      <Features />
      <Testimonials />
      <CTABanner settings={settings} />
    </>
  );
}
