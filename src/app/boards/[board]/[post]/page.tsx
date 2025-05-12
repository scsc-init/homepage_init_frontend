import Comments from "@/components/comments/Comments";
import Post from "@/components/post/Post";
import BoardName from "./BoardName";

import "./Post.css";
import { CommentType, FrontendCommentType } from "@/interfaces/CommentType";

// TODO author 정보 받아와서 넣기
function reformComments(comments: CommentType[]) {
  const childPosts: number[][] = [];
  const postIdxToArrayIdx: { [key: number]: number } = {};
  const rootPostsIdx: number[] = [];
  for (let i = 0; i < comments.length; i++) {
    const comment = comments[i];
    if (comment.hidden) {
      continue;
    }
    if (comment.parent_id === 0) {
      rootPostsIdx.push(i);
      postIdxToArrayIdx[comment.id] = i;
    } else {
      if (!childPosts[postIdxToArrayIdx[comment.parent_id]]) {
        childPosts[postIdxToArrayIdx[comment.parent_id]] = [];
      }
      childPosts[postIdxToArrayIdx[comment.parent_id]].push(i);
    }
  }

  const finalComments: FrontendCommentType[] = [];
  for (let i = 0; i < rootPostsIdx.length; i++) {
    finalComments.push(comments[rootPostsIdx[i]] as FrontendCommentType);
    finalComments[finalComments.length - 1].is_child_comment = false;
    finalComments[finalComments.length - 1].comment_author = "응애";
    if (childPosts[rootPostsIdx[i]]) {
      for (let j = 0; j < childPosts[rootPostsIdx[i]].length; j++) {
        finalComments.push(
          comments[childPosts[rootPostsIdx[i]][j]] as FrontendCommentType
        );
        finalComments[finalComments.length - 1].is_child_comment = true;
        finalComments[finalComments.length - 1].comment_author = "응애";
      }
    }
  }

  return finalComments;
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

  const dummyPost = {
    id: 2,
    created_at: "2023-09-21T00:00:00.000Z",
    updated_at: "2023-09-21T00:00:00.000Z",
    title: "SCSC 회칙 안내",
    content: "1. 부원을 보면 응애라고 말한다.",
    hidden: false,
    user_id: 2,
  };

  const dummyComments = [
    {
      id: 3,
      created_at: "2023-09-21T00:00:00.000Z",
      updated_at: "2023-09-21T00:00:00.000Z",
      content: "응애...",
      hidden: false,
      user_id: 1,
      parent_id: 0,
      post_id: 2,
    },
    {
      id: 4,
      created_at: "2023-09-21T00:00:00.000Z",
      updated_at: "2023-09-21T00:00:00.000Z",
      content: "응애응애",
      hidden: false,
      user_id: 2,
      parent_id: 0,
      post_id: 2,
    },
    {
      id: 5,
      created_at: "2023-09-21T00:00:00.000Z",
      updated_at: "2023-09-21T00:00:00.000Z",
      content: "야옹",
      hidden: false,
      user_id: 2,
      parent_id: 3,
      post_id: 2,
    },
  ];

  const postTitle = dummyPost.title;
  // TODO: postAuthor는 유저 정보를 받아와야 함
  const postAuthor = "응애";
  const content = dummyPost.content;

  console.log(reformComments(dummyComments));

  return (
    <div id="PostContainer">
      <div id="Post">
        <BoardName boardName={dummyBoardGroup.boardTitle} />
        <Post postTitle={postTitle} postAuthor={postAuthor} content={content} />
        <Comments initialComments={reformComments(dummyComments)} />
      </div>
    </div>
  );
}
