'use client';
import styles from './CopyButton.module.css';

export default function CopyButton(props) {
  return (
    <button
      onClick={() => navigator.clipboard.writeText(props.link)}
      className={styles['invite-link-copy']}
      aria-label="초대 링크 복사"
    >
      🔗COPY
    </button>
  );
}
