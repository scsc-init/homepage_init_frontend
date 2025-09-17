import "highlight.js/styles/github.css";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";
import PigClient from "./PigClient";


export async function generateMetadata({ params }) {
  const { id } = params;
  try {
    const pigRes = await fetch(`${getBaseUrl()}/api/pig/${id}`, {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    });
    if (!pigRes.ok) {
      return {
        title: "PIG | SCSC",
        openGraph: {
          title: "PIG | SCSC",
          url: `${getBaseUrl()}/pig/${id}`,
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
    const pig = await pigRes.json();
    return {
      title: pig.title,
      description: pig.description || "PIG 상세 페이지",
      openGraph: {
        title: pig.title,
        description: pig.description || "PIG 상세 페이지",
        url: `${getBaseUrl()}/pig/${id}`,
        siteName: "SCSC",
        images: [
          { url: "/opengraph.png", width: 1200, height: 630, alt: "SCSC Logo" },
        ],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: pig.title,
        description: pig.description || "PIG 상세 페이지",
        images: ["/opengraph.png"],
      },
    };
  } catch {
    return {
      title: "PIG | SCSC",
      openGraph: {
        title: "PIG | SCSC",
        url: `${getBaseUrl()}/pig/${id}`,
        siteName: "SCSC",
        images: [
          { url: "/opengraph.png", width: 1200, height: 630, alt: "SCSC Logo" },
        ],
        type: "article",
      },
    };
  }
}

export default async function PigDetailPage({ params }) {
  const { id } = params;

  const pigRes = await fetch(`${getBaseUrl()}/api/pig/${id}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (!pigRes.ok) {
    return (
      <div className="p-6 text-center text-red-600">
        존재하지 않는 PIG입니다.
      </div>
    );
  }
  const pig = await pigRes.json();

  const membersRes = await fetch(`${getBaseUrl()}/api/pig/${id}/members`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  const rawMembers = membersRes.ok ? await membersRes.json() : [];
  const members = Array.isArray(rawMembers)
    ? rawMembers.map((m) => m.user ?? m)
    : [];

  return (
    <PigClient
      pig={pig}
      members={members}
      articleId={pig.content_id}
      pigId={id}
    />
  );
}
