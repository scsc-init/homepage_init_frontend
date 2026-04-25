// src/app/executive/pig/[id]/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import PigEdit from './PigEdit';
import IgMembersPanel from '../../IgMembersPanel';
import { safeFetch, fetchUsers } from '@/util/fetchAPIData';
import styles from '../../igpage.module.css';

export default async function ExecutivePigPage({ params }) {
  const [pigMeta, users] = await Promise.allSettled([
    safeFetch('GET', `/api/pig/${(await params).id}`),
    fetchUsers(),
  ]);
  if (pigMeta.status !== 'fulfilled') {
    return null;
  }

  const pig = pigMeta.value;
  pig.content = pig.content.content;

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>PIG 관리</h2>
        <div className={styles['adm-section']}>
          <PigEdit pig={pig} />
        </div>
        <h2>PIG 구성원 관리</h2>
        <div className={styles['adm-section']}>
          <IgMembersPanel
            is_pig
            ig={pig}
            users={users.status === 'fulfilled' ? users.value : []}
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
