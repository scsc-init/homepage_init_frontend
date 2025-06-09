"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SigForm from "@/components/sig/SigForm";

const Editor = dynamic(() => import("./MDXEditor"), { ssr: false });

export default function CreateSigClient({ userId }) {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content_src: "",
      editor: "여기에 상세 소개를 작성해보세요.",
    },
  });

  const router = useRouter();
  const editorRef = useRef(null);

  const inferSemester = (month) => {
    if ([2, 3, 4, 5].includes(month)) return 1;
    if ([6, 7, 8, 9, 10].includes(month)) return 2;
    return 1;
  };

  const onSubmit = async (data) => {
    const now = new Date();
    const year = now.getFullYear();
    const semester = inferSemester(now.getMonth() + 1);

    try {
      const res = await fetch("http://localhost:8080/api/sig/create", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": "some-secret-code",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content_src: data.content_src,
          year,
          semester,
          owner: userId,
        }),
      });

      if (res.status === 201) {
        alert("SIG 생성 성공!");
        router.push("/sig");
      } else if (res.status === 409) {
        alert("같은 이름의 SIG가 이미 존재합니다.");
      } else {
        const result = await res.json();
        alert("실패: " + (result.detail || "알 수 없는 오류"));
      }
    } catch (err) {
      alert("네트워크 오류");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">SIG 생성</h1>
      <SigForm
        register={register}
        control={control}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        Editor={Editor}
        editorRef={editorRef}
      />
    </div>
  );
}
