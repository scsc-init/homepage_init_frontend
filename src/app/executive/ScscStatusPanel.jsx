"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const SEMESTER_MAP = {
  1: "1",
  2: "여름",
  3: "2",
  4: "겨울",
}

const STATUS_MAP = {
  surveying: "설문중",
  recruiting: "모집중",
  active: "활동중",
  inactive: "비활성",
};

const TRANSITION_MAP_REGULAR = {
  inactive: ["surveying"],
  surveying: ["recruiting"],
  recruiting: ["active"],
  active: ["surveying"],
};

const TRANSITION_MAP_SEASONAL = {
  inactive: ["surveying"],
  surveying: ["recruiting"],
  recruiting: ["active"],
  active: ["inactive"],
};

const REQUIRED_PHRASE = "confirm change";

const getNextStates = (current, semester) => (semester%2===1) ? (TRANSITION_MAP_REGULAR[current] || []) : (TRANSITION_MAP_SEASONAL[current] || [])

export default function ScscStatusPanel({ scscGlobalStatus, semester, year }) {
  const [currentStatus, setCurrentStatus] = useState(scscGlobalStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");

  const saveToModal = (status) => {
    setSelectedStatus(status);
    setConfirmationText("");
    setModalOpen(true);
  };

  const handleConfirmSave = async () => {
    const jwt = localStorage.getItem("jwt");
    setSaving(true);

    const res = await fetch(`/api/executive/scsc/global/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({ status: selectedStatus }),
    });

    if (res.status === 204) {
      alert("상태가 변경되었습니다.");
      setCurrentStatus(selectedStatus);
      router.refresh();
    } else {
      const error = await res.text();
      alert("업데이트 실패: " + error);
    }

    setSaving(false);
    setModalOpen(false);
  };

  const nextStates = getNextStates(currentStatus, semester);

  return (
    <>
    {modalOpen && (
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex",
        alignItems: "center", justifyContent: "center", zIndex: 1000
      }}>
        <div style={{
          background: "white", padding: "2rem", borderRadius: "8px", maxWidth: "400px",
          display: "flex", flexDirection: "column", gap: "1rem"
        }}>
          <h3>상태 변경 확인</h3>
          <p>다음 문구를 입력해야 변경됩니다:</p>
          <pre style={{ background: "#eee", padding: "0.5rem" }}>{REQUIRED_PHRASE}</pre>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="확인 문구 입력"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
            <button onClick={() => setModalOpen(false)}>취소</button>
            <button
              onClick={handleConfirmSave}
              disabled={confirmationText !== REQUIRED_PHRASE || saving}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    )}

    <div style={{ marginBottom: "2rem" }}>
      <h2>SCSC 전체 상태 관리</h2>
      {!currentStatus ? (<div>상태를 불러오지 못했습니다.</div>) : (
        <div>
          <div>{year}년 {SEMESTER_MAP[semester]}학기</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              {STATUS_MAP[currentStatus] || currentStatus}
            </div>
            <span style={{ fontSize: "1.2rem" }}>→</span>
            {nextStates.map((status) => (
              <button
                key={status}
                onClick={() => saveToModal(status)}
                disabled={saving}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  background: "#f0f0f0",
                  cursor: "pointer",
                }}
              >
                {STATUS_MAP[status]}
              </button>
            ))}
          </div>
        </div>)}
    </div>
    </>
  );
}
