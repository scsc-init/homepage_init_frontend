import { forwardRef, type ComponentPropsWithoutRef } from 'react';

type MainLogoImageProps = ComponentPropsWithoutRef<'img'> & {
  wrapperClassName?: string;
};

export const MainLogoImage = forwardRef<HTMLImageElement, MainLogoImageProps>(
  function MainLogoImage(
    { className = '', wrapperClassName = '', alt = 'Main Logo', ...imgProps },
    ref,
  ) {
    return (
      <picture className={wrapperClassName}>
        <source srcSet="/main/main-logo.avif" type="image/avif" />
        <img
          ref={ref}
          src="/main/main-logo.png"
          alt={alt}
          className={className}
          {...imgProps}
        />
      </picture>
    );
  },
);
