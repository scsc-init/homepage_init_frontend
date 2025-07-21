// src/app/executive/page.jsx

import ArticleList from "./ArticleList";
import SigList from "./SigList";
import PigList from "./PigList";
import MajorList from "./MajorList";
import Link from "next/link";
import WithAuthorization from "@/components/WithAuthorization";
import ScscStatusPanel from "./ScscStatusPanel";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";

export default async function AdminPanel() {
  const boards = await fetchBoards();
  const articles = await fetchArticles();
  const sigs = await fetchSigs();
  const pigs = await fetchPigs();
  const scscGlobalStatus = await fetchScscGlobalStatus();
  const majors = await fetchMajors();

  return (
    <WithAuthorization>
      <div className="admin-panel" style={{ padding: "2rem" }}>
        <h2>유저 관리</h2>
        <p>
          <Link href="/executive/user">유저 관리 페이지로 이동</Link>
        </p>

        <h2>게시글 관리</h2>
        <ArticleList boards={boards} articles={articles} />

        <h2>SIG 관리</h2>
        <SigList sigs={sigs} />

        <h2>PIG 관리</h2>
        <PigList pigs={pigs} />
        <h2>Scsc status 관리</h2>
        <ScscStatusPanel scscGlobalStatus={scscGlobalStatus.status} semester={scscGlobalStatus.semester} year={scscGlobalStatus.year}/>
        <h2>전공 관리</h2>
        <MajorList majors={majors} />
      </div>
    </WithAuthorization>
  );
}

const targetBoardIds = [3, 4, 5];
async function fetchBoards() {
  const boardResults = await Promise.all(
    targetBoardIds.map(async (id) => {
      const res = await fetch(`${getBaseUrl()}/api/board/${id}`, {
        headers: { "x-api-secret": getApiSecret() },
        cache: "no-store",
      });
      return res.ok ? await res.json() : null;
    }),
  );
  return boardResults.filter(Boolean);
}
async function fetchArticles() {
  const all = {};
  for (const boardId of targetBoardIds) {
    const res = await fetch(`${getBaseUrl()}/api/articles/${boardId}`, {
      headers: { "x-api-secret": getApiSecret() },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      all[boardId] = data;
    }
  }
  return all;
}

async function fetchSigs() {
  const res = await fetch(`${getBaseUrl()}/api/sigs`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) return;

  const sigsRaw = await res.json();

  const sigsWithContent = await Promise.all(
    sigsRaw.map(async (sig) => {
      const articleRes = await fetch(
        `${getBaseUrl()}/api/article/${sig.content_id}`,
        {
          headers: { "x-api-secret": getApiSecret() },
          cache: "no-store",
        },
      );
      const article = articleRes.ok ? await articleRes.json() : { content: "" };
      return { ...sig, content: article.content };
    }),
  );

  return sigsWithContent;
}

async function fetchPigs() {
  const res = await fetch(`${getBaseUrl()}/api/pigs`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!res.ok) return;

  const pigsRaw = await res.json();

  const pigsWithContent = await Promise.all(
    pigsRaw.map(async (pig) => {
      const articleRes = await fetch(
        `${getBaseUrl()}/api/article/${pig.content_id}`,
        {
          headers: { "x-api-secret": getApiSecret() },
          cache: "no-store",
        },
      );
      const article = articleRes.ok ? await articleRes.json() : { content: "" };
      return { ...pig, content: article.content };
    }),
  );

  return pigsWithContent;
}

async function fetchScscGlobalStatus() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  return res.ok ? (await res.json()) : "";
}

async function fetchMajors() {
  const res = await fetch(`${getBaseUrl()}/api/majors`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) return await res.json();
}
