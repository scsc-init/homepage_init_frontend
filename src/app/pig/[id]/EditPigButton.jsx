"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { minExecutiveLevel } from "@/util/constants";

export default function EditPigButton({ pigId }) {
  const [isOwner, setIsOwner] = useState(false);
  const [isExecutive, setIsExecutive] = useState(false);
  const [user, setUser] = useState();
  const router = useRouter();

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      router.push("/us/login");
    }

    const fetchProfile = async () => {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) return;

      const res = await fetch(`/api/user/profile`, {
        headers: { "x-jwt": jwt },
      });
      if (res.ok) {
        setUser(await res.json());
      }
    };
    fetchProfile();
  }, [router]);

  useEffect(() => {
    const fetchPig = async () => {
      const res = await fetch(`/api/pig/${pigId}`);
      const owner_id = (await res.json()).owner
      if (res.ok && user) {
        setIsOwner(user.id === owner_id);
        if (user.role >= minExecutiveLevel) setIsExecutive(true);
      }
    };
    fetchPig();
  }, [user]);

  const onClickEditBtn = async () => {
    router.push(`/pig/edit/${pigId}`);
  };

  return !user ? (
    ""
  ) : (isOwner === false && isExecutive === false) ? (
    ""
  ) : (
    <button onClick={onClickEditBtn}>내용 수정하기</button>
  );
}
