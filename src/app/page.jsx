import './page.css';
import { MainLogo } from './checkInAppBrowser';
import RefreshJWTClient from './RefreshJWTClient';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="main-wrapper">
      {/* Overlay 로고 (배경) */}
      <div className="overlay-container">
        <Image
          src="/main/logo-overlay-left.png"
          alt="Overlay Left"
          className="overlay-image left logo"
          width={1490}
          height={1094}
        />
        <Image
          src="/main/logo-overlay-right.png"
          alt="Overlay Right"
          className="overlay-image right logo"
          width={1454}
          height={1094}
        />
      </div>
      <RefreshJWTClient />

      {/* 메인 로고 */}
      {/* <div className="main-logo-wrapper">
        <img
          src="/main/main-logo.png"
          alt="Main Logo"
          className="main-logo logo"
        />
        <div className="main-subtitle">
          Seoul National University Computer Study Club
        </div>
      </div> */}
      <MainLogo />
    </main>
  );
}
