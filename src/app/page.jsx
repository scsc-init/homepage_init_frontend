import Image from "next/image";
import "./page.css";

export default function Home() {
  const year = new Date().getFullYear() - 1984;

  return (
    <div id="Home">
      <div id="HomeImageContainer">
        {/* eslint-disable-next-line react/jsx-no-comment-textnodes */}
        <h3
          className="TypingCode"
          style={{
            width: "20ch",
            animation:
              "typing 3s steps(20, end) forwards, blink 0.75s step-end infinite",
          }}
        >
          {"// Welcome to SCSC"}
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
