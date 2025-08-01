// app/pig/create/CreatePigClient.jsx
"use client";

import Editor from "@/components/board/EditorWrapper.jsx";
import PigForm from "@/components/board/PigForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";

export default function CreatePigClient() {
  const router = useRouter();
  const [user, setUser] = useState();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const saved =
    typeof window !== "undefined" ? sessionStorage.getItem("pigForm") : null;
  const parsed = saved ? JSON.parse(saved) : null;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: parsed || {
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
  }, [router]);

  const watched = watch();
  useEffect(() => {
    if (!isFormSubmitted.current) {
      sessionStorage.setItem("pigForm", JSON.stringify(watched));
    }
  }, [watched]);

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
      const res = await fetch(`/api/pig/create`, {
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

      if (res.status === 201) {
        alert("PIG 생성 성공!");
        isFormSubmitted.current = true;
        router.push("/pig");
        router.refresh();
      } else {
        const err = await res.json();
        alert("PIG 생성 실패: " + (err.detail ?? JSON.stringify(err)));
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
