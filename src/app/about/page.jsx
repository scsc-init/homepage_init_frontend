// /app/about/page.jsx
import Image from "next/image";
import Link from "next/link";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import FaqList from "@/components/about/FaqList";
import Arrow from "@/components/about/Arrow";
import "./page.css";
import Sidebar from "@/components/about/Sidebar.jsx";

export default function AboutPage() {
  const year = new Date().getFullYear() - 1984;

  return (
    <>
      <div className="WallLogo"></div>
      <div className="WallLogo2"></div>
      <div className="AboutWrapper">
        <Sidebar />

        <main className="AboutMain">
          <ScrollEffectWrapper>
            <section id="scsc" className="AboutIntroSection AnchorOffset">
              <div className="AboutInner">
                <h1 className="AboutTitle">About us</h1>
                <div className="main-intro">
                  <ScrollEffectWrapper>
                    <p>
                      <b>한글, 리니지, 리니지2, 아이온.</b>
                      <br />
                      이들의 공통점은 무엇일까요?
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      <b>SCSC</b>는 <b>서울대학교 컴퓨터 연구회</b>
                      (SNU Computer Study Club)의 약자로,
                      <br />
                      <b>1984년부터 이어져 온 전통 있는 동아리</b>입니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      세계 최초의 한글 워드프로세서 <b>‘한글 1.0’</b>은
                      <br />
                      <b>제3회 SCSC 전시회</b>에서 처음 공개되었습니다.
                      <br />
                      <b>이찬진, 김형집, 우원식, 김택진</b> 선배님들은
                      <br />
                      우리나라 소프트웨어 역사의 주역이셨습니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      <b>‘한글과컴퓨터’</b>에서 <b>한글</b>을 대중화시키고,
                      <br />
                      <b>‘한메소프트’</b>와 <b>‘NC소프트’</b>를 창업하여
                      <br />
                      <b>한메 타자교사, 한메 한글, 리니지, 아이온</b> 등
                      <br />
                      수많은 명작 소프트웨어와 게임을 만들었습니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      그 외에도 수많은 SCSC 선배님들이
                      <br />
                      다양한 기업을 창업하고 IT 산업을 이끌고 있습니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      <b>한글, 리니지, 리니지2, 아이온</b>
                      <br />이 모든 것은 <b>SCSC 없이는 불가능했을</b>{" "}
                      이야기입니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      지금의 SCSC는 SKYST 해커톤 및 SCPC 알고리즘 대회를
                      개최하거나 <br />
                      현직 개발자분들을 초청해 세미나를 진행하는 등
                      <br />
                      다양한 행사를 기획 및 운영하고 있습니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <p>
                      200여 명의 다양한 전공을 가진 동아리원이 활동하고 있으며,
                      <br />
                      그런 만큼 SCSC는 앱•웹•인공지능•알고리즘 등 여러 분야에
                      걸쳐
                      <br />
                      자신만의 전문성을 가질 수 있도록 돕는 것을 주된 목표로
                      삼고 있습니다.
                    </p>
                  </ScrollEffectWrapper>
                  <ScrollEffectWrapper>
                    <h2>
                      <br />
                      <b>SCSC는 계속해서 나아갑니다!</b>
                    </h2>
                  </ScrollEffectWrapper>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper>
            <section id="activities" className="AboutSection AnchorOffset">
              <div className="AboutInner">
                <h2>SCSC는 이러한 활동을 합니다</h2>
                <div className="ClubroomFacilityList">
                  {[
                    {
                      title: "세미나",
                      description:
                        "외부 기업인 또는 동아리원이 컴퓨터와 관련된 주제로 세미나를 개최합니다.",
                      image: "/img7.jpg",
                    },
                    {
                      title: "SIG",
                      description:
                        "특정 주제에 관심이 있는 동아리원이 모여 함께 공부하는 모임입니다.",
                      image: "/img8.jpg",
                    },
                    {
                      title: "PIG",
                      description:
                        "프로젝트 중심의 팀 활동입니다. INIT 등이 있습니다.",
                      image: "/img9.jpg",
                    },
                    {
                      title: "SCPC",
                      description: "알고리즘 대회입니다.",
                      image: "/img11.jpg",
                    },
                    {
                      title: "SKYST",
                      description: "타 동아리와 연합한 해커톤 대회입니다.",
                      image: "/img12.jpg",
                    },
                    {
                      title: "친목 활동",
                      description:
                        "MT, 번개 등 다양한 친목 도모 활동이 있습니다.",
                      image: "/img10.jpg",
                    },
                  ].map(({ title, description, image }, i) => (
                    <ScrollEffectWrapper key={title}>
                      <div className="ClubroomCard">
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
                    </ScrollEffectWrapper>
                  ))}
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper>
            <section id="faq" className="AboutSection AnchorOffset">
              <div className="AboutInner">
                <FaqList />
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper>
            <section id="clubroom" className="AboutSection AnchorOffset">
              <div className="AboutInner">
                <div id="HomeClubroomContainer">
                  <h2>동아리방에는 무엇이 있을까요?</h2>
                  <div className="ClubroomFacilityList">
                    {[
                      {
                        title: "고성능 컴퓨터",
                        description: "딥러닝과 개발용 워크스테이션을 갖춘 환경",
                        image: "/img1.jpg",
                      },
                      {
                        title: "소파 & 회의 공간",
                        description: "편하게 앉아 쉴 수 있는 공간",
                        image: "/img2.jpg",
                      },
                      {
                        title: "음료 및 간식",
                        description:
                          "대형 냉장고와 간식이 항상 구비되어 있습니다",
                        image: "/img3.jpg",
                      },
                      {
                        title: "책과 자료들",
                        description: "프로그래밍 서적과 다양한 공부 자료 보유",
                        image: "/img4.jpg",
                      },
                      {
                        title: "프린터기",
                        description: "컬러 출력이 가능한 고성능 프린터",
                        image: "/img5.jpg",
                      },
                      {
                        title: "게임기",
                        description:
                          "닌텐도, PS4 등 게임기로 여가도 즐길 수 있습니다",
                        image: "/img6.jpg",
                      },
                    ].map(({ title, description, image }, i) => (
                      <ScrollEffectWrapper key={title}>
                        <div className="ClubroomCard">
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
                      </ScrollEffectWrapper>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>

          <ScrollEffectWrapper>
            <section id="more" className="AboutSection AnchorOffset">
              <div className="AboutInner">
                <div className="AboutCard">
                  <h2>SCSC에 대해 더 알아보고 싶다면?</h2>
                  <div className="MoreLinkList">
                    {[
                      { title: "리크루팅 정보 바로가기", url: "/us/contact" },
                      { title: "시그 목록 바로가기", url: "/sig" },
                      { title: "피그 목록 바로가기", url: "/pig" },
                      {
                        title: "공식 인스타그램",
                        url: "https://www.instagram.com/scsc_snu/?hl=ko",
                      },
                      {
                        title: "공식 깃허브",
                        url: "https://github.com/SNU-SCSC",
                      },
                    ].map(({ title, url }, i) =>
                      url.startsWith("http") ? (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="MoreLink"
                        >
                          <span>{title}</span>
                          <Arrow
                            width="20px"
                            height="20px"
                            rotate="-90deg"
                            color="#070707"
                          />
                        </a>
                      ) : (
                        <Link key={i} href={url} className="MoreLink">
                          <span>{title}</span>
                          <Arrow
                            width="20px"
                            height="20px"
                            rotate="-90deg"
                            color="#070707"
                          />
                        </Link>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>
        </main>
      </div>
    </>
  );
}
