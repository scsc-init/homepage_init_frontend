"use client";

import "./Input.css";
import React from "react";
import joinClassName from "@/util/joinClassName";

// Root 컴포넌트
export const Root = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <div
      ref={ref}
      className={joinClassName("C_InputRoot", className)}
      {...rest}
    >
      {children}
    </div>
  );
});
Root.displayName = "Input.Root";

// Label 컴포넌트
export const Label = React.forwardRef((props, ref) => {
  const { className, children, ...rest } = props;
  return (
    <label
      ref={ref}
      className={joinClassName("C_InputLabel", className)}
      {...rest}
    >
      {children}
    </label>
  );
});
Label.displayName = "Input.Label";

// Input 컴포넌트
export const Input = React.forwardRef((props, ref) => {
  const { className, ...rest } = props;
  return (
    <input
      ref={ref}
      className={joinClassName("C_Input", className)}
      {...rest}
    />
  );
});
Input.displayName = "Input.Input";
