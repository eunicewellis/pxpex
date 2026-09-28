"use client";

import { useState } from "react";
import type { Courier } from "@/data/couriers";
import { cn } from "@/lib/utils";

/**
 * Renders an admin-supplied logo image for a courier, falling back to a styled
 * text wordmark (brand color + font) when the image is missing or fails to load.
 */
export function CourierLogo({
  courier,
  className,
  textClassName,
}: {
  courier: Courier;
  className?: string;
  textClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className={cn(
          "font-black leading-none tracking-tight",
          textClassName
        )}
        style={{ color: courier.theme.primary, fontFamily: courier.theme.font }}
      >
        {courier.theme.logoText}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={courier.logoPath}
      alt={courier.name}
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
    />
  );
}