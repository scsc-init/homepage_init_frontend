"use client";

import React, { useEffect, useState } from "react";
import * as Input from "@/components/Input";
import * as Button from "@/components/Button";
import Divider from "@/components/Divider";
import { useLoginStore } from "@/state/LoginState";
import { useRouter } from "next/navigation";

export default function SigListPage() {
  const router = useRouter();
  const loginStore = useLoginStore();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/sigs", {
          method: "GET",
          headers: {
            "x-api-secret": "some-secret-code",
          },
          credentials: "include",
        });

        if (res.status === 200) {
          const jsonData = await res.json();
          console.log("sig list 응답:", jsonData);
          setData(jsonData);
        } else if (res.status === 401 || res.status === 403) {
          loginStore.logout();
          router.push("/login");
        } else {
          const errorText = await res.text();
          console.error("응답 오류:", res.status, errorText);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div id="SigListContainer" className="p-6 max-w-4xl mx-auto">
      <div id="SigList">
        <h1 className="text-2xl font-bold mb-4">시그 리스트</h1>
        <Button.Root
          id="SigCreateButton"
          onClick={() => router.push("/sig/create")}
        >
          시그 만들기
        </Button.Root>
        <Divider />
        {data?.map((sig) => (
          <div key={sig.id} className="border rounded p-4 mb-4 bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{sig.title}</h2>
            </div>
            <p className="text-gray-700">{sig.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
