import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";
import SigClient from "./SigClient";

export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const sigRes = await fetch(`${getBaseUrl()}/api/sig/${id}`, {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    });
    if (!sigRes.ok) {
      return {
        title: "SIG | SCSC",
        openGraph: {
          title: "SIG | SCSC",
          url: `${getBaseUrl()}/sig/${id}`,
          siteName: "SCSC",
          images: [
            {
              url: "/opengraph.png",
              width: 1200,
              height: 630,
              alt: "SCSC Logo",
            },
          ],
          type: "article",
        },
      };
    }
    const sig = await sigRes.json();
    return {
      title: sig.title,
      description: sig.description || "SIG 상세 페이지",
      openGraph: {
        title: sig.title,
        description: sig.description || "SIG 상세 페이지",
        url: `${getBaseUrl()}/sig/${id}`,
        siteName: "SCSC",
        images: [
          { url: "/opengraph.png", width: 1200, height: 630, alt: "SCSC Logo" },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: sig.title,
        description: sig.description || "SIG 상세 페이지",
        images: ["/opengraph.png"],
      },
    };
  } catch {
    return {
      title: "SIG | SCSC",
      openGraph: {
        title: "SIG | SCSC",
        url: `${getBaseUrl()}/sig/${id}`,
        siteName: "SCSC",
        images: [
          { url: "/opengraph.png", width: 1200, height: 630, alt: "SCSC Logo" },
        ],
        type: "article",
      },
    };
  }
}

export default async function SigDetailPage({ params }) {
  const { id } = params;

  const sigRes = await fetch(`${getBaseUrl()}/api/sig/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!sigRes.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        존재하지 않는 SIG입니다.
      </div>
    );
  }
  const sig = await sigRes.json();

  const membersRes = await fetch(`${getBaseUrl()}/api/sig/${id}/members`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  const rawMembers = membersRes.ok ? await membersRes.json() : [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m.user ?? m)
    : [];

  return (
    <SigClient
      sig={sig}
      members={members}
      articleId={sig.content_id}
      sigId={id}
    />
  );
}
