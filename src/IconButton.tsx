import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Corner shape. Maps to Figma `Shape` variant. */
  shape?: "square" | "round";
  /** Standalone control sizing. Maps to Figma Icon button `Platform` variant
   *  (desktop 44 / mobile 48, aligned on the Input/Button height). Takes
   *  precedence over `size` when set — prefer it for standalone buttons. */
  platform?: "desktop" | "mobile";
  /** Compact sizing for embedded icons (xs 24 / s 32 / m 40). Used only when
   *  `platform` is not set — e.g. a row action (Figma List item `action` = 24
   *  desktop / 32 mobile). */
  size?: "xs" | "s" | "m";
  /** Toggled/pressed look (e.g. an open settings panel). Maps to Figma
   *  `State` = Active/Selected. Also reflected as `aria-pressed`. */
  active?: boolean;
}

/**
 * Generic icon-only button. Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Icon button" component.
 * Pass the icon as children and always provide an `aria-label`.
 */
export function IconButton({
  shape = "square",
  platform,
  size,
  active = false,
  className,
  children,
  ...rest
}: IconButtonProps) {
  // `platform` (44/48, Figma-aligned) wins ; otherwise fall back to the legacy
  // `size` scale (default m).
  const sizing = platform ? `dls-icon-btn--${platform}` : `dls-icon-btn--${size ?? "m"}`;
  const classes = [
    "dls-icon-btn",
    `dls-icon-btn--${shape}`,
    sizing,
    active && "dls-icon-btn--active",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" aria-pressed={active || undefined} className={classes} {...rest}>
      {children}
    </button>
  );
}
