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
import React from "react";

export default async function AdminPanel() {
  const scscGlobalStatus = await fetchScscGlobalStatus();

  return (
    <WithAuthorization>
      <div className="admin-panel" style={{ padding: "2rem" }}>
        <h2>유저 관리</h2>
        <p>
          <Link href="/executive/user">유저 관리 페이지로 이동</Link>
        </p>

        <h2>게시글 관리</h2>
        <ArticleList />

        <h2>SIG 관리</h2>
        <SigList />

        <h2>PIG 관리</h2>
        <PigList />
        <h2>Scsc status 관리</h2>
        <ScscStatusPanel currentStatus={scscGlobalStatus.status} />
        <h2>전공 관리</h2>
        <MajorList />
      </div>
    </WithAuthorization>
  );
}

async function fetchScscGlobalStatus() {
  const res = await fetch(`${getBaseUrl()}/api/scsc/global/status`, {
    method: "GET",
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });
  return res.ok ? await res.json() : "";
}
