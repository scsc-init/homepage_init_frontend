"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "./page.css";

const Editor = dynamic(() => import("@/components/board/EditorWrapper"), {
  ssr: false,
});

export default function FundApplyClient({ boardInfo, sigs, pigs }) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      category: "",
      target: "",
      amount: "",
      editor: "",
      checked: false,
    },
  });

  const router = useRouter();
  const content = watch("editor");
  const category = watch("category");
  const isChecked = watch("checked");

  const [user, setUser] = useState(null);
  const [targetList, setTargetList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const isFormSubmitted = useRef(false);

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return router.push("/us/login");

    fetch("/api/user/profile", {
      headers: { "x-jwt": jwt },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => router.push("/us/login"));
  }, [router]);

  useEffect(() => {
    if (category === "sig") setTargetList(sigs);
    else if (category === "pig") setTargetList(pigs);
    else setTargetList([]);
  }, [category, sigs, pigs]);

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
    if (!user) return alert("사용자 정보를 불러올 수 없습니다.");
    const jwt = localStorage.getItem("jwt");
    setSubmitting(true);

    const summary = `
신청 시그 : ${data.target} \n
신청 금액 : ${data.amount} 원 \n
신청자 : ${user.student_id} ${user.name} (${user.email}) \n
신청 사유 :
${data.editor}
`.trim();

    try {
      const res = await fetch("/api/article/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          title: `${data.target} 지원금 신청`,
          content: summary,
          board_id: parseInt(boardInfo.id),
        }),
      });

      if (res.status === 201) {
        isFormSubmitted.current = true;
        alert("신청 완료!");
        router.push("/us/contact");
      } else {
        const err = await res.json();
        throw new Error("신청 실패: " + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || "네트워크 오류");
    } finally {
      setSubmitting(false);
    }
  };

  if (!boardInfo?.id) {
    console.error("boardInfo가 유효하지 않음:", boardInfo);
    return null;
  }

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">지원금 신청</h1>
        <p className="CreateSigSubtitle">{boardInfo?.description ?? ""}</p>
      </div>

      <div className="CreateSigCard space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <select
            {...register("category")}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">SIG/PIG 선택</option>
            <option value="sig">SIG</option>
            <option value="pig">PIG</option>
          </select>

          <select
            {...register("target")}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">대상 선택</option>
            {targetList.length === 0 ? (
              <option disabled>목록이 없습니다</option>
            ) : (
              targetList.map((item) => (
                <option key={item.id} value={item.title}>
                  {item.title}
                </option>
              ))
            )}
          </select>

          <input
            type="number"
            {...register("amount", { required: true, min: 1 })}
            placeholder="신청 금액 (숫자만)"
            className="w-full border p-2 rounded"
          />

          <Editor
            markdown={content}
            onChange={(value) => setValue("editor", value)}
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register("checked", { required: true })}
            />
            <span>SCSC 지원 가이드라인을 확인했습니다.</span>
          </label>

          <button
            type="submit"
            className="SigCreateBtn"
            disabled={submitting || !isChecked}
          >
            {submitting ? "신청 중..." : "신청하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
