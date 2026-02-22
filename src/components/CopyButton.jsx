'use client';
import styles from './CopyButton.module.css';

export default function CopyButton(props) {
  const { link, label = '복사' } = props;

  const handleClick = () => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(link);
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
