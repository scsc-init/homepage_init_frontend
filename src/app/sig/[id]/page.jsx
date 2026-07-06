import 'highlight.js/styles/github.css';
import './page.css';
import IgClient from '@/components/ig/IgClient';
import { fetchBackendServer, fetchBackendServerJson } from '@/util/fetch/server';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const sig = await fetchBackendServerJson('GET', `/api/sig/${id}`);
    return {
      title: sig.title,
      description: sig.description || '\u0053\u0049\u0047 \uc0c1\uc138 \ud398\uc774\uc9c0',
      openGraph: {
        title: sig.title,
        description: sig.description || '\u0053\u0049\u0047 \uc0c1\uc138 \ud398\uc774\uc9c0',
        url: `https://scsc.dev/sig/${id}`,
        siteName: 'SCSC',
        images: [{ url: '/opengraph.png', width: 1200, height: 630, alt: 'SCSC Logo' }],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: sig.title,
        description: sig.description || '\u0053\u0049\u0047 \uc0c1\uc138 \ud398\uc774\uc9c0',
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
    return (
      <div className="p-6 text-center text-red-600">
        {'\uc874\uc7ac\ud558\uc9c0 \uc54a\ub294 SIG\uc785\ub2c8\ub2e4.'}
      </div>
    );
  }
  const sig = await sigRes.json();

  const rawMembers = sig.members ?? [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m?.user ?? m).filter((user) => Boolean(user?.is_active))
    : [];

  const article = sig.content ?? { content: '' };

  return (
    <IgClient
      kind="sig"
      item={sig}
      members={members}
      articleContent={article.content}
      itemId={id}
    />
  );
}
