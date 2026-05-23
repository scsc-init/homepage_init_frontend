import EditPigClient from './EditPigClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';
import { fetchCurrentUserProfile } from '@/util/fetch/server-util';
import { redirect } from 'next/navigation';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }) {
  const { id } = await params;
  const me = await fetchCurrentUserProfile();
  if (!me) redirect('/us/login');

  let pig;
  try {
    pig = await fetchBackendServerJson('GET', `/api/pig/${id}`);
  } catch {
    return (
      <div className="CreatePigContainer">
        <div className="CreatePigHeader">
          <h1 className="CreatePigTitle">PIG 수정</h1>
        </div>
        <div className="CreatePigCard">피그 정보를 불러오지 못했습니다.</div>
      </div>
    );
  }

  const article = pig.content ?? { content: '' };

  return <EditPigClient pigId={id} me={me} pig={pig} article={article} />;
}
