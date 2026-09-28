import type { CSSProperties } from "react";
import type { Courier } from "@/data/couriers";

/**
 * Wraps a courier's themed page and injects the brand palette + font as CSS
 * variables consumed by the `.c-btn` / `.c-input` helper classes.
 */
export function CourierTheme({
  courier,
  children,
}: {
  courier: Courier;
  children: React.ReactNode;
}) {
  const style = {
    "--c-primary": courier.theme.primary,
    "--c-primary-dark": courier.theme.primaryDark,
    "--c-secondary": courier.theme.secondary,
    "--c-dark": courier.theme.dark,
    "--c-light": courier.theme.light,
    "--c-text": courier.theme.text,
    "--c-on-primary": courier.theme.onPrimary,
    fontFamily: courier.theme.font,
    color: courier.theme.text,
  } as CSSProperties;

  return <div style={style}>{children}</div>;
}