import "./page.css";
import { getBaseUrl } from "@/util/getBaseUrl";
import { getApiSecret } from "@/util/getApiSecret";
import BoardClient from "@/components/board/BoardClient";

export default async function BoardPage({ params }) {
  const boardId = params.id;

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

  const board = await boardRes.json();

  return (
    <div id="SigListContainer">
      <div className="SigHeader">
        <div>
          <h1 className="text-3xl font-bold">{board.name}</h1>
          <p className="board-desc">{board.description}</p>
        </div>
      </div>

      <BoardClient board={board} />
    </div>
  );
}
