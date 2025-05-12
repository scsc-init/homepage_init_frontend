"use client";

import { Controller, useForm } from "react-hook-form";

import * as Input from "@/components/Input";
import Divider from "@/components/Divider";
import * as Button from "@/components/Button";

import "./EditPost.css";

interface Post {
  post_title: string;
  content: string;
}

export default function page() {
  const dummyBoardGroup = {
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

  // React Hook Form 이용해서 리팩토링하기
  const { register, control, handleSubmit } = useForm<Post>({
    defaultValues: {
      post_title: dummyBoardGroup.posts[0].postTitle,
      content: dummyBoardGroup.posts[0].content,
    },
  });

  const onSubmit = async (data: Post) => {};

  const onInvalid = () => {};

  return (
    <div id="PostFormContainer">
      <div id="PostForm">
        {/* <BoardNameComponent boardName={dummyBoardGroup.boardTitle} /> */}
        <div>
          <Input.Root>
            <Input.Label>제목</Input.Label>
            <Input.Input
              id="PostTitle"
              placeholder="제목"
              {...register("post_title")}
            />
          </Input.Root>
          <Divider />
        </div>
        <textarea className="round-text-area" placeholder="글 수정" />
        <Divider />
        <div id="PostFormButtons">
          <Button.Root>제출하기</Button.Root>
          <Button.Root>뒤로가기</Button.Root>
        </div>
      </div>
    </div>
  );
}
