"use client";

import { useEffect } from "react";
import "./page.css";

export default function RegulationPage() {
  useEffect(() => {
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

  const regulations = [
    "부원을 만나면 '응애'라고 한다.",
    "근데 이 동아리에 규칙이 있나요",
    "쌀먹이 동아리의 새로운 질서",
  ];

  return (
    <div id="Home">
      <div id="HomeContent">
        <div id="RegulationContainer" className="FadeOnScroll">
          <h2>SCSC 회칙</h2>
          <p className="RegulationIntro">
            SCSC 동아리의 운영과 규칙을 안내합니다.
          </p>
          {regulations.map((content, index) => (
            <div key={index} className="RegulationItem">
              <h3>제{index + 1}조</h3>
              <p>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
