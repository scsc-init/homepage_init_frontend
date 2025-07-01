// src/app/executive/page.jsx

import ArticleList from "./ArticleList";
import SigList from "./SigList";
import PigList from "./PigList";
import MajorList from "./MajorList";
import Link from "next/link";
import WithAuthorization from "@/components/WithAuthorization";

export default function AdminPanel() {
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

        <h2>전공 관리</h2>
        <MajorList />
      </div>
    </WithAuthorization>
  );
}
