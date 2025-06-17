"use client";

import joinClassName from "@/util/joinClassName";
import * as Select from "@radix-ui/react-select";
import React, { ForwardedRef } from "react";
import ExtractProps from "@/util/extractProps";
import "./Select.css";
import _ from "./FloatingCard"; // DO NOT REMOVE UNLESS NECESSARY

export const Root = Select.Root;

const UpIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 15l6-6l6 6"
      />
    </svg>
  );
};

const DownIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m6 9l6 6l6-6"
      />
    </svg>
  );
};

const CheckIcon = () => {
  return (
    <svg
      className="C_SelectCheckIcon"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m5 12l5 5L20 7"
      />
    </svg>
  );
};

export const Label = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
} & React.ComponentProps<"label">) => {
  return (
    <label className={joinClassName("C_SelectLabel", className)} {...props}>
      {children}
    </label>
  );
};

export const Trigger = React.forwardRef(
  (
    { className, children, ...props }: ExtractProps<typeof Select.Trigger>,
    ref: React.LegacyRef<HTMLButtonElement>,
  ) => (
    <Select.Trigger
      className={joinClassName("C_SelectTrigger", className)}
      ref={ref}
      {...props}
    >
      {children}
      <Icon>
        <DownIcon />
      </Icon>
    </Select.Trigger>
  ),
);
Trigger.displayName = "Select.Trigger";

export const Value = ({
  className,
  ...props
}: ExtractProps<typeof Select.Value>) => (
  <Select.Value
    className={joinClassName("C_SelectValue", className)}
    {...props}
  />
);

export const Icon = ({
  className,
  ...props
}: ExtractProps<typeof Select.Icon>) => (
  <Select.Icon
    className={joinClassName("C_SelectIcon", className)}
    {...props}
  />
);

export const Portal = ({
  className,
  children,
  ...props
}: {
  className?: string;
} & ExtractProps<typeof Select.Portal>) => (
  <Select.Portal {...props}>
    <Content>
      <ScrollUpButton>
        <UpIcon />
      </ScrollUpButton>
      <Viewport>{children}</Viewport>
      <ScrollDownButton>
        <DownIcon />
      </ScrollDownButton>
    </Content>
  </Select.Portal>
);

const Content = ({
  className,
  ...props
}: ExtractProps<typeof Select.Content>) => (
  <Select.Content
    className={joinClassName("C_SelectContent", className)}
    {...props}
  />
);

const ScrollUpButton = ({
  className,
  ...props
}: ExtractProps<typeof Select.ScrollUpButton>) => (
  <Select.ScrollUpButton
    className={joinClassName("C_SelectScrollUpButton", className)}
    {...props}
  />
);

const ScrollDownButton = ({
  className,
  ...props
}: ExtractProps<typeof Select.ScrollDownButton>) => (
  <Select.ScrollDownButton
    className={joinClassName("C_SelectScrollDownButton", className)}
    {...props}
  />
);

const Viewport = ({
  className,
  ...props
}: ExtractProps<typeof Select.Viewport>) => (
  <Select.Viewport
    className={joinClassName("C_FloatingCard C_SelectViewport", className)} // Kind of a hack, but it works.
    {...props}
  />
);

export const Item = React.forwardRef(
  (
    { children, className, ...props }: ExtractProps<typeof Select.Item>,
    forwardedRef: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <Select.Item
        className={joinClassName("C_SelectItem", className)}
        ref={forwardedRef}
        {...props}
      >
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator>
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);
Item.displayName = "Select.Item";

export const GroupLabel = ({
  className,
  ...props
}: ExtractProps<typeof Select.Label>) => (
  <Select.Label
    className={joinClassName("C_SelectGroupLabel", className)}
    {...props}
  />
);

export const Group = ({
  className,
  ...props
}: ExtractProps<typeof Select.Group>) => (
  <Select.Group
    className={joinClassName("C_SelectGroup", className)}
    {...props}
  />
);

export const Separator = ({
  className,
  ...props
}: ExtractProps<typeof Select.Separator>) => (
  <Select.Separator
    className={joinClassName("C_SelectSeparator", className)}
    {...props}
  />
);
