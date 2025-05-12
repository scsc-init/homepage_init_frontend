import React from "react";
import "./Tag.css";

export default function Tag({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className="C_tag" {...props}>
      {children}
    </div>
  );
}
