import dynamic from "next/dynamic";
import "./page.css";

// 클라이언트 전용 컴포넌트 dynamic import
const MyPageClient = dynamic(
  () => import("@/components/about/MyProfileClient"),
  {
    ssr: false,
  },
);

export default function MyPage() {
  return (
    <div id="Home">
      <div id="MyPageContainer">
        <MyPageClient/>
      </div>
    </div>
  );
}
