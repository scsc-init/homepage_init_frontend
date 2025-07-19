"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "@/app/board/[id]/create/page.css";

const Editor = dynamic(() => import("@/components/board/EditorWrapper"), {
  ssr: false,
});

export default function CreateBoardArticleClient({ boardInfo }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.replace("/us/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user/profile", {
          headers: { "x-jwt": jwt },
        });

        if (!res.ok) {
          localStorage.removeItem("jwt");
          router.replace("/us/login");
          return;
        }

        const user = await res.json();

        if (user.role < boardInfo.writing_permission_level) {
          alert("이 게시판에 글을 작성할 권한이 없습니다.");
          router.replace("/");
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error("유저 인증 실패", err);
        router.replace("/us/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [boardInfo.writing_permission_level, router]);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      editor: "여기에 게시글 내용을 작성해주세요.",
    },
  });

  const content = watch("editor");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/article/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(boardInfo.id),
        }),
      });

      if (res.status === 201) {
        alert("게시글 작성 완료!");
        router.push(`/board/${boardInfo.id}`);
      } else {
        const err = await res.json();
        throw new Error("작성 실패: " + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || "네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">
          {boardInfo ? `${boardInfo.name}에 게시글 작성` : "게시글 작성"}
        </h1>
        <p className="CreateSigSubtitle">
          {boardInfo?.description ?? "게시판 정보를 불러오는 중..."}
        </p>
      </div>

      <div className="CreateSigCard space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            {...register("title", { required: true })}
            placeholder="제목을 입력하세요"
            className="w-full border p-2 rounded"
          />

          <Editor
            markdown={content}
            onChange={(value) => setValue("editor", value)}
          />

          <button type="submit" className="SigCreateBtn" disabled={submitting}>
            {submitting ? "작성 중..." : "작성 완료"}
          </button>
        </form>
      </div>
    </div>
  );
}
