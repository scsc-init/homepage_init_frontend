"use client";

import React from "react";
import Image from "next/image";
import "./page.css";

const executives = [
  {
    name: "강명석",
    role: "대장",
    image: "/img1.jpg",
    description: "init 정상화해줬잖아 기능정의도해줬잖아 그냥 다해줬잖아",
  },
  {
    name: "이한경",
    role: "백엔드",
    image: "/img2.jpg",
    description: "한경님의 백엔드 너무 좋아앗",
  },
  {
    name: "박성현",
    role: "프론트",
    image: "/img3.jpg",
    description: "카와이한 여고생쨩",
  },
  {
    name: "황민기",
    role: "봇이지뭐",
    image: "/img4.jpg",
    description: "커밋주작은뭐야",
  },
  {
    name: "김재희",
    role: "백엔드?",
    image: "/img5.jpg",
    description: "분명 프론트 대신 해줄줄 알았는데",
  },
  {
    name: "윤영우",
    role: "백엔드",
    image: "/img6.jpg",
    description: "고능",
  },
];

export default function ExecutivesPage() {
  return (
    <div id="ExecutivePage">
      <h2>개발자 소개</h2>
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
