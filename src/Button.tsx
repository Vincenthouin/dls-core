import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to Figma `Style` variant. */
  variant?: "primary" | "secondary";
  /** Target platform (height). Maps to Figma `Platform` variant. */
  platform?: "desktop" | "mobile";
  /** Optional leading icon. Maps to Figma `Show icon` + `Icon`. */
  icon?: React.ReactNode;
}

/**
 * Generic button. Styled via DLS Core tokens (import "dls-core/components.css").
 * Mirrors the Figma "Button" component (Style × Platform + optional icon).
 */
export function Button({
  variant = "primary",
  platform = "desktop",
  icon,
  children,
  className,
  ...rest
}: ButtonProps) {
  const classes = ["dls-btn", `dls-btn--${variant}`, `dls-btn--${platform}`, className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...rest}>
      {icon ? <span className="dls-btn__icon">{icon}</span> : null}
      {children}
    </button>
  );
}
