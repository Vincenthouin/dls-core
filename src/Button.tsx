import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Maps to Figma `Style` variant. */
  variant?: "primary" | "secondary";
  /** Target platform (height). Maps to Figma `Platform` variant. */
  platform?: "desktop" | "mobile";
  /** Interaction state. Maps to Figma `State` variant. `success` = confirmation
   *  (e.g. copied); `disabled` also sets the disabled attribute. The transient
   *  timing and label swap stay in the consuming app. */
  state?: "default" | "success" | "disabled";
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
  state = "default",
  icon,
  children,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || state === "disabled";
  const classes = [
    "dls-btn",
    `dls-btn--${variant}`,
    `dls-btn--${platform}`,
    state === "success" && "dls-btn--success",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} disabled={isDisabled} {...rest}>
      {icon ? <span className="dls-btn__icon">{icon}</span> : null}
      {children}
    </button>
  );
}
