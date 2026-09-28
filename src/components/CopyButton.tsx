'use client';
import styles from './CopyButton.module.css';

type CopyButtonProps = {
  link: string;
  label?: string;
};

export default function CopyButton({ link, label = '복사' }: CopyButtonProps) {
  const handleClick = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link).catch((err) => {
        console.error('Clipboard copy failed:', err);
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={styles['invite-link-copy']}
      aria-label="내용 복사"
    >
      <span className={styles.icon} aria-hidden="true">
        📋
      </span>
      <span className={styles.text}>{label}</span>
    </button>
  );
}
