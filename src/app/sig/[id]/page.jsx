import 'highlight.js/styles/github.css';
import './page.css';
import SigClient from './SigClient';
import { fetchBackendServer, fetchBackendServerJson } from '@/util/fetch/server';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const sig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
    return {
      title: sig.title,
      description: sig.description || 'SIG 상세 페이지',
      openGraph: {
        title: sig.title,
        description: sig.description || 'SIG 상세 페이지',
        url: `https://scsc.dev/sig/${id}`,
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
        url: `https://scsc.dev/sig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
    };
  }
}

export default async function SigDetailPage({ params }) {
  const { id } = await params;

  const sigRes = await fetchBackendServer('GET', `/api/sig/${id}`);
  if (!sigRes.ok) {
    return <div className="p-6 text-center text-red-600">존재하지 않는 SIG입니다.</div>;
  }
  const sig = await sigRes.json();

  const rawMembers = sig.members ?? [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = sig.content ?? { content: '' };

  return (
    <SigClient
      sig={sig}
      members={members}
      articleContent={article.content}
      sigId={id}
    />
  );
}
