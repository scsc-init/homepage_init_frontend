import joinClassName from "@/util/joinClassName";
import React from "react";
import "./Notice.css";

export const Root = React.forwardRef(
  (
    { children, className, ...props }: React.ComponentProps<"div">,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => (
    <div
      className={joinClassName("C_NoticeRoot", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
Root.displayName = "Notice.Root";

export const Icon = React.forwardRef(
  (
    { children, className, ...props }: React.ComponentProps<"div">,
    ref: React.ForwardedRef<HTMLDivElement>
  ) => (
    <div
      className={joinClassName("C_NoticeIcon", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  )
);
Icon.displayName = "Notice.Icon";
