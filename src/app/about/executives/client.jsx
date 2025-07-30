"use client";

import Image from "next/image";
import { useSwipeable } from "react-swipeable";
import { useEffect, useRef, useState, useMemo } from "react";

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
    image: "/img7.jpg",
    description: "기 습 숭 배",
  },
  {
    name: "오현우",
    role: "Admin",
    image: "/img8.jpg",
    description: "파이어펀치! 파이어펀치!",
  },
  {
    name: "한지후",
    role: "Admin",
    image: "/img9.jpg",
    description: "물감비",
  },
  {
    name: "허유민",
    role: "Admin",
    image: "/img10.jpg",
    description: "goat",
  },
  {
    name: "박상혁",
    role: "Admin",
    image: "/img11.jpg",
    description: "잘생김",
  },
  {
    name: "이태윤",
    role: "Admin",
    image: "/img12.jpg",
    description: "JOAT",
  },
  {
    name: "강명석",
    role: "Admin",
    image: "/img13.jpg",
    description: "그 분",
  },
];

export default function ExecutivesClient() {
  const [centerIndex, setCenterIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const total = executives.length;
  const autoRef = useRef();

  const prev = () => {
    setCenterIndex((prev) => (prev - 1 + total) % total);
  };

  const next = () => {
    setCenterIndex((prev) => (prev + 1) % total);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!hovered && !isMobile) {
      autoRef.current = setInterval(() => {
        next();
      }, 4000);
    }
    return () => clearInterval(autoRef.current);
  }, [hovered, isMobile]);

  const handlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  const positionClass = (idx) => {
    const offset = (idx - centerIndex + total) % total;
    if (offset === 0) return "center";
    if (offset === 1 || offset === -total + 1) return "right-1";
    if (offset === 2 || offset === -total + 2) return "right-2";
    if (offset === total - 1) return "left-1";
    if (offset === total - 2) return "left-2";
    return "hidden";
  };

  if (isMobile) {
    return (
      <div className="ExecutiveMasonry">
        {executives.map((person, i) => (
          <div className="ExecutiveCard" key={i}>
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
    );
  }

  return (
    <div
      className="ExecutiveCarouselWrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...handlers}
    >
      {/*<button className="ExecutiveArrow left" onClick={prev}>
        ◀
      </button>*/}
      <div className="ExecutiveCarouselCentered">
        {executives.map((person, idx) => (
          <div
            className={`ExecutiveCard ${positionClass(idx)}`}
            key={idx}
            style={{
              transition: "transform 0.6s ease, opacity 0.6s ease",
            }}
          >
            <div className="ExecutiveImageWrapper">
              <Image
                src={person.image}
                alt={person.name}
                fill
                className="ExecutiveImage"
              />
            </div>
            <h3>{person.name}</h3>
            <p className="ExecutiveRole">{person.role}</p>
            {person.phone && <p className="ExecutivePhone">{person.phone}</p>}
          </div>
        ))}
      </div>
      {/*<button className="ExecutiveArrow right" onClick={next}>
        ▶
      </button>*/}
      <div className="ExecutiveDots">
        {executives.map((_, i) => (
          <div
            key={i}
            className={`ExecutiveDot ${i === centerIndex ? "active" : ""}`}
            onClick={() => setCenterIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
