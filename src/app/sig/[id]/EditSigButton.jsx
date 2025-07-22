"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { minExecutiveLevel } from "@/util/constants";

export default function EditSigButton({ sigId }) {
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
    const fetchSig = async () => {
      const res = await fetch(`/api/sig/${sigId}`);
      const owner_id = (await res.json()).owner
      if (res.ok && user) {
        setIsOwner(user.id === owner_id);
        if (user.role >= minExecutiveLevel) setIsExecutive(true);
      }
    };
    fetchSig();
  }, [user]);

  const onClickEditBtn = async () => {
    router.push(`/sig/edit/${sigId}`);
  };

  return !user ? (
    ""
  ) : (isOwner === false && isExecutive === false) ? (
    ""
  ) : (
    <button onClick={onClickEditBtn}>내용 수정하기</button>
  );
}
