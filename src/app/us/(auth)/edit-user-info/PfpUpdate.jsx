"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PfpUpdate() {
  const [mode, setMode] = useState("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setPreview(inputUrl || null);
  };

  const handleSubmit = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      alert("로그인이 필요합니다.");
      router.push('/us/login')
      return;
    }

    if (mode === "url" && url) {
      const res = await fetch('/api/user/update', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
        body: JSON.stringify({
          profile_picture: url,
          profile_picture_is_url: true,
        }),
      });
      alert(res.status===204 ? "변경 완료" : `변경 실패`);
      router.push('/about/my-page');

    } else if (mode === "file" && file) {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch('/api/user/update-pfp-file', {
        method: "POST",
        headers: { "x-jwt": jwt },
        body: form,
      });
      alert(res.status===204 ? "변경 완료" : `변경 실패`);
      router.push('/about/my-page');
    }
  };

  return (
    <div style={{"marginTop": "1rem", "marginBottom": "1rem"}}>
      <p style={{"marginBottom": ".5rem", "fontWeight": "bold"}}>프로필 사진 변경</p>
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="url"
            checked={mode === "url"}
            onChange={() => setMode("url")}
            style={{marginRight: "2px"}}
          />
          URL 입력
        </label>
        <label style={{ marginLeft: "1rem" }}>
          <input
            type="radio"
            name="mode"
            value="file"
            checked={mode === "file"}
            onChange={() => setMode("file")}
            style={{marginRight: "2px"}}
          />
          이미지 업로드
        </label>
      </div>

      {mode === "url" && (
        <input
          type="text"
          placeholder="이미지 URL 입력"
          value={url}
          onChange={handleUrlChange}
          style={{ width: "100%", marginTop: "1rem" }}
        />
      )}

      {mode === "file" && (
        <input
          type="file"
          accept="image/"
          onChange={handleFileChange}
          style={{ marginTop: "1rem" }}
        />
      )}

      {preview && (
        <div style={{ marginTop: "1rem" }}>
          <img
            src={preview}
            alt="Preview"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
      )}

      <button
        onClick={handleSubmit}
        style={{ marginTop: ".5rem", padding: "0.5rem 1rem" }}
      >
        저장
      </button>
    </div>
  );
}
