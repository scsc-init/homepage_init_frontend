"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "@/app/board/[id]/create/page.css";

const Editor = dynamic(() => import("@/components/board/EditorWrapper"), {
  ssr: false,
});

export default function CreateBoardArticleClient({ boardId }) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      title: "",
      editor: "여기에 게시글 내용을 작성해주세요.",
    },
  });

  const router = useRouter();
  const content = watch("editor");
  const [submitting, setSubmitting] = useState(false);
  const [boardInfo, setBoardInfo] = useState(null);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push("/login");
    }

    fetch(`http://localhost:8080/api/board/${boardId}`, {
      headers: { "x-api-secret": "some-secret-code" },
    })
      .then((res) =>
        res.ok
          ? res.json()
          : Promise.reject("게시판 정보를 불러올 수 없습니다."),
      )
      .then((data) => setBoardInfo(data))
      .catch((err) => {
        console.error(err);
        alert("게시판 정보를 불러올 수 없습니다.");
      });
  }, [boardId, router]);

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:8080/api/article/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-secret": "some-secret-code",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.editor,
          board_id: parseInt(boardId),
        }),
      });

      if (res.status === 201) {
        alert("게시글 작성 완료!");
        router.push(`/board/${boardId}`);
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
