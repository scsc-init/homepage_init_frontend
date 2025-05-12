"use client";

import React, { useEffect } from "react";
import PostSummary from "./PostSummary";
import { PostTypeWithComments } from "@/interfaces/PostType";
// import BoardDropdown from "../mantle-ui/components/dropdown/Dropdown";
// import BoardPagination from "../mantle-ui/components/pagination/Pagination";
import Tag from "@/components/Tag";
import Divider from "@/components/Divider";
import Title from "@/components/Title";

import * as Select from "@/components/Select";

import "./Board.css";

interface BoardProps {
  boardName: string;
  posts: PostTypeWithComments[];
  boardType: string;
  boardIdx: number;
}

export default function Board({
  boardName,
  posts,
  boardType,
  boardIdx,
}: BoardProps) {
  const [sortingCriterion, setSortingCriterion] = React.useState("최신순");
  const [postsPerPage, setPostsPerPage] = React.useState(10);
  const [currPage, setCurrPage] = React.useState(1);

  // TODO 페이지 개수를 받아오고, 현재 페이지를 useEffect에서 초기화.
  useEffect(() => {
    console.log(sortingCriterion);
    console.log(postsPerPage);
    console.log(currPage);
  }, [sortingCriterion, postsPerPage, currPage]);

  return (
    <>
      <Title text={boardName} />
      <Divider />
      {/* <Title text={boardName} /> */}
      <div className="dropdown-wrapper">
        {/* <BoardDropdown
          subject="정렬"
          items={["최신순", "오래된순"]}
          onSelect={(item) => setSortingCriterion(item)}
        />
        <BoardDropdown
          subject="페이지 당 게시물 수"
          items={["10", "20", "30"]}
          onSelect={(item) => setPostsPerPage(Number(item))}
        /> */}
        <Select.Root onValueChange={(value) => setSortingCriterion(value)}>
          <Select.Trigger id="SortType" aria-label="Sort by Date">
            <Select.Value placeholder="정렬" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Item key="Recent" value="Recent">
              최신 순
            </Select.Item>
            <Select.Item key="Old" value="Old">
              오래된 순
            </Select.Item>
          </Select.Portal>
        </Select.Root>
        <Select.Root onValueChange={(value) => setPostsPerPage(Number(value))}>
          <Select.Trigger id="PostsPerPage" aria-label="Posts per Page">
            <Select.Value placeholder="페이지 당 게시물 수" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Item key="10" value="10">
              10
            </Select.Item>
            <Select.Item key="20" value="20">
              20
            </Select.Item>
            <Select.Item key="50" value="50">
              50
            </Select.Item>
          </Select.Portal>
        </Select.Root>
      </div>
      {posts.map((props: PostTypeWithComments, idx: number) => (
        <PostSummary
          key={idx}
          postTitle={props.postTitle}
          createdAt={props.createdAt}
          motherBoardType={boardType}
          motherBoardIdx={boardIdx}
          postIdx={props.id}
        />
      ))}
      {/* <BoardPagination
        totalPages={100}
        onPageChange={(page: number) => setCurrPage(page)}
      /> */}
    </>
  );
}
