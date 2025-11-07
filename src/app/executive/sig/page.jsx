// src/app/executive/sig/page.jsx
import WithAuthorization from '@/components/WithAuthorization';
import SigList from './SigList';
import SigMembersPanel from './SigMembersPanel';
import { fetchSigs, fetchUsers } from '@/util/fetchAPIData';
import styles from '../igpage.module.css';

export default async function ExecutiveSigPage() {
  const [sigs, users] = await Promise.allSettled([fetchSigs(), fetchUsers()]);

  return (
    <WithAuthorization>
      <div className={styles['admin-panel']}>
        <h2>SIG 관리</h2>
        <div className={styles['adm-section']}>
          <SigList
            sigs={
              sigs.status === 'fulfilled'
                ? sigs.value.filter((s) => s.status === 'fulfilled').map((s) => s.value)
                : []
            }
          />
        </div>
        <h2>SIG 구성원 관리</h2>
        <div className={styles['adm-section']}>
          <SigMembersPanel
            sigs={
              sigs.status === 'fulfilled'
                ? sigs.value.filter((s) => s.status === 'fulfilled').map((s) => s.value)
                : []
            }
            users={users.status === 'fulfilled' ? users.value : []}
          />
        </div>
      </div>
    </WithAuthorization>
  );
}
