// components/EditorSection.jsx
import Divider from "@/components/Divider";
import dynamic from "next/dynamic";
import { Controller } from "react-hook-form";
import { useRef } from "react";

const Editor = dynamic(() => import("../../app/sig/create/MDXEditor"), {
  ssr: false,
});

export default function EditorSection({ control }) {
  const editorRef = useRef(null);

  return (
    <>
      <Divider />
      <Controller
        name="editor"
        control={control}
        render={({ field }) => (
          <Editor
            editorRef={editorRef}
            markdown={field.value || "여기에 상세 소개를 작성해보세요."}
            onChange={() => {}}
          />
        )}
      />
      <Divider />
    </>
  );
}
