'use client';

import Link from 'next/link';
import './not-found.css';

export default function NotFound() {
  const goBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <main className="NF_Root">
      <div className="NF_Backdrop" aria-hidden="true" />
      <section className="NF_Card" role="group" aria-labelledby="nf-title">
        <div className="NF_Badge" aria-hidden="true">
          404
        </div>
        <h1 id="nf-title" className="NF_Title">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="NF_Desc">요청하신 주소가 변경되었거나 존재하지 않습니다.</p>
        <div className="NF_Actions">
          <button className="NF_Button NF_Secondary" onClick={goBack}>
            ← 뒤로가기
          </button>
          <Link className="NF_Button" href="/" prefetch>
            홈으로 이동
          </Link>
        </div>
      </section>
    </main>
  );
}
