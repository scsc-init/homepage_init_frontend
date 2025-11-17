import WithAuthorization from '@/components/WithAuthorization';
import MajorList from './MajorList';
import styles from './MajorList.module.css';
import { fetchMajors } from '@/util/fetchAPIData';

const [majors] = await Promise.allSettled([fetchMajors()]);

export default async function MajorListPage() {
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
