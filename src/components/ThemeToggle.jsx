"use client";

import { useEffect, useState } from "react";
import "@/styles/theme.css";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const shouldDark = saved ? saved === "dark" : true;
    document.documentElement.classList.toggle("dark", shouldDark);
    setDark(shouldDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    const html = document.documentElement;
    html.classList.add("theme-animating");
    requestAnimationFrame(() => {
      html.classList.toggle("dark", next);
      setDark(next);
      const dur =
        getComputedStyle(html).getPropertyValue("--theme-anim-duration") ||
        "180ms";
      const ms = parseFloat(dur) || 180;
      setTimeout(() => {
        html.classList.remove("theme-animating");
      }, ms + 50);
    });
  };

  return (
    <button className="ThemeToggle" onClick={toggleTheme}>
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
