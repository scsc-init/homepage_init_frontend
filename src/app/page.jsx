import './page.css';
import { MainLogo } from './checkInAppBrowser';
import RefreshJWTClient from './RefreshJWTClient';
import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="main-wrapper">
      {/* Overlay 로고 (배경) */}
      <div className="overlay-container">
        <picture>
          <source srcSet="/main/logo-overlay-left.avif" type="image/avif" />
          <Image
            src="/main/logo-overlay-left.png"
            alt="Overlay Left"
            className="overlay-image left logo"
            width={1490}
            height={1094}
            loading="eager"
          />
        </picture>
        <picture>
          <source srcSet="/main/logo-overlay-right.avif" type="image/avif" />
          <Image
            src="/main/logo-overlay-right.png"
            alt="Overlay Right"
            className="overlay-image right logo"
            width={1454}
            height={1094}
            loading="eager"
          />
        </picture>
      </div>
      <RefreshJWTClient />
      <MainLogo />
    </main>
  );
}
