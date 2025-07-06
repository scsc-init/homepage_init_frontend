"use client";

import React, { useState } from "react";

const STATUS_MAP = {
  surveying: "설문중",
  recruiting: "모집중",
  active: "활동중",
  inactive: "비활성",
};

const TRANSITION_MAP = {
  inactive: ["surveying"],
  surveying: ["recruiting"],
  recruiting: ["active"],
  active: ["surveying", "inactive"],
};

const getNextStates = (current) => TRANSITION_MAP[current] || [];

export default function ScscStatusPanel({ scscGlobalStatus }) {
  const [currentStatus, setCurrentStatus] = useState(scscGlobalStatus);
  const [saving, setSaving] = useState(false);

  const handleSave = async (newStatus) => {
    const jwt = localStorage.getItem("jwt");
    setSaving(true);

    const res = await fetch(`/api/executive/scsc/global/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.status === 204) {
      alert("상태가 변경되었습니다.");
      setCurrentStatus(newStatus);
    } else {
      const error = await res.text();
      alert("업데이트 실패: " + error);
    }

    setSaving(false);
  };

  const nextStates = getNextStates(currentStatus);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <h2>SCSC 전체 상태 관리</h2>
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
            onClick={() => handleSave(status)}
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
    </div>
  );
}
