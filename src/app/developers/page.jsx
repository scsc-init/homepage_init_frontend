"use client";

import React from "react";
import Image from "next/image";
import "./page.css";

const executives = [
  {
    name: "강명석",
    role: "대장",
    image: "/img1.jpg",
    description: "그는 신입니다",
  },
  {
    name: "이한경",
    role: "백엔드",
    image: "/img2.jpg",
    description: "한경님의 백엔드 너무 좋아앗",
  },
  {
    name: "박성현",
    role: "Admin",
    image: "/img3.jpg",
    description: "도무지 더 수정할 시간이 없으니 여기서 제출하겠습니다",
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
