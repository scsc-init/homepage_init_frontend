"use client";

import { useRouter } from "next/navigation";
import * as Button from "@/components/Button";

export default function PigCreateButton() {
  const router = useRouter();

  return (
    <Button.Root
      id="PigCreateButton"
      onClick={() => router.push("/pig/create")}
    >
      시그 만들기
    </Button.Root>
  );
}
