'use client';

import { useTranslations } from 'next-intl';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import styles from './IgDetail.module.css';

export default function MembersLoginPrompt() {
  const router = useRouter();
  const t = useTranslations('Ig');

  return (
    <div className={styles.membersLocked}>
      <button
        type="button"
        className={styles.membersLoginButton}
        onClick={() => pushLoginWithRedirect(router)}
      >
        {t('loginToView')}
      </button>
    </div>
  );
}
