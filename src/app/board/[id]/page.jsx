//중요!!! 현재 모든 클래스를 sig에서 재활용하고 있으므로, componentization된 부분을 포함해 클래스명을 sig로 유지하고 있습니다.
//이는 배포 이전에, 디자인 수정을 포함한 기능 수정시의 편의를 위한 것이고 실제 배포시에는 유지보수를 위해 componetization을 진행하거나 이름을 바꿀 예정입니다.

import Link from "next/link";
import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
import ArticlesView from "./ArticlesView";

export default async function BoardPage({ params }) {
  const boardId = params.id;

  // 게시판 정보
  const boardRes = await fetch(`${getBaseUrl()}/api/board/${boardId}`, {
    headers: { "x-api-secret": getApiSecret() },
    cache: "no-store",
  });

  if (!boardRes.ok) {
    return (
      <div className="text-center text-red-600 mt-10">
        게시글을 불러올 수 없습니다.
      </div>
    );
  }

  if (boardId == 1 || boardId == 2) {
    return (
      <div className="text-center text-red-600 mt-10">
        잘못된 접근입니다.
      </div>
    );
  }

  const board = await boardRes.json();

  return (
    <div id="SigListContainer">
      <div className="SigHeader">
        <div>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <p className="text-slate-10 mt-1">{board.description}</p>
        </div>
        <Link href={`/board/${boardId}/create`} id="SigCreateButton">
          <button className="SigCreateBtn">글 작성</button>
        </Link>
      </div>

      <ArticlesView board={board} />
    </div>
  );
}
