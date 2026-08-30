import React from "react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Semantic tone. Maps to Figma `Tone` variant. */
  tone?: "danger" | "success";
}

/**
 * Inline message / banner. Styled via DLS Core tokens.
 * Mirrors the Figma "Alert" component (Tone Danger/Success).
 */
export function Alert({ tone = "danger", children, className, ...rest }: AlertProps) {
  const classes = ["dls-alert", `dls-alert--${tone}`, className].filter(Boolean).join(" ");
  return (
    <div role="alert" className={classes} {...rest}>
      {children}
    </div>
  );
}
