import Image from "next/image";
import Link from "next/link";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import FaqList from "@/components/about/FaqList";
import Arrow from "@/components/about/Arrow";
import "./page.css";

export default function Home() {
  const year = new Date().getFullYear() - 1984;

  return (
    <div id="Home">
      <div id="HomeContent">
        <ScrollEffectWrapper>
          <div id="HomeIntroContainer">
            <h2>서울대학교 컴퓨터 연구회 SCSC를 소개합니다</h2>
            <div className="ActivityBlock">
              <p>
                <strong>한글, 리니지, 리니지2, 아이온.</strong>
                <br />
                이들의 공통점은 무엇일까요?
              </p>
              <p>
                <strong>SCSC</strong>는 <strong>SNU Computer Study Club</strong>
                의 약자로,
                <strong> 1984년부터 이어져 온 서울대학교 컴퓨터 연구회</strong>
                입니다.
              </p>
              <p>
                세계 최초의 한글 워드프로세서인 <strong>한글 1.0</strong> 버전은
                제3회 SCSC 전시회에서 처음 공개되었습니다. 이때 개발을 이끌었던
                <strong>이찬진</strong>, <strong>김형집</strong>,{" "}
                <strong>우원식</strong>, <strong>김택진</strong> 선배님들은
                우리나라 소프트웨어 역사에서 빼놓을 수 없는 분들입니다.
              </p>
              <p>
                <strong>이찬진</strong>, <strong>김형집</strong>,{" "}
                <strong>우원식</strong> 선배님은 <strong>‘한글과컴퓨터’</strong>{" "}
                사에서 한글을 대중화시키셨습니다.
                <strong>김택진</strong> 선배님은 ‘한메소프트’를 창립해 &lt;한메
                타자교사&gt;, &lt;한메 한글&gt;을 개발한 후, 1997년에는{" "}
                <strong>‘NC소프트’</strong>를 창업하셨습니다.
              </p>
              <p>
                또한 <strong>우원식</strong> 선배님은 ‘한글과컴퓨터’에서 나온 후{" "}
                <strong>NC소프트</strong>의 다양한 게임 개발에 참여하였고,
                <strong>&lt;아이온&gt;</strong> 개발을 총괄하셨습니다. 게임 개발
                업계에서는 <em>‘천재 개발자’</em>로 불리고 계신 분입니다.
              </p>
              <p>
                이 외에도 수많은 SCSC 선배님들이 여러 회사를 창업하고, 다양한
                곳에서 핵심 직책을 맡고 계십니다.
              </p>
              <p>
                <strong>한글, 리니지, 리니지2, 아이온의 공통점</strong>은 바로
                <strong>
                  {" "}
                  서울대학교 컴퓨터 동아리 SCSC가 없었다면 나오지 못했을 것들
                </strong>
                이라는 점입니다.
              </p>
            </div>
          </div>
        </ScrollEffectWrapper>

        <div style={{ height: "5vh" }} />

        <ScrollEffectWrapper>
          <div id="HomeDescriptionContainer">
            <h2>SCSC는 이러한 활동을 합니다</h2>
            {[
              [
                "SIG",
                "특정 주제에 관심이 있는 동아리원이 모여 함께 공부하는 모임입니다. 그룹스터디, 리드스터디, 프로젝트 유형 등 여러 종류의 시그가 개설되어 있습니다.",
              ],
              [
                "세미나",
                "외부 기업인 또는 동아리원이 컴퓨터와 관련된 주제로 세미나를 개최합니다. 동아리원은 원하는 세미나를 듣거나 개최할 수 있습니다.",
              ],
              [
                "PIG",
                "본격적인 프로젝트와 팀 활동을 진행합니다. INIT 등이 있으며, 학습 중심인 SIG보다 결과물 완성을 목표로 합니다.",
              ],
              [
                "친목 활동",
                "회식 비용 지원, MT, 번개, 선배와의 교류 등 친목을 도모할 수 있는 다양한 활동을 실시하고 있습니다.",
              ],
            ].map(([title, text], i) => (
              <div className="ActivityBlock" key={i}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </ScrollEffectWrapper>

        <ScrollEffectWrapper>
          <div id="HomeDescriptionContainer">
            <div className="HomeDescriptionTitle">
              <h2>1984년부터 이어져 온</h2>
              <h2>서울대학교 대표 중앙 컴퓨터 동아리</h2>
            </div>
            {[
              ["총 부원 수", "1557"],
              ["개설된 SIG", "1010"],
              ["운영 기간", `${year}년`],
            ].map(([label, value], i) => (
              <div className="HomeDescriptionActivityContainer" key={i}>
                <p>{label}</p>
                <p className="HomeLargeText">{value}</p>
              </div>
            ))}
          </div>
        </ScrollEffectWrapper>

        <ScrollEffectWrapper>
          <div id="HomeClubroomContainer">
            <h2>동아리방에는 무엇이 있을까요?</h2>
            <div className="ClubroomFacilityList">
              {[
                {
                  title: "고성능 컴퓨터",
                  description:
                    "개발 및 딥러닝 작업이 가능한 다양한 환경의 워크스테이션",
                  image: "/img1.jpg",
                },
                {
                  title: "소파 & 회의 공간",
                  description: "편하게 앉아서 회의하고 쉴 수 있는 공간",
                  image: "/img2.jpg",
                },
                {
                  title: "음료 및 간식",
                  description: "업소용 대형 냉장고와 음료, 간식 상시구비",
                  image: "/img3.jpg",
                },
                {
                  title: "책과 자료들",
                  description: "다양한 프로그래밍 서적과 공부 자료 보유",
                  image: "/img4.jpg",
                },
                {
                  title: "프린터기",
                  description: "컬러 인쇄가 가능한 최신형 프린터기",
                  image: "/img5.jpg",
                },
                {
                  title: "게임기",
                  description: "닌텐도 스위치, 프로콘, ps4",
                  image: "/img6.jpg",
                },
              ].map(({ title, description, image }, i) => (
                <div key={i} className="ClubroomCard">
                  <Image
                    src={image}
                    alt={title}
                    width={400}
                    height={250}
                    className="ClubroomCardImage"
                  />
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollEffectWrapper>

        <ScrollEffectWrapper>
          <div id="HomeAboutContainer">
            <h2>SCSC에 대해 더 알아보고 싶다면?</h2>
            <div id="HomeAboutLinkList">
              {[
                { title: "리크루팅 정보 바로가기", url: "/contact" },
                { title: "시그 목록 바로가기", url: "/sig" },
                { title: "피그 목록 바로가기", url: "/pig" },
              ].map(({ title, url }, i) => (
                <Link
                  key={i}
                  href={url}
                  className="HomeAboutDescription"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>{title}</span>
                  <Arrow
                    width="25px"
                    height="25px"
                    rotate="-90deg"
                    color="#070707"
                  />
                </Link>
              ))}
              {[
                {
                  title: "공식 인스타그램",
                  url: "https://www.instagram.com/scsc_snu/?hl=ko",
                },
                { title: "공식 깃허브", url: "https://github.com/SNU-SCSC" },
              ].map(({ title, url }, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="HomeAboutDescription"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <span>{title}</span>
                  <Arrow
                    width="25px"
                    height="25px"
                    rotate="-90deg"
                    color="#070707"
                  />
                </a>
              ))}
            </div>
          </div>
        </ScrollEffectWrapper>

        <ScrollEffectWrapper>
          <FaqList />
        </ScrollEffectWrapper>
      </div>
    </div>
  );
}
