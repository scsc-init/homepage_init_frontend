"use client";

import React from "react";
import { useEffect, useRef } from "react";
import "./TextArea.css";

interface TextAreaProps {
  label?: string;
  resizable?: boolean;
}

export default function TextArea({
  label,
  resizable = false,
  //
  className,
  ...props
}: TextAreaProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  let handleRef = useRef<HTMLDivElement>(null);
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!handleRef.current) return;
    if (!textareaRef.current) return;

    let handle = handleRef.current;
    let isDragging = false;

    handle.addEventListener("mousedown", (e) => {
      isDragging = true;
    });

    document.addEventListener("mouseup", (e) => {
      isDragging = false;
    });

    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;

      let textarea = textareaRef.current;
      if (!textarea) return;

      let { top } = textarea.getBoundingClientRect();
      let { clientY } = e;
      let newHeight = clientY - top;
      textarea.style.height = `${newHeight}px`;
    });
  }, [handleRef.current, textareaRef.current]);

  return (
    <div className={`MT-textarea-root ${className || ""}`}>
      {label && <label className="MT-textarea-label"> {label} </label>}
      <textarea
        className={`MT-textarea ${resizable ? "MT-resizable" : ""}`}
        ref={textareaRef}
        wrap="hard"
        {...props}
      />
      {resizable && (
        <div className="MT-textarea-handle" ref={handleRef}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M16.59 5.59L18 7l-6 6l-6-6l1.41-1.41L12 10.17zm0 6L18 13l-6 6l-6-6l1.41-1.41L12 16.17z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
