import EditSigClient from './EditSigClient';
import './page.css';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { fetchMe } from '@/util/fetchAPIData';
import { redirect } from 'next/navigation';

export const metadata = { title: 'SIG' };

export default async function EditSigPage({ params }) {
  const { id } = params;
  const me = await fetchMe();
  if (!me?.id) redirect('/us/login');

  const sigRes = await handleApiRequest('GET', `/api/sig/${id}`);
  if (!sigRes.ok) {
    return (
      <div className="CreateSigContainer">
        <div className="CreateSigHeader">
          <h1 className="CreateSigTitle">SIG 수정</h1>
        </div>
        <div className="CreateSigCard">시그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }
  const sig = await sigRes.json();

  const articleRes = await handleApiRequest('GET', `/api/article/${sig.content_id}`);
  const article = articleRes.ok ? await articleRes.json() : { content: '' };

  return <EditSigClient sigId={id} me={me} sig={sig} article={article} />;
}
