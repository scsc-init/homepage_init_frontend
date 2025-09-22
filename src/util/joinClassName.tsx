export default function joinClassName(...classNames: (string | undefined)[]) {
  return classNames.filter(Boolean).join(' ');
}
