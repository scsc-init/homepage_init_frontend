import ArticleList from "./ArticleList";
import SigList from "./SigList";
import PigList from "./PigList";
import MajorList from "./MajorList";
import UserList from "@/app/executive/UserList";

export default function AdminPanel() {
  return (
    <div className="admin-panel" style={{ padding: "2rem" }}>
      <h2>유저 관리</h2>
      <UserList />

      <h2>게시글 관리</h2>
      <ArticleList />

      <h2>SIG 관리</h2>
      <SigList />

      <h2>PIG 관리</h2>
      <PigList />

      <h2>전공 관리</h2>
      <MajorList />
    </div>
  );
}