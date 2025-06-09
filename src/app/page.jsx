"use client";

import Image from "next/image";
import "./page.css";

export default function Home() {
  const year = new Date().getFullYear() - 1984;

  return (
    <div id="Home">
      <div id="HomeImageContainer">
        <h3
          className="TypingCode"
          style={{
            width: "20ch",
            animation:
              "typing 3s steps(20, end) forwards, blink 0.75s step-end infinite",
          }}
        >
          // Welcome to SCSC
        </h3>
        <div className="TitleContainer">
          <h1>Seoul National University</h1>
          <h1>Computer Study Club</h1>
        </div>
        <div className="TitleContainer">
          <h4>개발자로 가는 가장 빠른 첫 걸음,</h4>
          <h4>SCSC는 여러분을 기다리고 있습니다.</h4>
        </div>
      </div>
    </div>
  );
}

function Arrow({
  width = "70px",
  height = "70px",
  rotate = "0deg",
  color = "#a7a7a7",
}) {
  return (
    <svg
      width={width}
      height={height}
      style={{ transform: `rotate(${rotate})` }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"
        fill={color}
      />
    </svg>
  );
}
