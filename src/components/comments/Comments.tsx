"use client";

import React from "react";
import { useEffect, useState } from "react";
import { CommentType, FrontendCommentType } from "../../interfaces/CommentType";
import OneComment from "./OneComment";
// import Button from '@/components/mantle-ui/components/button/Button';
// import TextArea from 'mantle-ui/components/textArea/TextArea';
import * as Button from "@/components/Button";

import dynamic from "next/dynamic";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";
import { goToSigList } from "@/util/navigation";
import { Controller, useForm } from "react-hook-form";
import { useLoginStore } from "@/state/LoginState";
import { useRouter } from "next/navigation";

import "./Comments.css";

const Editor = dynamic(() => import("./MDXEditor"), {
  ssr: false,
});

const ForwardRefEditor = React.forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />,
);

ForwardRefEditor.displayName = "ForwardRefEditor";

interface FormInputs {
  content: string;
}

export default function CommentsComponent({
  initialComments,
}: {
  initialComments: FrontendCommentType[];
}) {
  const router = useRouter();
  const loginStore = useLoginStore();

  const [comments, setComments] = useState<FrontendCommentType[]>([]);
  const [newComment, setNewComment] = useState("");

  const [parentCommentId, setParentCommentId] = useState<number | null>(null);

  // 0: not replying, otherwise: replying to comment with this id
  const [replyingCommentId, setReplyingCommentId] = useState<number>(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  useEffect(() => {
    setComments(initialComments);
  }, []);

  // TODO: reload comments when new comment is added. The page will do the reordering for you.
  const handleAddComment = () => {};

  const { register, control, handleSubmit } = useForm<FormInputs>({
    defaultValues: {
      content: "여기에 시그 설명을 작성해주세요",
    },
  });

  const onSubmit = async (data: FormInputs) => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_SERVER_URL + "/sig/create",
      {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: {
            login_token: loginStore.login_token,
          },
          sig: {
            content: data.content,
          },
        }),
      },
    );

    if (response.status === 200) {
      alert("시그가 성공적으로 생성되었습니다.");
      goToSigList();
    } else if (
      response.status === 400 &&
      (await response.json()).detail === "invalid_login_token"
    ) {
      loginStore.logout();
      router.push("/login");
    } else {
      alert("시그 생성에 실패했습니다.");
    }
  };

  const onInvalid = () => {
    alert("모든 항목이 기입되지 않았습니다.");
  };

  return (
    <div id="CommentsContainer">
      <div id="Comments">
        <div className="round-square-input"></div>
        <Controller
          name="content"
          control={control}
          rules={{ required: true }}
          render={({ field }) => {
            const { ref, ...restField } = field;
            return (
              <ForwardRefEditor markdown={restField.value} {...restField} />
            );
          }}
        />
        <div className="submit-button-wrapper">
          <Button.Root type="button" onClick={handleAddComment}>
            제출
          </Button.Root>
        </div>
        {comments.map(
          ({ content, comment_author, created_at, is_child_comment }, idx) => (
            <OneComment
              key={idx}
              content={content}
              comment_author={comment_author}
              created_at={created_at}
              is_child_comment={is_child_comment}
              changeParentCommentId={setParentCommentId}
            />
          ),
        )}
      </div>
    </div>
  );
}
