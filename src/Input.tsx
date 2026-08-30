import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Target platform. Maps to Figma `Platform` variant. `mobile` bumps the font
   *  to 16px to prevent the iOS zoom-on-focus. */
  platform?: "desktop" | "mobile";
  /** Error state. Maps to Figma `State` = Error (red border/background). */
  invalid?: boolean;
}

/**
 * Generic single-line text field. Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Input" component.
 *
 * App-specific chrome (rotating placeholder, clear button, paste-on-tap) stays
 * in the consuming app — this is only the field itself.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { platform = "desktop", invalid = false, className, type = "text", ...rest },
  ref,
) {
  const classes = [
    "dls-input",
    `dls-input--${platform}`,
    invalid && "dls-input--invalid",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return <input ref={ref} type={type} className={classes} aria-invalid={invalid || undefined} {...rest} />;
});
