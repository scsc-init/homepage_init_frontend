import { useEffect, useState } from 'react';
import Image from 'next/image';
import sizeOf from 'image-size';

type ImageWrapperType = {
  src: string;
  alt: string;
};

function ImageWrapper({ src, alt, ...props }: ImageWrapperType) {
  const [imageSourceURI, setImageSourceURI] = useState<string>('/asset/default-pfp.png');
  const [imageDimension, setImageDimension] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    let mimeType: string;

    fetch(src)
      .then((res) => {
        mimeType = res.headers.get('Content-Type') || 'image/png';
        return res.bytes();
      })
      .then((bytes) => {
        const encodedImageData = Buffer.from(bytes).toString('base64');
        setImageSourceURI(`data:${mimeType};base64,${encodedImageData}`);

        const dimension = sizeOf(bytes);
        setImageDimension([dimension.width, dimension.height]);
      });
  }, [src]);

  return (
    <>
      <Image
        width={imageDimension[0]}
        height={imageDimension[1]}
        src={imageSourceURI}
        alt={alt || ''}
        {...props}
      />
    </>
  );
}

export default ImageWrapper;
