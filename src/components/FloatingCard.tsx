import joinClassName from "@/util/joinClassName";
import React from "react";
import "./FloatingCard.css";

type FloatingCardProps = React.ComponentPropsWithoutRef<"div">;

const FloatingCard = React.forwardRef<HTMLDivElement, FloatingCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={joinClassName(className, "C_FloatingCard")}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FloatingCard.displayName = "FloatingCard";

export default FloatingCard;
