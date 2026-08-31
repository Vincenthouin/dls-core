import React from "react";

export interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the diameter (px or any CSS length). Defaults to the `--loader-size`
   *  token (20px). The border thickness stays token-driven. */
  size?: number | string;
}

/**
 * Indeterminate loading spinner. Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Loader" component —
 * a ring (`--loader-track`) with a spinning indicator arc (`--loader-indicator`).
 */
export function Loader({ size, className, style, ...rest }: LoaderProps) {
  const classes = ["dls-loader", className].filter(Boolean).join(" ");
  const dim = size == null ? undefined : typeof size === "number" ? `${size}px` : size;
  return (
    <div
      role="status"
      aria-label="Loading"
      className={classes}
      style={dim ? { width: dim, height: dim, ...style } : style}
      {...rest}
    />
  );
}
