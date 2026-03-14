// src/app/executive/sig/[id]/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigEdit from './SigEdit';
import IgMembersPanel from '../../IgMembersPanel';
import { safeFetch, fetchUsers } from '@/util/fetchAPIData';
import styles from '../../igpage.module.css';

export default async function ExecutiveSigPage({ params }) {
  const [sigMeta, users] = await Promise.allSettled([
    safeFetch('GET', `/api/sig/${(await params).id}`),
    fetchUsers(),
  ]);
  if (sigMeta.status !== 'fulfilled') {
    return null;
  }

  const [sigMembers, sigArticle] = await Promise.all([
    safeFetch('GET', `/api/sig/${sigMeta.value.id}/members`),
    safeFetch('GET', `/api/article/${sigMeta.value.content_id}`),
  ]);

  const sig = {
    ...sigMeta.value,
    content: sigArticle?.content ?? '',
    members: Array.isArray(sigMembers) ? sigMembers : [],
  };

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>SIG 관리</h2>
        <div className={styles['adm-section']}>
          <SigEdit sig={sig} />
        </div>
        <h2>SIG 구성원 관리</h2>
        <div className={styles['adm-section']}>
          <IgMembersPanel
            is_sig
            ig={sig}
            users={users.status === 'fulfilled' ? users.value : []}
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
