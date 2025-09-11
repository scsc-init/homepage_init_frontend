// 로딩창의 레거시 버전입니다. 현재 로딩창은 프롬프트 스타일 디자인으로 변경했습니다. 그러나 다른 로딩 구현을 대비해 해당 파일을 유지해주십시오.

"use client";

import { useEffect, useState } from "react";

const codes = [
  `<span style="color:#569CD6;">#include</span> &lt;stdio.h&gt;
<span style="color:#4EC9B0;">int</span> main(void){
  <span style="color:#DCDCAA;">printf</span>("Hello, world!");
}`,
  `<span style="color:#569CD6;">#include</span> &lt;iostream&gt;
<span style="color:#4EC9B0;">int</span> main(void){
  std::<span style="color:#DCDCAA;">cout</span> &lt;&lt; "Hello, world!";
}`,
  `<span style="color:#569CD6;">using</span> System;
<span style="color:#4EC9B0;">class</span> Hello
{
  <span style="color:#569CD6;">static</span> <span style="color:#569CD6;">void</span> Main()
  {
    Console.<span style="color:#DCDCAA;">Write</span>("Hello, world!");
  }
}`,
  `<span style="color:#DCDCAA;">print</span>("Hello, world!")
<span style="color:#DCDCAA;">print</span>("Hello, SCSC!")
name = <span style="color:#DCDCAA;">input</span>("이름을 입력하세요: ")
<span style="color:#DCDCAA;">print</span>(f"안녕하세요, {name}님!")`,
];

export default function LoadingSpinner() {
  const [sampleCode] = useState(() => {
    const random_index = Math.floor(Math.random() * codes.length);
    return codes[random_index];
  });

  const [displayed, setDisplayed] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setDisplayed((prev) => {
        const next = sampleCode.slice(0, i++);
        if (i > sampleCode.length) clearInterval(typing);
        return next;
      });
    }, 30);

    return () => clearInterval(typing);
  }, [sampleCode]);

  useEffect(() => {
    const cursorBlink = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorBlink);
  }, []);

  return (
    <div className="LoadingCodeWrapper">
      <pre
        className="LoadingCodeBlock"
        dangerouslySetInnerHTML={{
          __html:
            displayed + `<span class="Cursor">${showCursor ? "|" : " "}</span>`,
        }}
      ></pre>
      <p className="LoadingText">Compiling...</p>
    </div>
  );
}
