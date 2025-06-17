"use client";

import { useEffect } from "react";
import Image from "next/image";
import "./page.css";

export default function Home() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );

    const fadeElements = document.querySelectorAll(".FadeOnScroll");
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const year = new Date().getFullYear() - 1984;

  return (
    <div id="Home">
      <div id="HomeContent">
        <div id="HomeDescriptionContainer" className="FadeOnScroll">
          <h2>SCSC는 이러한 활동을 합니다</h2>
          <div className="ActivityBlock">
            <h3>SIG</h3>
            <p>
              특정 주제에 관심이 있는 동아리원이 모여 함께 공부하는 모임입니다.
              그룹스터디, 리드스터디, 프로젝트 유형 등 여러 종류의 시그가
              개설되어 있습니다.
            </p>
          </div>
          <div className="ActivityBlock">
            <h3>세미나</h3>
            <p>
              외부 기업인 또는 동아리원이 컴퓨터와 관련된 주제로 세미나를
              개최합니다. 동아리원은 원하는 세미나를 듣거나 개최할 수 있습니다.
            </p>
          </div>
          <div className="ActivityBlock">
            <h3>PIG</h3>
            <p>
              본격적인 프로젝트와 팀 활동을 진행합니다. 홈페이지 관리를 담당하는
              INIT 등이 있습니다. 학습 중심인 SIG보다 결과물 완성을 목표로 하는
              모임입니다.
            </p>
          </div>
          <div className="ActivityBlock">
            <h3>친목 활동</h3>
            <p>
              동아리원끼리의 회식 비용 지원, MT, 번개 등 친목을 도모할 수 있는
              다양한 활동을 실시하고 있습니다. 이와 함께 우수한 선배와의 교류
              또한 지원하고 있습니다.
            </p>
          </div>
        </div>

        <div id="HomeDescriptionContainer" className="FadeOnScroll">
          <div className="HomeDescriptionTitle">
            <h2>1984년부터 이어져 온</h2>
            <h2>서울대학교 대표 중앙 컴퓨터 동아리</h2>
          </div>
          <div className="HomeDescriptionActivityContainer">
            <p>총 부원 수</p>
            <p className="HomeLargeText">1557</p>
          </div>
          <div className="HomeDescriptionActivityContainer">
            <p>개설된 SIG</p>
            <p className="HomeLargeText">1010</p>
          </div>
          <div className="HomeDescriptionActivityContainer">
            <p>운영 기간</p>
            <p className="HomeLargeText">{year}년</p>
          </div>
        </div>

        <div id="HomeClubroomContainer" className="FadeOnScroll">
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
                image: "/img4.jpg",
              },
              {
                title: "게임기",
                description: "닌텐도 스위치, 프로콘, ps4",
                image: "/img4.jpg",
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

        <div id="HomeAboutContainer" className="FadeOnScroll">
          <h2>SCSC에 대해 더 알아보고 싶다면?</h2>
          <div id="HomeAboutLinkList">
            {[
              {
                title: "리크루팅 정보 바로가기",
                url: "/contact",
                external: false,
              },
              {
                title: "시그 목록 바로가기",
                url: "/sig",
                external: false,
              },
              {
                title: "피그 목록 바로가기",
                url: "/pig",
                external: false,
              },
              {
                title: "공식 인스타그램",
                url: "https://www.instagram.com/scsc_snu/?hl=ko",
                external: true,
              },
              {
                title: "공식 깃허브",
                url: "https://github.com/SNU-SCSC",
                external: true,
              },
            ].map(({ title, url, external }, id) =>
              external ? (
                <a
                  key={id}
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
              ) : (
                <div
                  key={id}
                  className="HomeAboutDescription"
                  onClick={() => (window.location.href = url)}
                >
                  <span>{title}</span>
                  <Arrow
                    width="25px"
                    height="25px"
                    rotate="-90deg"
                    color="#070707"
                  />
                </div>
              ),
            )}
          </div>
        </div>

        <div id="HomeFQAContainer" className="FadeOnScroll">
          <h2>자주 묻는 질문</h2>
          {[
            {
              question: "동아리 활동에 어느 정도의 시간을 할애해야 하나요?",
              answer:
                "부담 정도는 개인에 따라 다르게 느껴질 수 있지만, 일주일에 적어도 1~2일은 투자해야 합니다. SCSC의 가장 주요한 활동인 SIG는 현재 13개입니다. 시그 가입 개수에 대한 제한은 없으며, 대부분 시그원끼리 시간을 조정하여 주 1~2회 시그를 진행합니다. 그외에도 주간 시그 보고회, 해커톤, 비정기 세미나가 진행되기도 합니다. 따라서 최소한 일주일에 1~2일, 활동량에 따라 그 이상의 시간이 필요할 수 있습니다.",
            },
            {
              question: "가입할 수 있는 회원에 제한이 있나요?",
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
          ].map(({ question, answer }, id) => {
            const inputId = `faq_${id}`;
            return (
              <label key={id} className="HomeFQA" htmlFor={inputId}>
                <div className="HomeFQAQuestion">
                  <h4>{question}</h4>
                  <Arrow width="20px" height="20px" color="#070707" />
                </div>
                <input id={inputId} type="checkbox" />
                <div className="HomeFQAHidden">{answer}</div>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Arrow({
  width = "70px",
  height = "70px",
  rotate = "0deg",
  color = "#a7a7a7",
}) {
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
}
