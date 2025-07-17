// app/sig/create/CreateSigClient.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import SigForm from "@/components/board/SigForm";
import Editor from "@/components/board/EditorWrapper.jsx";

export default function CreateSigClient() {
  const [user, setUser] = useState();
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: "",
      description: "",
      editor: "여기에 SIG 내용을 작성해주세요.",
    },
  });

  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      });
      if (res.ok) setUser(await res.json());
    };
    fetchProfile();
  }, [router]);

  const inferSemester = (month) => {
    if ([2, 3, 4, 5].includes(month)) return 1;
    if ([6, 7, 8, 9, 10].includes(month)) return 2;
    return 1;
  };

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }

    if (!user) {
      alert("잠시 뒤 다시 시도해주세요")
    } else if (!user.discord_id) {
      if (!confirm("계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?")) return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const semester = inferSemester(now.getMonth() + 1);

    setSubmitting(true);

    try {
      const res = await fetch(`/api/sig/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">SIG 생성</h1>
        <p className="CreateSigSubtitle">새로운 SIG를 만들어 보세요.</p>
      </div>
      <div className="CreateSigCard">
        <SigForm
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
