"use client";

import joinClassName from "@/util/joinClassName";
import "./Button.css";

export const Root = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & React.ComponentProps<"button">) => {
  return (
    <button className={joinClassName("C_ButtonRoot", className)} {...props}>
      {children}
    </button>
  );
};
