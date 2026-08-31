import React from "react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Interaction state. Maps to Figma `State` variant. `copied` = confirmation
   *  (accent border + text); the transient timing/label swap stays in the app. */
  state?: "default" | "copied";
}

/**
 * Interactive pill (e.g. a copyable bonus platform). Styled via DLS Core tokens.
 * Mirrors the Figma "Chip" component (State Default/Copied).
 */
export function Chip({ state = "default", className, children, ...rest }: ChipProps) {
  const classes = ["dls-chip", state === "copied" && "dls-chip--copied", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}
