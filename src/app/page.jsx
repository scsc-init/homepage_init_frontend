import Image from "next/image";
import "./page.css";
export default function HomePage() {
  return (
    <main className="main-wrapper">
      {/* Overlay 로고 (배경) */}
      <div className="overlay-container">
        <img
          src="/main/logo-overlay-left.png"
          alt="Overlay Left"
          className="overlay-image left logo"
        />
        <img
          src="/main/logo-overlay-right.png"
          alt="Overlay Right"
          className="overlay-image right logo"
        />
      </div>

      {/* 메인 로고 */}
      <div className="main-logo-wrapper">
        <img
          src="/main/main-logo.png"
          alt="Main Logo"
          className="main-logo logo"
        />
        <div className="main-subtitle">
          Seoul National University Computer Study Club
        </div>
      </div>

      {/* 학교 로고
      <div className="school-logo">
        <img src="/main/school.png" alt="SNU Logo" />
      </div> */}
    </main>
  );
}
