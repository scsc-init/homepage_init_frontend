import EditPigClient from './EditPigClient';
import './page.css';
import { fetchBackendServerJson } from '@/util/fetch/server';

export const metadata = { title: 'PIG' };

export default async function EditPigPage({ params }) {
  const { id } = await params;

  let pig;
  try {
    pig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
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

  return <EditPigClient pigId={id} pig={pig} article={article} />;
}
