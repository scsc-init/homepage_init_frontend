// src/app/executive/page.jsx
import ArticleList from "./ArticleList";
import SigList from "./SigList";
import PigList from "./PigList";
import MajorList from "./MajorList";
import Link from "next/link";
import WithAuthorization from "@/components/WithAuthorization";
import ScscStatusPanel from "./ScscStatusPanel";
import DiscordBotPanel from "./DiscordBotPanel";
import { getApiSecret } from "@/util/getApiSecret";
import { getBaseUrl } from "@/util/getBaseUrl";
import "./page.css";

export default async function AdminPanel() {
  const [boards, sigs, pigs, scscGlobalStatus, majors, discordBotStatus] =
    await Promise.all([
      fetchBoards(),
      fetchSigs(),
      fetchPigs(),
      fetchScscGlobalStatus(),
      fetchMajors(),
      fetchDiscordBot(),
    ]);

  return (
    <WithAuthorization>
      <div className="admin-panel">
        <h2>유저 관리</h2>
        <p>
          <Link href="/executive/user">유저 관리 페이지로 이동</Link>
        </p>

        <h2>지원금 요청</h2>
        <p>
          <Link href="/board/6">지원금 요청 게시판으로 이동</Link>
        </p>

        <h2>게시글 관리</h2>
        <div className="adm-section">
          <ArticleList boards={boards} />
        </div>

        <h2>SIG 관리</h2>
        <div className="adm-section">
          <SigList sigs={sigs} />
        </div>

        <h2>PIG 관리</h2>
        <div className="adm-section">
          <PigList pigs={pigs} />
        </div>

        <h2>Scsc status 관리</h2>
        <div className="adm-section">
          <ScscStatusPanel
            scscGlobalStatus={scscGlobalStatus.status}
            semester={scscGlobalStatus.semester}
            year={scscGlobalStatus.year}
          />
        </div>

        <h2>디스코드 봇 관리</h2>
        <div className="adm-section">
          <DiscordBotPanel
            is_logged_in={
              discordBotStatus ? discordBotStatus.logged_in : "error"
            }
          />
        </div>

        <h2>전공 관리</h2>
        <div className="adm-section">
          <MajorList majors={majors} />
        </div>
      </div>
    </WithAuthorization>
  );
}

const targetBoardIds = [3, 4, 5, 6];
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
  return res.ok ? await res.json() : "";
}

async function fetchMajors() {
  const res = await fetch(`${getBaseUrl()}/api/majors`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) return await res.json();
}

async function fetchDiscordBot() {
  const res = await fetch(`${getBaseUrl()}/api/bot/discord/status`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  if (res.ok) return await res.json();
}
