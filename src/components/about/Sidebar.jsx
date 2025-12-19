'use client';

import { scrollToId } from './ScrollToID';
import styles from '@/app/about/about.module.css';

export default function ClientSidebar({ className }) {
  return (
    <aside className={`${styles.hideOnMobile} ${className || ''}`}>
      <ul>
        <li>
          <a
            href="#scsc"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('scsc');
            }}
          >
            SCSC
          </a>
        </li>
        <li>
          <a
            href="#activities"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('activities');
            }}
          >
            활동
          </a>
        </li>
        <li>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('faq');
            }}
          >
            자주 묻는 질문
          </a>
        </li>
        <li>
          <a
            href="#clubroom"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('clubroom');
            }}
          >
            동아리 시설
          </a>
        </li>
        <li>
          <a
            href="#more"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('more');
            }}
          >
            더 알아보기
          </a>
        </li>
      </ul>
    </aside>
  );
}
