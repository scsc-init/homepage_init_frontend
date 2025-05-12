"use client";

import { useParams } from "next/navigation";
import Board from "@/components/board/Board";

import "./BoardWithRouter.css";
import * as Button from "@/components/Button";

export default function BoardWithRouter() {
  const postDataTemp = {
    id: 1,
    createdAt: "2023-09-21T00:00:00.000Z",
    updatedAt: "2023-09-21T00:00:00.000Z",
    boardPhase: "DRAFT",
    boardTitle: "공지",
    ownerId: null,
    owner: null,
    posts: [
      {
        id: 1,
        createdAt: "2023-09-21T00:00:00.000Z",
        updatedAt: "2023-09-21T00:00:00.000Z",
        postPhase: "DRAFT",
        postTitle: "동방 쓰레기 제대로 버리세요;;",
        content: "응애응애",
        postAuthorId: 1,
        boardId: 1,
        postAuthor: "김태욱",
        comments: [
          {
            content: "죄송합니다...",
            commentAuthor: "오현우",
            createdAt: "2023-09-21T00:00:00.000Z",
            updatedAt: "2023-09-21T00:00:00.000Z",
            childComments: [
              {
                content: "ㄱㅊㄱㅊ",
                commentAuthor: "김태욱",
                createdAt: "2023-09-21T00:00:00.000Z",
                updatedAt: "2023-09-21T00:00:00.000Z",
                childComments: [],
              },
            ],
          },
        ],
      },
      {
        id: 2,
        createdAt: "2023-09-21T00:00:00.000Z",
        updatedAt: "2023-09-21T00:00:00.000Z",
        postPhase: "DRAFT",
        postTitle: "SCSC 회칙 안내",
        content: "1. 부원을 보면 응애라고 말한다.",
        postAuthorId: 2,
        boardId: 1,
        postAuthor: "응애",
        comments: [
          {
            content: "응애...",
            commentAuthor: "오현우",
            createdAt: "2023-09-21T00:00:00.000Z",
            updatedAt: "2023-09-21T00:00:00.000Z",
            childComments: [
              {
                content: "응애응애",
                commentAuthor: "아가",
                createdAt: "2023-09-21T00:00:00.000Z",
                updatedAt: "2023-09-21T00:00:00.000Z",
                childComments: [],
              },
            ],
          },
          {
            content: "야옹",
            commentAuthor: "아가",
            createdAt: "2023-09-21T00:00:00.000Z",
            updatedAt: "2023-09-21T00:00:00.000Z",
            childComments: [],
          },
        ],
      },
    ],
    simji: false,
    sig: null,
  };

  // TODO 여러 가지 백엔드 관련된 것들
  const params = useParams();
  return (
    <div id="BoardContainer">
      <div id="Board">
        <div className="button-flex">
          <div className="submit-button-wrapper">
            {/* <Button style={{ width: "100%" }}>제출</Button> */}
            <Button.Root type="button" onClick={() => {}}>
              글쓰기
            </Button.Root>
          </div>
        </div>
        <Board
          boardName={postDataTemp.boardTitle}
          posts={postDataTemp.posts}
          boardType="normal"
          boardIdx={parseInt(
            typeof params.board === "string" ? params.board : ""
          )}
        />
      </div>
    </div>
  );
}
