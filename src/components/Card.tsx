import joinClassName from "@/util/joinClassName";
import React from "react";
import "./Card.css";

export default function Card({
  className,
  children,
  hoverGlow = false,
  ...props
}: React.ComponentProps<"div"> & {
  hoverGlow?: boolean;
}) {
  return (
    <div
      className={joinClassName(
        "C_Card",
        hoverGlow ? "hover" : undefined,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
