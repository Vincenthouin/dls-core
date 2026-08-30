import React from "react";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Corner shape. Maps to Figma `Shape` variant. */
  shape?: "square" | "round";
  /** Control size. Maps to Figma `Size` variant. */
  size?: "s" | "m";
  /** Toggled/pressed look (e.g. an open settings panel). Maps to Figma
   *  `State` = Active. Also reflected as `aria-pressed`. */
  active?: boolean;
}

/**
 * Generic icon-only button. Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Icon button" component.
 * Pass the icon as children and always provide an `aria-label`.
 */
export function IconButton({
  shape = "square",
  size = "m",
  active = false,
  className,
  children,
  ...rest
}: IconButtonProps) {
  const classes = [
    "dls-icon-btn",
    `dls-icon-btn--${shape}`,
    `dls-icon-btn--${size}`,
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
