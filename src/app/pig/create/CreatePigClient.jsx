// app/pig/create/CreatePigClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import PigForm from "@/components/board/PigForm";
import Editor from "@/components/board/EditorWrapper.jsx";

export default function CreatePigClient() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      editor: "여기에 PIG 내용을 작성해주세요.",
    },
  });

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
      const res = await fetch("http://localhost:8080/api/pig/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.editor,
          year,
          semester,
        }),
      });

      if (res.status === 201) {
        alert("PIG 생성 성공!");
        router.push("/pig");
      } else {
        const err = await res.json();
        throw new Error(
          "PIG 생성 실패: " + (err.detail ?? JSON.stringify(err)),
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
    <div className="CreatePigContainer">
      <div className="CreatePigHeader">
        <h1 className="CreatePigTitle">PIG 생성</h1>
        <p className="CreatePigSubtitle">새로운 PIG를 만들어 보세요.</p>
      </div>
      <div className="CreatePigCard">
        <PigForm
          register={register}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          Editor={Editor}
        />
      </div>
    </div>
  );
}
