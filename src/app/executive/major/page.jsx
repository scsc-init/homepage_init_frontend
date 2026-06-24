import WithAuthorization from '@/components/WithAuthorization';
import MajorList from './MajorList';
import styles from './MajorList.module.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export default async function MajorListPage() {
  const [majors] = await Promise.allSettled([fetchBackendServerJson('GET', '/api/majors')]);
  return (
    <WithAuthorization>
      <div className={styles.panel}>
        <div className={styles.section}>
          <MajorList majors={majors.status === 'fulfilled' ? majors.value : []} />
        </div>
      </div>
    </WithAuthorization>
  );
}
