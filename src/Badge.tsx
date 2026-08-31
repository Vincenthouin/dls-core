import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Small static pill/tag (e.g. a "search" marker). Styled via DLS Core tokens
 * (import "dls-core/components.css"). Mirrors the Figma "Badge" component.
 */
export function Badge({ className, children, ...rest }: BadgeProps) {
  return (
    <span className={["dls-badge", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}
