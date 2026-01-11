export function MainLogoImage({
  className = '',
  wrapperClassName = '',
  alt = 'Main Logo',
  ...imgProps
}) {
  return (
    <picture className={wrapperClassName}>
      <source srcSet="/main/main-logo.avif" type="image/avif" />
      <img src="/main/main-logo.png" alt={alt} className={className} {...imgProps} />
    </picture>
  );
}
