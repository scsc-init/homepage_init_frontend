import type { ComponentProps } from 'react';

type MainLogoImageProps = ComponentProps<'img'> & {
  wrapperClassName?: string;
};

export function MainLogoImage({
  className = '',
  wrapperClassName = '',
  alt = 'Main Logo',
  ...imgProps
}: MainLogoImageProps) {
  return (
    <picture className={wrapperClassName}>
      <source srcSet="/main/main-logo.avif" type="image/avif" />
      <img src="/main/main-logo.png" alt={alt} className={className} {...imgProps} />
    </picture>
  );
}
