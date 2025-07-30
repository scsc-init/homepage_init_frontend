import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import ReactMarkdown from "react-markdown";
import "./page.css";

export const dynamic = "force-dynamic";

async function fetchMarkdown() {
  const url =
    "https://raw.githubusercontent.com/scsc-init/homepage_init/master/%ED%9A%8C%EC%B9%99.md";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch regulation markdown.");
  }
  return res.text();
}

export default async function RegulationPage() {
  const markdown = await fetchMarkdown();

  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <main className="AboutMain">
        <ScrollEffectWrapper>
          <section id="rules" className="AboutSection AnchorOffset">
            <div className="AboutInner">
              <h1 className="AboutTitle">SCSC 규칙</h1>
              <div id="RegulationContainer">
                <p className="RegulationIntro">
                  SCSC 동아리의 운영과 규칙을 안내합니다.
                </p>
                <div className="RegulationItem">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </div>
              </div>
            </div>
          </section>
        </ScrollEffectWrapper>
      </main>
    </>
  );
}
