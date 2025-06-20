"use client";

import joinClassName from "@/util/joinClassName";
import "./Button.css";

const Root = ({ className = "", children, ...props }) => {
  return (
    <button className={joinClassName("C_ButtonRoot", className)} {...props}>
      {children}
    </button>
  );
};

export default Root;
export { Root };
