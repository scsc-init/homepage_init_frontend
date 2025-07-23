//components/board/Comments.jsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { minExecutiveLevel } from "@/util/constants";

function buildTree(flat) {
  const idMap = {};
  const rootNodes = [];
  flat.forEach(element => {
    element.children = [];
    idMap[element.id] = element;
  });
  flat.forEach(element => {
    if (!element.parent_id) rootNodes.push(element);
    else {
      const parent = idMap[element.parent_id];
      if (parent) parent.children.push(element);
    }
  });
  flat.forEach(element => {
    element.children.sort((a, b) => a.id - b.id);
  })
  rootNodes.sort((a, b) => a.id - b.id);
  return rootNodes;
}

function Comment({ comment, onReplySubmit, userId, userRole }) {
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("로그인이 필요합니다.");

    const res = await fetch("/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({
        article_id: comment.article_id,
        parent_id: comment.id,
        content: replyContent,
      }),
    });

    if (res.ok) {
      setReplyContent("");
      setShowReply(false);
      onReplySubmit();
    } else {
      alert("답글 작성 실패");
    }
  };

  const handleDeleteReply = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("로그인이 필요합니다.");

    if (userId===comment.author_id) {
      const res = await fetch(`/api/comments/${comment.id}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
      });

      if (res.status === 204) {
        alert("댓글 삭제 성공!")
        onReplySubmit();
      } else {
        alert("답글 삭제 실패");
      }
    } else {
      const res = await fetch(`/api/comments/${comment.id}/executive/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-jwt": jwt,
        },
      });

      if (res.status === 204) {
        alert("댓글 삭제 성공!")
        onReplySubmit();
      } else {
        alert("답글 삭제 실패");
      }
    }
  };

  return (
    <div style={{ marginLeft: comment.parent_id ? 20 : 0, marginTop: 10 }}>
      <div>{comment.content}</div>

      <button onClick={() => setShowReply(!showReply)}>
        {showReply ? "취소" : "답글 달기"}
      </button>

      {(userId===comment.author_id || userRole >= minExecutiveLevel) && (
        <button onClick={handleDeleteReply}>
          댓글 삭제
        </button>
      )}

      {showReply && (
        <div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button onClick={handleReply}>작성</button>
        </div>
      )}

      {comment.children?.length > 0 &&
        comment.children.map((child) => (
          <Comment key={child.id} comment={child} onReplySubmit={onReplySubmit} userId={userId} userRole={userRole}/>
        ))}
    </div>
  )
}

export default function Comments({articleId}) {
  const router = useRouter();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState(null);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [user, setUser] = useState();

  const fetchComments = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) { 
      alert("로그인이 필요합니다.");
      router.push("/us/login"); return;
    }
    try {
      const res = await fetch(`/api/comments/${articleId}`, {
        headers: { "x-jwt": jwt },
      });
      if (!res.ok) {setIsError(true); return;}
      const commentsData = await res.json();
      setComments(commentsData);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchProfile = async () => {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) { 
      alert("로그인이 필요합니다.");
      router.push("/us/login"); return;
    }

    const res = await fetch(`/api/user/profile`, {
      headers: { "x-jwt": jwt },
    });
    if (res.ok) setUser(await res.json());
    else router.push("/us/login");
  };

  useEffect(() => {
    fetchProfile();
    fetchComments();
  }, [router, articleId]);

  if (isError) return <div>댓글 불러오기 실패</div>;
  if (isLoading) return <div>불러오는 중...</div>;

  const commentsTree = buildTree(comments);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    const jwt = localStorage.getItem("jwt");
    if (!jwt) return alert("로그인이 필요합니다.");

    const res = await fetch("/api/comments/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
      body: JSON.stringify({
        article_id: articleId,
        parent_id: null,
        content: replyContent,
      }),
    });

    if (res.ok) {
      setReplyContent("");
      setShowReply(false);
      fetchComments();
    } else {
      alert("답글 작성 실패");
    }
  };

  return (
    <div>
      <button onClick={() => setShowReply(!showReply)}>
        {showReply ? "취소" : "댓글 달기"}
      </button>

      {showReply && (
        <div>
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button onClick={handleReply}>작성</button>
        </div>
      )}

      {comments?.length === 0 ? (
        <div>댓글이 없습니다.</div>
      ) : (!user) ? (
        <div>유저 확인 중...</div>
      ) : (
        commentsTree.map((comment) => (
          <Comment key={comment.id} comment={comment} onReplySubmit={fetchComments} userId={user.id} userRole={user.role}/>
        ))
      )}
    </div>
  );
}