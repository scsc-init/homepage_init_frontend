import WithAuthorization from '@/components/WithAuthorization';
import MajorList from './MajorList';
import styles from './MajorList.module.css';
import { fetchMajors } from '@/util/fetchAPIData';

export default async function MajorListPage() {
  const [majors] = await Promise.allSettled([fetchMajors()]);
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
