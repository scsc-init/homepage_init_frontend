// app/pig/create/page.jsx
import CreatePigClient from './CreatePigClient';
import './page.css';
import { fetchSCSCGlobalStatus } from '@/util/fetchAPIData';

export const metadata = { title: 'PIG' };

export default async function CreatePigPage() {
  const [scscGlobalStatus] = await Promise.allSettled([fetchSCSCGlobalStatus()]);
  return (
    <CreatePigClient
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
