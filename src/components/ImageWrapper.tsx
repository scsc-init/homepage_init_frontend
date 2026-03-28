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
    if (src.startsWith('data')) {
      const buffer = Buffer.from(src.split(',')[1], 'base64');
      const dimension = sizeOf(buffer);
      setImageDimension([dimension.width, dimension.height]);
      setImageSourceURI(src);
    } else {
      fetch(src)
        .then((res) => res.blob())
        .then((blob) => {
          setImageSourceURI(URL.createObjectURL(blob));

          blob.bytes().then((bytes) => {
            const dimension = sizeOf(bytes);
            setImageDimension([dimension.width, dimension.height]);
          });
        });
    }
  }, [src]);

  return (
    <Image
      width={imageDimension[0]}
      height={imageDimension[1]}
      src={imageSourceURI}
      alt={alt || ''}
      {...props}
    />
  );
}

export default ImageWrapper;
