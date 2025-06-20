//게시판 전체의 input을 담당하므로, 없애기 어려울 것 같습니다.

"use client";

import "./Input.css";
import React from "react";
import joinClassName from "@/util/joinClassName";

export const Root = React.forwardRef<
  HTMLDivElement,
  {
    className?: string;
    children?: React.ReactNode;
  } & React.ComponentProps<"div">
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={joinClassName("C_InputRoot", className)}
      {...props}
    >
      {children}
    </div>
  );
});
Root.displayName = "Input.Root";

export const Label = React.forwardRef<
  HTMLLabelElement,
  {
    className?: string;
    children?: React.ReactNode;
  } & React.ComponentPropsWithoutRef<"label">
>(({ className, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={joinClassName("C_InputLabel", className)}
      {...props}
    >
      {children}
    </label>
  );
});
Label.displayName = "Input.Label";

export const Input = React.forwardRef<
  HTMLInputElement,
  {
    className?: string;
    children?: React.ReactNode;
  } & React.ComponentPropsWithoutRef<"input">
>(({ className, children, ...props }, ref) => {
  return (
    <input ref={ref} className={joinClassName("C_Input", className)} {...props}>
      {children}
    </input>
  );
});
Input.displayName = "Input.Input";
