// app/sig/create/page.jsx
import CreateSigClient from './CreateSigClient';
import './page.css';
import { fetchSCSCGlobalStatus } from '@/util/fetchAPIData';

export const metadata = { title: 'SIG' };

export default async function CreateSigPage() {
  const scscGlobalStatus = await fetchSCSCGlobalStatus();
  return <CreateSigClient scscGlobalStatus={scscGlobalStatus.status} />;
}
