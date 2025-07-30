"use client";

import { useState } from "react";
import Arrow from "./Arrow";
import "./faq.css";

export default function FaqList() {
  const faqs = [
    {
      question: "동아리 활동에 어느 정도의 시간을 할애해야 하나요?",
      answer:
        "부담 정도는 개인에 따라 다르게 느껴질 수 있지만, 일주일에 적어도 1~2일은 투자해야 합니다...",
    },
    {
      question: "가입할 수 있는 회원에 제한이 있나요?",
      answer:
        "단과대와 학번에 관계 없이, 컴퓨터 공학과 프로그래밍에 관심이 있는 서울대학교 학생 누구나 참여하실 수 있습니다...",
    },
    {
      question: "코딩을 잘 하지 못하는데 괜찮나요?",
      answer:
        "물론 괜찮습니다. 기초 프로그래밍을 배우는 SIG가 매학기 개설되어 있으므로 끝까지 따라오기만 한다면 충분히 컴퓨터에 익숙해질 수 있습니다.",
    },
  ];

  const [rotated, setRotated] = useState(Array(faqs.length).fill(false));

  const handleToggle = (idx) => {
    setRotated((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div id="HomeFQAContainer">
      <h2>자주 묻는 질문</h2>
      {faqs.map((faq, idx) => (
        <div className="HomeFQA" key={idx}>
          <input
            type="checkbox"
            id={`faq-${idx}`}
            className="HomeFAQToggle"
            onChange={() => handleToggle(idx)}
          />
          <label htmlFor={`faq-${idx}`} className="HomeFQAQuestion">
            <h4>{faq.question}</h4>
            <Arrow
              width="20px"
              height="20px"
              color="#070707"
              rotate={rotated[idx] ? "180deg" : "0deg"}
            />
          </label>
          <div className="HomeFQAHidden">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
