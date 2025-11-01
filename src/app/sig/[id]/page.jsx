import 'highlight.js/styles/github.css';
import './page.css';
import SigClient from './SigClient';
import { handleApiRequest } from '@/app/api/apiWrapper';
import { getBaseUrl } from '@/util/getBaseUrl';
import { getApiSecret } from '@/util/getApiSecret';
import { fetchMe } from '@/util/fetchAPIData';
import { redirect } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const res = await fetch(`${getBaseUrl()}/api/sig/${id}`, {
      method: 'GET',
      headers: { 'x-api-secret': getApiSecret() },
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const sig = await res.json();
    return {
      title: sig.title,
      description: sig.description || 'SIG 상세 페이지',
      openGraph: {
        title: sig.title,
        description: sig.description || 'SIG 상세 페이지',
        url: `${getBaseUrl()}/sig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: sig.title,
        description: sig.description || 'SIG 상세 페이지',
        images: ['/opengraph.png'],
      },
    };
  } catch {
    return {
      title: 'SIG | SCSC',
      openGraph: {
        title: 'SIG | SCSC',
        url: `${getBaseUrl()}/sig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}

export default async function SigDetailPage({ params }) {
  const { id } = params;

  const [me] = await Promise.allSettled([fetchMe()]);

  if (me.status === 'rejected') redirect('/us/login');

  const sigRes = await handleApiRequest('GET', `/api/sig/${id}`);
  if (!sigRes.ok) {
    return <div className="p-6 text-center text-red-600">존재하지 않는 SIG입니다.</div>;
  }
  const sig = await sigRes.json();

  const membersRes = await handleApiRequest('GET', `/api/sig/${id}/members`);
  const rawMembers = membersRes.ok ? await membersRes.json() : [];
  const members = Array.isArray(rawMembers) ? rawMembers.map((m) => m.user ?? m) : [];

  const articleRes = await handleApiRequest('GET', `/api/article/${sig.content_id}`);
  const article = articleRes.ok ? await articleRes.json() : { content: '' };

  return (
    <SigClient
      sig={sig}
      members={members}
      articleContent={article.content}
      me={me.value}
      sigId={id}
    />
  );
}
