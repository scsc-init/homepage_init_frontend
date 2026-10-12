'use client';

import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useRouter } from 'next/navigation';
import styles from './IgDetail.module.css';

export default function MembersLoginPrompt() {
  const router = useRouter();

  return (
    <div className={styles.membersLocked}>
      <button
        type="button"
        className={styles.membersLoginButton}
        onClick={() => pushLoginWithRedirect(router)}
      >
        로그인 후 확인
      </button>
    </div>
  );
}
