'use client';

export default function CopyButtonKakao() {


    return (
    <button onClick={() => navigator.clipboard.writeText("https://invite.kakao.com/tc/II2yiLsQhY")} className="copy-kakao-link">
    🔗COPY
    </button>
  );
}