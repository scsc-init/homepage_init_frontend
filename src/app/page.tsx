"use client";
import { title } from "process";
import "./page.css";

type Activity = {
  title: string;
  description: string;
};

export default function Home() {
  const year = new Date().getFullYear() - 1984;
  return (
    <div id="Home">
      <div id="HomeImageContainer">
        <h3>서울대학교 컴퓨터 연구회</h3>
        <div style={{ paddingBottom: "1rem" }} className="TitleContainer">
          <h1>Seoul National University</h1>
          <h1>Computer Study Club</h1>
        </div>
        <div style={{ paddingBottom: "2rem" }} className="TitleContainer">
          <h4>개발자로 가는 가장 빠른 첫 걸음,</h4>
          <h4>서울대학교 중앙 컴퓨터동아리 SCSC 입니다.</h4>
        </div>
      </div>

      <div id="HomeContent">
        <div id="HomeDescriptionContainer">
          <Arrow />

          <h2>SCSC는 이러한 활동을 합니다</h2>

          {loadActivityData().map((activity: Activity, id: number) => (
            <ActivityBlock
              key={id}
              title={activity.title}
              description={activity.description}
            />
          ))}

          <Arrow />
        </div>
        <div id="HomeDescriptionContainer">
          <div className="HomeDescriptionTitle">
            <h2>1984년부터 이어져 온</h2>
            <h2>서울대학교 대표 중앙 컴퓨터 동아리</h2>
          </div>

          {loadActivityNumberData().map(
            (
              activity: { title: string; description: string | number },
              id: number
            ) => (
              <ActivityNumberBlock
                key={id}
                title={activity.title}
                description={activity.description}
              />
            )
          )}

          <Arrow />
        </div>
        <div id="HomeAboutContainer">
          <h2>SCSC에 대해 더 알아보고 싶다면?</h2>
          
          <div id="HomeAboutLinkList">
            {loadAboutData().map((fqa, id) => (
              <AboutBlock key={id} title={fqa.title} url={fqa.url} />
            ))}
          </div>
          <div style={{ margin: "auto " }}>
            <Arrow />
          </div>
        </div>
        <div id="HomeFQAContainer">
          <h2>자주 묻는 질문</h2>
          {loadFQAData().map((fqa, id) => (
            <FQABlock key={id} question={fqa.question} answer={fqa.answer} />
          ))}
        </div>
      </div>
    </div>
  );
}

const FQABlock = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const id = Math.random().toString();
  return (
    <label className="HomeFQA" htmlFor={id}>
      <div className="HomeFQAQuestion">
        <h4>{question}</h4>
        <Arrow width={"20px"} height={"20px"} color="#070707" />
      </div>
      <input id={id} type="checkbox"></input>
      <div className="HomeFQAHidden">{answer}</div>
    </label>
  );
};

const loadFQAData = (): { question: string; answer: string }[] => {
  return [
    {
      question: "동아리 활동에 어느 정도의 시간을 할애해야 하나요?",
      answer:
        "부담 정도는 개인에 따라 다르게 느껴질 수 있지만, 일주일에 적어도 1~2일은 투자해야 합니다. SCSC의 가장 주요한 활동인 SIG는 현재 13개입니다. 시그 가입 개수에 대한 제한은 없으며, 대부분 시그원끼리 시간을 조정하여 주 1~2회 시그를 진행합니다. 그외에도 주간 시그 보고회, 해커톤, 비정기 세미나가 진행되기도 합니다. 따라서 최소한 일주일에 1~2일, 활동량에 따라 그 이상의 시간이 필요할 수 있습니다.",
    },
    {
      question: "가입할 수 있는 회원에 재한이 있나요?",
      answer:
        "단과대와 학번에 관계 없이, 컴퓨터 공학과 프로그래밍에 관심이 있는 서울대학교 학생 누구나 참여하실 수 있습니다. 휴학생, 대학원생 모두 가입가능합니다. 실력에 관계 없이 활동 가능하므로 많은 지원 부탁드립니다.",
    },
    {
      question: "코딩을 잘 하지 못하는데 괜찮나요?",
      answer:
        "물론 괜찮습니다. 기초 프로그래밍을 배우는 SIG가 매학기 개설되어 있으므로 끝까지 따라오기만 한다면 충분히 컴퓨터에 익숙해질 수 있습니다.",
    },
    {
      question: "회비는 얼마이며, 어떤 곳에 사용되나요?",
      answer:
        "회비는 한 학기 당 3만원입니다. 회비 사용 내역은 종강총회일에 투명하게 공개합니다. 주로 시그 활동 지원비, 회식비, 컴퓨터 관련 물품 구매 비용 등으로 사용합니다.",
    },
  ];
};

const AboutBlock = ({ title, url }: { title: string; url: string }) => {
  return (
    <div
      className="HomeAboutDescription"
      onClick={() => {
        window.location.href = url;
      }}
    >
      <span>{title}</span>
      <Arrow width={"25px"} height={"25px"} rotate="-90deg" color="#070707" />
    </div>
  );
};

// TODO: Change URL
const loadAboutData = (): { title: string; url: string }[] => {
  return [
    {
      title: "리크루팅 정보 바로가기",
      url: "/",
    },
    {
      title: "활동 내용 자세히 알아보기",
      url: "/video",
    },
    {
      title: "공식 인스타그램",
      url: "/photo",
    },
    {
      title: "공식 깃허브",
      url: "/facebook",
    },
  ];
};

const ActivityBlock = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="ActivityBlock">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const loadActivityData = (): Activity[] => {
  return [
    {
      title: "SIG",
      description:
        "특정 주제에 관심이 있는 동아리원이 모여 함께 공부하는 모임입니다. 그룹스터디, 리드스터디, 프로젝트 유형 등 여러 종류의 시그가 개설되어 있습니다.",
    },
    {
      title: "세미나",
      description:
        "외부 기업인 또는 동아리원이 컴퓨터와 관련된 주제로 세미나를 개최합니다. 동아리원은 원하는 세미나를 듣거나 개최할 수 있습니다.",
    },
    {
      title: "모각코",
      description:
        "동아리원이 함께 조를 짜 특정 장소에 모여 각자 코딩을 하는 스터디 모임입니다.",
    },
    {
      title: "친목 활동",
      description:
        "동아리원끼리의 회식 비용 지원, MT, 번개 등 치목을 도모할 수 있는 다양한 활동을 실시하고 있습니다. 이와 함께 우수한 선배와의 교류 또한 지원하고 있습니다.",
    },
  ];
};

const ActivityNumberBlock = ({
  title,
  description,
}: {
  title: string;
  description: string | number;
}) => {
  return (
    <div className="HomeDescriptionActivityContainer">
      <p>{title}</p>
      <p className="HomeLargeText">{description}</p>
    </div>
  );
};

// TODO: Change data
const loadActivityNumberData = (): {
  title: string;
  description: string | number;
}[] => {
  return [
    {
      title: "총 부원 수",
      description: 1123,
    },
    {
      title: "개설된 SIG",
      description: 1010,
    },
    {
      title: "운영 기간",
      description: new Date().getFullYear() - 1984 + "년",
    },
  ];
};

const Arrow = ({
  width = "70px",
  height = "70px",
  rotate = "0deg",
  color = "#a7a7a7",
}: {
  width?: string | number;
  height?: string | number;
  rotate?: string;
  color?: string;
}) => {
  return (
    <svg
      width={width}
      height={height}
      style={{ transform: `rotate(${rotate})` }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.70711 9.71069C5.31658 10.1012 5.31658 10.7344 5.70711 11.1249L10.5993 16.0123C11.3805 16.7927 12.6463 16.7924 13.4271 16.0117L18.3174 11.1213C18.708 10.7308 18.708 10.0976 18.3174 9.70708C17.9269 9.31655 17.2937 9.31655 16.9032 9.70708L12.7176 13.8927C12.3271 14.2833 11.6939 14.2832 11.3034 13.8927L7.12132 9.71069C6.7308 9.32016 6.09763 9.32016 5.70711 9.71069Z"
        fill={color}
      />
    </svg>
  );
};
