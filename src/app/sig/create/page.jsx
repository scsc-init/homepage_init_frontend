"use client";

import React, { useEffect, useRef, useState } from "react";
import * as Input from "@/components/Input";
import * as Button from "@/components/Button";
import Divider from "@/components/Divider";
import { useForm, Controller } from "react-hook-form";
import { useLoginStore } from "@/state/LoginState";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import SigForm from "@/components/sig/SigForm";

const Editor = dynamic(() => import("./MDXEditor"), { ssr: false });

export default function CreateSigPage() {
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      content_src: "",
      editor: "여기에 상세 소개를 작성해보세요.",
    },
  });

  const loginStore = useLoginStore();
  const router = useRouter();
  const editorRef = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/user/profile", {
      method: "GET",
      credentials: "include",
      headers: {
        "x-api-secret": "some-secret-code",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          alert("로그인이 필요합니다.");
          router.push("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setUserId(data.id);
      })
      .catch((err) => {
        console.error("사용자 정보 로딩 실패:", err);
        alert("사용자 정보를 불러오지 못했습니다.");
        router.push("/login");
      });
  }, []);

  const inferSemester = (month) => {
    if ([2, 3, 4, 5].includes(month)) return 1;
    if ([6, 7, 8, 9, 10].includes(month)) return 2;
    return 1;
  };

  const onSubmit = async (data) => {
    if (!userId) {
      alert("로그인 정보가 없습니다.");
      return;
    }

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
        router.push("../sig");
      } else if (res.status === 409) {
        alert("같은 이름의 SIG가 이미 존재합니다.");
      } else if (res.status === 401) {
        alert("로그인이 필요합니다.");
        router.push("/login");
      } else {
        const result = await res.json();
        alert("실패: " + (result.detail || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("SIG 생성 중 에러:", err);
      alert("네트워크 오류");
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
