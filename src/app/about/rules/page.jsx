"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./page.css";

export default function RegulationPage() {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    // 회칙.md의 GitHub Raw 주소
    const mdURL =
      "https://raw.githubusercontent.com/scsc-init/homepage_init/master/%ED%9A%8C%EC%B9%99.md";

    fetch(mdURL)
      .then((res) => res.text())
      .then((text) => setMarkdown(text));

    // 페이드 애니메이션
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const fadeElements = document.querySelectorAll(".FadeOnScroll");
    fadeElements.forEach((el) => observer.observe(el));
    return () => fadeElements.forEach((el) => observer.unobserve(el));
  }, []);

  return (
    <div id="Home">
      <div id="HomeContent">
        <div id="RegulationContainer" className="FadeOnScroll">
          <h2>SCSC 회칙</h2>
          <p className="RegulationIntro">
            SCSC 동아리의 운영과 규칙을 안내합니다.
          </p>
          <div className="RegulationItem">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
