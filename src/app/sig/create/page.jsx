// app/sig/create/page.jsx
import CreateSigClient from './CreateSigClient';
import './page.css';
import { fetchSCSCGlobalStatus } from '@/util/fetch/server-util';

export const metadata = { title: 'SIG' };

export default async function CreateSigPage() {
  const [scscGlobalStatus] = await Promise.allSettled([fetchSCSCGlobalStatus()]);
  return (
    <CreateSigClient
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
