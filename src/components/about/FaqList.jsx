'use client';

import { useRef, useState } from 'react';
import Arrow from './Arrow';
import './faq.css';

export default function FaqList() {
  const faqs = [
    {
      question: '동아리 활동에 어느 정도의 시간을 할애해야 하나요?',
      answer:
        '부담 정도는 개인에 따라 다르게 느껴질 수 있지만, 일주일에 적어도 1~2일은 투자해야 합니다. SCSC의 가장 주요한 활동인 SIG는 현재 13개입니다. 시그 가입 개수에 대한 제한은 없으며, 대부분 시그원끼리 시간을 조정하여 주 1~2회 시그를 진행합니다. 그외에도 주간 시그 보고회, 해커톤, 비정기 세미나가 진행되기도 합니다. 따라서 최소한 일주일에 1~2일, 활동량에 따라 그 이상의 시간이 필요할 수 있습니다.',
    },
    {
      question: '가입할 수 있는 회원에 제한이 있나요?',
      answer:
        '단과대와 학번에 관계 없이, 컴퓨터 공학과 프로그래밍에 관심이 있는 서울대학교 학생 누구나 참여하실 수 있습니다. 휴학생, 대학원생 모두 가입가능합니다. 실력에 관계 없이 활동 가능하므로 많은 지원 부탁드립니다.',
    },
    {
      question: '모집기간이 지나면 가입할 수 없나요?',
      answer:
        'SCSC는 상시모집을 원칙으로 하므로 공식 모집 기간이 지난 후에도 가입이 가능합니다! 다만, 공식 일정이 모집 직후부터 진행되므로 짝선짝후, SIG, 개강총회 등의 활동에 참여하기 어려울 수 있습니다.',
    },
    {
      question: '코딩을 잘 하지 못하는데 괜찮나요?',
      answer:
        '물론 괜찮습니다. 기초 프로그래밍을 배우는 SIG가 매학기 개설되어 있으므로 끝까지 따라오기만 한다면 충분히 컴퓨터에 익숙해질 수 있습니다.',
    },
    {
      question: '회비는 얼마이며, 어떤 곳에 사용되나요?',
      answer:
        '회비는 한 학기 당 2.5만원입니다. 회비 사용 내역은 종강총회일에 투명하게 공개합니다. 주로 시그 활동 지원비, 회식비, 컴퓨터 관련 물품 구매 비용 등으로 사용합니다.',
    },
    {
      question: 'SIG란 무엇인가요?',
      answer:
        'SIG는 특정 주제에 관심 있는 동아리원이 모여 함께 같은 주제를 공부하는 SIG입니다. 지난 년도에는 그룹스터디형 SIG로 각 언어(C++, 파이썬, 러스트 등), 웹(프론트엔드, 백엔드), 알고리즘, 머신러닝, 딥러닝 스터디 등이 개설되었으며 딥러닝, 알고리즘 등의 SIG는 수준별로 난이도를 나누어 진행하였습니다.',
    },
  ];

  const [openIdx, setOpenIdx] = useState(null);
  const contentRefs = useRef([]);

  const toggle = (idx) => {
    setOpenIdx((prev) => (prev === idx ? null : idx));
  };

  return (
    <div id="HomeFQAContainer">
      <h2>자주 묻는 질문</h2>
      {faqs.map((faq, idx) => (
        <div className="HomeFQA" key={idx}>
          <button
            className="HomeFQAQuestion"
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
          >
            <h4>{faq.question}</h4>
            <Arrow
              width="20px"
              height="20px"
              color="var(--foreground-color)"
              rotate={openIdx === idx ? '180deg' : '0deg'}
            />
          </button>

          <div
            className="HomeFQAHiddenJS"
            ref={(el) => (contentRefs.current[idx] = el)}
            style={{
              height: openIdx === idx ? `${contentRefs.current[idx]?.scrollHeight}px` : '0px',
            }}
          >
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
