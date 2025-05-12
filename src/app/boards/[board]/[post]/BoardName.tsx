"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import "./BoardName.css";

interface BoardNameType {
  boardName: string;
}

export default function BoardName({ boardName }: BoardNameType) {
  // TODO 여러가지 백엔드와의 통신...
  const params = useParams();
  let truncatedSimjiName = "";
  if (boardName.length > 15) {
    truncatedSimjiName = boardName.slice(15) + "...";
  } else {
    truncatedSimjiName = boardName;
  }
  return (
    <Link href={`/boards/${params.board}`} className="styled-link">
      <div className="simji-name-wrapper">{truncatedSimjiName}</div>
    </Link>
  );
}
