// @/components/LoadingSpinner.jsx

"use client";

import { useEffect, useState } from "react";

export default function LoadingSpinner() {
  const [sampleCode] = useState(() => {
    const random_index = Math.floor(Math.random() * codes.length);
    return codes[random_index];
  });

  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setDisplayed((prev) => {
        const next = sampleCode.slice(0, i++);
        if (i > sampleCode.length) clearInterval(typing);
        return next;
      });
    }, 30);

    return () => clearInterval(typing);
  }, [sampleCode]);

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorBlink);
  }, []);

  return (
    <div className="LoadingCodeWrapper">
      <pre
        className="LoadingCodeBlock"
        dangerouslySetInnerHTML={{
          __html:
            displayed + `<span class="Cursor">${showCursor ? "|" : " "}</span>`,
        }}
      ></pre>
      <p className="LoadingText">Compiling...</p>
    </div>
  );
}
