// app/sig/edit/[id]/EditSigClient.jsx
"use client";

import Editor from "@/components/board/EditorWrapper.jsx";
import SigForm from "@/components/board/SigForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function EditSigClient({ sigId }) {
  const router = useRouter();
  const [user, setUser] = useState();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      editor: "",
    },
  });

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) { 
      alert("로그인이 필요합니다.");
      router.push("/us/login"); return;
    }

    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      });
      if (res.ok) setUser(await res.json());
      else router.push("/us/login");
    };
    fetchProfile();

    const fetchSigData = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/sig/${sigId}`, {
        headers: { "x-jwt": jwt },
      });

      if (!res.ok) {
        alert("시그 정보를 불러오지 못했습니다.");
        router.push("/sig");
      }

      const sig = await res.json();
      const articleRes = await fetch(`/api/article/${sig.content_id}`, {
        headers: { "x-jwt": jwt },
      });

      if (!articleRes.ok) {
        alert("시그 정보를 불러오지 못했습니다.");
        router.push("/sig");
      }
      const article = await articleRes.json();
      console.log(article);
      reset({
        title: sig.title ?? "",
        description: sig.description ?? "",
        editor: article.content ?? "",
      });
    };
    fetchSigData();
  }, [router]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    const handleRouteChange = (url) => {
      if (!isFormSubmitted.current && isDirty) {
        const confirmed = confirm(
          "작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?",
        );
        if (!confirmed) {
          router.events.emit("routeChangeError");
          throw "Route change aborted by user.";
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    router.events?.on?.("routeChangeStart", handleRouteChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      router.events?.off?.("routeChangeStart", handleRouteChange);
    };
  }, [isDirty]);

  const onSubmit = async (data) => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
      return;
    }

    if (!user) {
      alert("잠시 뒤 다시 시도해주세요");
    } else if (!user.discord_id) {
      if (
        !confirm(
          "계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?",
        )
      )
        return;
    }
    setSubmitting(true);

    try {
      console.log("Payload being sent:", {
        title: data.title,
        description: data.description,
        content: data.editor,
      });
      const res = await fetch(`/api/sig/${sigId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.editor,
        }),
      });

      if (res.status === 204) {
        alert("SIG 수정 성공!");
        router.push("/sig");
      } else {
        const err = await res.json();
        console.log(err);
        alert("SIG 수정 실패: " + (err.detail ?? JSON.stringify(err)));
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
        <h1 className="CreateSigTitle">SIG 수정</h1>
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
