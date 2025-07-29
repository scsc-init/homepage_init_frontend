// /app/about/page.jsx
import Image from "next/image";
import Link from "next/link";
import ScrollEffectWrapper from "@/components/about/ScrollEffectWrapper";
import FaqList from "@/components/about/FaqList";
import Arrow from "@/components/about/Arrow";
import "./page.css";

export default function AboutPage() {
  const year = new Date().getFullYear() - 1984;

  return (
    <div>
      <div className="WallLogo" />
      <div className="WallLogo2" />
      <div className="AboutWrapper">
        <aside className="AboutSidebar hide-on-mobile">
          <ul>
            <li>
              <a href="#scsc">SCSC</a>
            </li>
            <li>
              <a href="#activities">활동</a>
            </li>
            <li>
              <a href="#faq">자주 묻는 질문</a>
            </li>
            <li>
              <a href="#clubroom">동아리 시설</a>
            </li>
          </ul>
        </aside>

        <main className="AboutMain">
          <ScrollEffectWrapper>
            <section id="scsc" className="AboutIntroSection AnchorOffset">
              <div className="AboutInner">
                <h1 className="AboutTitle">About us</h1>

                <ScrollEffectWrapper>
                  <h1>SCSC</h1>
                </ScrollEffectWrapper>
                <ScrollEffectWrapper>
                  <p>서울대학교 컴퓨터 연구회 SCSC를 소개합니다</p>
                </ScrollEffectWrapper>
                <ScrollEffectWrapper>
                  <div className="AboutCard">
                    <ScrollEffectWrapper>
                      <p>
                        <strong>한글, 리니지, 리니지2, 아이온.</strong>
                        <br />
                        이들은 공통점은 무엇일까요?
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        <strong>SCSC</strong>는{" "}
                        <strong>SNU Computer Study Club</strong>의 약자로,{" "}
                        <strong>
                          1984년부터 이어져 온 서울대학교 컴퓨터 연구회
                        </strong>
                        입니다.
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        세계 최초의 한글 워드프로세서인 한글 1.0 버전은 제3회
                        SCSC 전시회에서 처음 공개되었습니다. 이때 개발을
                        이끌었던 <strong>이찬진</strong>,{" "}
                        <strong>김형집</strong>, <strong>우원식</strong>,{" "}
                        <strong>김택진</strong> 선배님들은 우리나라 소프트웨어
                        역사에서 빼놓을 수 없는 분들입니다.
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        이찬진, 김형집, 우원식 선배님은 ‘한글과컴퓨터’ 사에서
                        한글을 대중화시키셨습니다. 김택진 선배님은
                        ‘한메소프트’를 창립해 &lt;한메 타자 교사&gt;, &lt;한메
                        한글&gt;을 개발한 후, 1997년에는 ‘NC소프트’를
                        창업하셨습니다.
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        또한 우원식 선배님은 ‘한글과컴퓨터’에서 나온 후
                        NC소프트의 다양한 게임 개발에 참여하였고, &lt;아이온&gt;
                        개발을 총괄하셨습니다.
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        이 외에도 수많은 SCSC 선배님들이 여러 회사를 창업하고,
                        다양한 곳에서 핵심 직책을 맡고 계십니다.
                      </p>
                    </ScrollEffectWrapper>
                    <ScrollEffectWrapper>
                      <p>
                        <strong>한글, 리니지, 리니지2, 아이온</strong>의
                        공통점은 바로{" "}
                        <strong>
                          서울대학교 컴퓨터 동아리 SCSC가 없었다면 나오지 못했을
                          것들
                        </strong>
                        이라는 점입니다.
                      </p>
                    </ScrollEffectWrapper>
                  </div>
                </ScrollEffectWrapper>
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
                    <ScrollEffectWrapper>
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
                      <ScrollEffectWrapper>
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
                      </ScrollEffectWrapper>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </ScrollEffectWrapper>
        </main>
      </div>
    </div>
  );
}
