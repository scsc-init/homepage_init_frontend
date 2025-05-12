"use client";

import TimeGrid from "@/components/whenToMeet/TimeGrid";
import styles from "./page.module.css";
import { useState } from "react";

// export const metadata = {
//   title: "When2Meet Clone",
//   description: "A clone of When2Meet using Next.js 14",
// };

export default function HomePage() {
  const [isSelected, setIsSelected] = useState(
    Array.from({ length: 68 }, () => Array(7).fill(false))
  );

  console.log(isSelected);

  return (
    <div className={styles.container}>
      <h1>웬투밋</h1>
      <div className={styles.desc}>
        좌클릭한 채로 드래그하면 시간이 선택되고, 우클릭한 채로 드래그하면
        시간이 선택 해제됩니다.
      </div>
      <div>
        <TimeGrid checkState={isSelected} changeState={setIsSelected} />
      </div>
    </div>
  );
}
