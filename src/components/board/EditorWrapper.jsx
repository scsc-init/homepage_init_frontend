// components/sig/EditorWrapper.jsx
"use client";

import dynamic from "next/dynamic";

// ✅ 핵심: forwardRef: true 옵션
const Editor = dynamic(() => import("./MDXEditor.jsx"), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
  forwardRef: true,
});

export default Editor;
