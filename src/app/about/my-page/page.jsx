import dynamic from "next/dynamic";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import "./page.css";

// 클라이언트 전용 컴포넌트 dynamic import
const MyProfileClient = dynamic(
  () => import("@/components/about/MyProfileClient"),
  {
    ssr: false,
  },
);

export default function MyPage() {
  return (
    <div id="Home">
      <div id="HomeContent">
        <ScrollEffectWrapper>
          <MyProfileClient />
        </ScrollEffectWrapper>
      </div>
    </div>
  );
}
