// app/board/[id]/create/page.jsx
import CreateBoardArticleClient from "./CreateBoardArticleClient";

export default function CreateBoardPage({ params }) {
  return <CreateBoardArticleClient boardId={params.id} />;
}
