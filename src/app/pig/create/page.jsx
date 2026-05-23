// app/pig/create/page.jsx
import CreatePigClient from './CreatePigClient';
import './page.css';
import { fetchGlobalStatus } from '@/util/fetch/server-util';

export const metadata = { title: 'PIG' };

export default async function CreatePigPage() {
  const [scscGlobalStatus] = await Promise.allSettled([fetchGlobalStatus()]);
  return (
    <CreatePigClient
      scscGlobalStatus={
        scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value.status : null
      }
    />
  );
}
