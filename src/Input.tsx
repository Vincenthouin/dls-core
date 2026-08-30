import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Target platform. Maps to Figma `Platform` variant. `mobile` bumps the font
   *  to 16px to prevent the iOS zoom-on-focus. */
  platform?: "desktop" | "mobile";
}

/**
 * Generic single-line text field. Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Input" component.
 *
 * By design the field has no error state: validation errors are surfaced with
 * an `<Alert tone="danger">` below the field, not by recoloring the input.
 * App-specific chrome (rotating placeholder, clear button, paste-on-tap) also
 * stays in the consuming app — this is only the field itself.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { platform = "desktop", className, type = "text", ...rest },
  ref,
) {
  const classes = ["dls-input", `dls-input--${platform}`, className].filter(Boolean).join(" ");
  return <input ref={ref} type={type} className={classes} {...rest} />;
});
