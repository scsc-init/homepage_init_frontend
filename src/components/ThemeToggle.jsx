"use client";

import { useEffect, useState } from "react";
import "@/styles/theme.css";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = dark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", !dark);
    setDark(!dark);
  };

  return (
    <button className="ThemeToggle" onClick={toggleTheme}>
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
