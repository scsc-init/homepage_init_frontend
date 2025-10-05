import EditPigClient from './EditPigClient';
import './page.css';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { fetchMe } from '@/util/fetchAPIData';
import { redirect } from 'next/navigation';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }) {
  const { id } = params;
  const me = await fetchMe();
  if (!me?.id) redirect('/us/login');

  const pigRes = await handleApiRequest('GET', `/api/pig/${id}`);
  if (!pigRes.ok) {
    return (
      <div className="CreatePigContainer">
        <div className="CreatePigHeader">
          <h1 className="CreatePigTitle">PIG 수정</h1>
        </div>
        <div className="CreatePigCard">피그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }
  const pig = await pigRes.json();

  const articleRes = await handleApiRequest('GET', `/api/article/${pig.content_id}`);
  const article = articleRes.ok ? await articleRes.json() : { content: '' };

  return <EditPigClient pigId={id} me={me} pig={pig} article={article} />;
}
