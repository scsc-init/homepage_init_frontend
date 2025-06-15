"use client";

import React from "react";
import Image from "next/image";
import "./page.css";

const executives = [
  {
    name: "한성재",
    role: "회장",
    image: "/img1.jpg",
    phone: "010-5583-1811",
    description: "그는 신입니다.",
  },
  {
    name: "김지훈",
    role: "부회장",
    image: "/img2.jpg",
    phone: "010-8245-0334",
    description: "그 역시 신입니다.",
  },
  {
    name: "정연호",
    role: "Admin",
    image: "/img3.jpg",
    description: "그 또한 신입니다.",
  },
  {
    name: "김재희",
    role: "Admin",
    image: "/img4.jpg",
    description: "마이 경제입니다.",
  },
  {
    name: "신지환",
    role: "Admin",
    image: "/img5.jpg",
    description: "GOAT",
  },
  {
    name: "신효재",
    role: "Admin",
    image: "/img6.jpg",
    description: "GOAT",
  },
  {
    name: "김건우",
    role: "Admin",
    image: "/img1.jpg",
    description: "기 습 숭 배",
  },
  {
    name: "오현우",
    role: "Admin",
    image: "/img2.jpg",
    description: "파이어펀치! 파이어펀치!",
  },
  {
    name: "한지후",
    role: "Admin",
    image: "/img3.jpg",
    description: "물감비",
  },
  {
    name: "허유민",
    role: "Admin",
    image: "/img4.jpg",
    description: "goat",
  },
  {
    name: "박상혁",
    role: "Admin",
    image: "/img5.jpg",
    description: "잘생김",
  },
  {
    name: "이태윤",
    role: "Admin",
    image: "/img6.jpg",
    description: "JOAT",
  },
  {
    name: "강명석",
    role: "Admin",
    image: "/img1.jpg",
    description: "그 분",
  },
];

export default function ExecutivesPage() {
  return (
    <div id="ExecutivePage">
      <h2>운영진 소개</h2>
      <div className="ExecutiveMasonry">
        {executives.map((person, index) => (
          <div className="ExecutiveCard" key={index}>
            <div className="ExecutiveImageWrapper">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="ExecutiveImage"
              />
              <div className="ExecutiveOverlay">
                <p className="ExecutiveDescription">{person.description}</p>
              </div>
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
            {person.phone && <p className="ExecutivePhone">{person.phone}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
