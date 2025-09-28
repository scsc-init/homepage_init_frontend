import Header from './Header';
import { fetchSCSCGlobalStatus } from '@/util/fetchAPIData';

export default async function HeaderWrapper() {
  const scscGlobalStatus = await fetchSCSCGlobalStatus();

  return (
    <Header
      year={scscGlobalStatus ? scscGlobalStatus.year : null}
      semester={scscGlobalStatus ? scscGlobalStatus.semester : null}
    />
  );
}
