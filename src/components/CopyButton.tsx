'use client';
import styles from './CopyButton.module.css';
import { useTranslations } from 'next-intl';

type CopyButtonProps = {
  link: string;
  label?: string;
};

export default function CopyButton({ link, label }: CopyButtonProps) {
  const t = useTranslations('CopyButton');

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
      aria-label={t('ariaLabel')}
    >
      <span className={styles.icon} aria-hidden="true">
        📋
      </span>
      <span className={styles.text}>{label ?? t('label')}</span>
    </button>
  );
}
