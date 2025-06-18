"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
import SigForm from "@/components/sig/SigForm";

const Editor = dynamic(() => import("./MDXEditor.jsx"), { ssr: false });

export default function CreateSigClient() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      editor: "여기에 SIG 내용을 작성해주세요.",
    },
  });

  const editorRef = useRef();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }
  }, [router]);

  const inferSemester = (month) => {
    if ([2, 3, 4, 5].includes(month)) return 1;
    if ([6, 7, 8, 9, 10].includes(month)) return 2;
    return 1;
  };

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const semester = inferSemester(now.getMonth() + 1);

    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/sig/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.editor, // ✅ 여기서 직접 보내줌!
          year,
          semester,
        }),
      });

      if (res.status === 201) {
        alert("SIG 생성 성공!");
        router.push("/sig");
      } else {
        const err = await res.json();
        throw new Error(
          "SIG 생성 실패: " + (err.detail ?? JSON.stringify(err)),
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message || "네트워크 오류");
    } finally {
      setSubmitting(false);
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
