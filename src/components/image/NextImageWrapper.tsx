import Image from 'next/image';

import './NextImageWrapper.css';

interface HrefType {
  src: string;
  alt: string;
}
export default function NextImageWrapper({ src, alt }: HrefType) {
  return (
    <div className="image-wrapper">
      <div className="img-container">
        <Image src={src} alt={alt} fill={true}></Image>
      </div>
    </div>
  );
}
