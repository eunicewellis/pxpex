import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { COURIERS } from "@/data/couriers";
import { CourierLogo } from "@/components/shared/CourierLogo";

/**
 * The "select your carrier" step on the public site. Each card links to the
 * courier's own themed tracking page at /track/[courier].
 */
export function CourierSelector() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {COURIERS.map((courier) => (
        <Link
          key={courier.id}
          href={`/track/${courier.id}`}
          className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-card-lg"
        >
          <div className="flex h-14 items-center">
            <CourierLogo courier={courier} className="h-10 max-w-[7rem]" />
          </div>
          <h3 className="mt-4 font-display text-base font-bold text-brand-900">
            {courier.name}
          </h3>
          <p className="mt-1 flex-1 text-sm text-slate-500">{courier.fullName}</p>
          <span
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold"
            style={{ color: courier.theme.primary }}
          >
            Track with {courier.name}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      ))}
    </div>
  );
}