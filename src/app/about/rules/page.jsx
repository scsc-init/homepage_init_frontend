import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import ReactMarkdown from "react-markdown";
import "./page.css";

export const dynamic = "force-dynamic"; // 회칙 내용은 업데이트될 수 있으므로 동적 처리

async function fetchMarkdown() {
  const url =
    "https://raw.githubusercontent.com/scsc-init/homepage_init/master/%ED%9A%8C%EC%B9%99.md";
  const res = await fetch(url, { cache: "no-store" }); // 최신 내용 항상 불러오기
  if (!res.ok) {
    throw new Error("Failed to fetch regulation markdown.");
  }
  return res.text();
}

export default async function RegulationPage() {
  const markdown = await fetchMarkdown();

  return (
    <div id="Home">
      <div id="HomeContent">
        <ScrollEffectWrapper>
          <div id="RegulationContainer">
            <h2>SCSC 회칙</h2>
            <p className="RegulationIntro">
              SCSC 동아리의 운영과 규칙을 안내합니다.
            </p>
            <div className="RegulationItem">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        </ScrollEffectWrapper>
      </div>
    </div>
  );
}
