import EditSigClient from './EditSigClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';
import { redirect } from 'next/navigation';

export const metadata = { title: 'SIG' };

export default async function EditSigPage({ params }) {
  const { id } = await params;
  const me = await fetchCurrentUserProfile();
  if (!me) redirect('/us/login');

  let sig;
  try {
    sig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
  } catch {
    return (
      <div className="CreateSigContainer">
        <div className="CreateSigHeader">
          <h1 className="CreateSigTitle">SIG 수정</h1>
        </div>
        <div className="CreateSigCard">시그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }

  const article = sig.content ?? { content: '' };

  return <EditSigClient sigId={id} me={me} sig={sig} article={article} />;
}
