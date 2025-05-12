import Link from 'next/link';
import NextImageWrapper from '../image/NextImageWrapper';

import './PostSummary.css';

interface SimpleSimjiType {
  postTitle: string;
  createdAt: string;
  motherBoardType: string;
  motherBoardIdx?: number;
  postIdx: number;
}

export default function PostSummary({
  postTitle,
  createdAt,
  motherBoardType,
  motherBoardIdx,
  postIdx,
}: SimpleSimjiType) {
  let link = '';

  if (motherBoardType == 'simji') {
    link = `/simji-list/${motherBoardIdx}/${postIdx}`;
  } else {
    link = `/boards/${motherBoardIdx}/${postIdx}`;
  }
  return (
    <Link className="styled-link" href={link}>
      <div className="sim-wrapper">
        <div className="post-summary-title-wrapper">{postTitle}</div>
        <div className="post-summary-date-wrapper">{createdAt}</div>
        <div className="btn-wrapper">
          <NextImageWrapper
            src="/arrow_forward_ios.svg"
            alt="arrow"
          ></NextImageWrapper>
        </div>
      </div>
    </Link>
  );
}
