import React from "react";

export interface ToggleProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  /** On/off state. Maps to Figma `State` = On/Off. */
  checked: boolean;
  /** Called with the next checked value when toggled. */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Generic on/off switch (track + thumb). Styled via DLS Core tokens.
 * Mirrors the Figma "Toggle" component. Renders as a `role="switch"` button;
 * pass a label via `aria-label` / `aria-labelledby`.
 */
export function Toggle({
  checked,
  onCheckedChange,
  className,
  disabled,
  onClick,
  ...rest
}: ToggleProps) {
  const classes = ["dls-toggle", checked && "dls-toggle--on", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={classes}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented) onCheckedChange?.(!checked);
      }}
      {...rest}
    >
      <span className="dls-toggle__thumb" />
    </button>
  );
}
