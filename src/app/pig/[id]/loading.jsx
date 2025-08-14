// /app/pig/[id]/loading.jsx
"use client";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Loading() {
  return (
    <div className="PigDetailContainer" style={{ minHeight: "40vh" }}>
      <LoadingSpinner />
    </div>
  );
}
