import './page.css';
import { MainLogo } from './checkInAppBrowser';
import RefreshJWTClient from './RefreshJWTClient';
import CheckUserStatus from '@/components/CheckUserStatus';

export default function HomePage() {
  return (
    <main className="main-wrapper">
      <CheckUserStatus />
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
