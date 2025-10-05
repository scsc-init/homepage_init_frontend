import 'highlight.js/styles/github.css';
import './page.css';
import PigClient from './PigClient';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import { fetchUser } from '@/util/fetchAPIData';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const res = await fetch(`${getBaseUrl()}/api/pig/${id}`, {
      method: 'GET',
      headers: { 'x-api-secret': getApiSecret() },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const pig = await res.json();
    return {
      title: pig.title,
      description: pig.description || 'PIG 상세 페이지',
      openGraph: {
        title: pig.title,
        description: pig.description || 'PIG 상세 페이지',
        url: `${getBaseUrl()}/pig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: pig.title,
        description: pig.description || 'PIG 상세 페이지',
        images: ['/opengraph.png'],
      },
    };
  } catch {
    return {
      title: 'PIG | SCSC',
      openGraph: {
        title: 'PIG | SCSC',
        url: `${getBaseUrl()}/pig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}

export default async function PigDetailPage({ params }) {
  const { id } = params;

  const me = await fetchUser();
  if (!me?.id) redirect('/us/login');

  const pigRes = await handleApiRequest('GET', `/api/pig/${id}`);
  if (!pigRes.ok) {
    return <div className="p-6 text-center text-red-600">존재하지 않는 PIG입니다.</div>;
  }
  const pig = await pigRes.json();

  const membersRes = await handleApiRequest('GET', `/api/pig/${id}/members`);
  const rawMembers = membersRes.ok ? await membersRes.json() : [];
  const members = Array.isArray(rawMembers) ? rawMembers.map((m) => m.user ?? m) : [];

  const articleRes = await handleApiRequest('GET', `/api/article/${pig.content_id}`);
  const article = articleRes.ok ? await articleRes.json() : { content: '' };

  return (
    <PigClient
      pig={pig}
      members={members}
      articleContent={article.content}
      me={me}
      pigId={id}
    />
  );
}
