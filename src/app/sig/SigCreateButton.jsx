"use client";

import { useRouter } from "next/navigation";
import * as Button from "@/components/Button";

export default function SigCreateButton() {
  const router = useRouter();

  return (
    <Button.Root
      id="SigCreateButton"
      onClick={() => router.push("/sig/create")}
    >
      시그 만들기
    </Button.Root>
  );
}
