import dynamic from "next/dynamic";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import "./page.css";

const ExecutivesClient = dynamic(() => import("./client"), { ssr: false });

export default function ExecutivesPage() {
  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div id="ExecutivePage">
        <h2>개발자 소개</h2>
        <ScrollEffectWrapper>
          <ExecutivesClient />
        </ScrollEffectWrapper>
      </div>
    </>
  );
}
