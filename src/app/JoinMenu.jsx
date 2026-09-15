'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

const MENUS = [
  { label: 'About', href: '/about' },
  {
    label: 'SIG/PIG',
    children: [
      { label: 'SIG', href: '/sig' },
      { label: 'PIG', href: '/pig' },
    ],
  },
  { label: 'Contact', href: '/us/contact' },
];

const VB_W = 1000;
const WORD_SIZE = 150;
const BASELINE = 158;
const WORD_H = 196;

const WORD_RIGHT = VB_W - 12;
const BRANCH_SPAN = 260;
const DOT_R = 11;

const TWIG_END = WORD_RIGHT - DOT_R;
const STUB = 26;

const FIRST_GAP = 74;
const ROW_GAP = 72;
const NOMINAL_ANCHOR_Y = 106;
const TREE_H = NOMINAL_ANCHOR_Y + FIRST_GAP + ROW_GAP + 52;

const rowY = (anchorY, index) => anchorY + FIRST_GAP + index * ROW_GAP;

const DASH = 420;

export default function JoinMenu() {
  const rootRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const [openLabel, setOpenLabel] = useState(null);
  const [anchors, setAnchors] = useState({});
  const textRefs = useRef({});
  const restoreScroll = useRef(null);

  const measure = useCallback(() => {
    const next = {};
    for (const [label, node] of Object.entries(textRefs.current)) {
      if (!node) continue;
      try {
        const box = node.getBBox();
        next[label] = {
          x: box.x + box.width,
          y: box.y + box.height * 0.52,
        };
      } catch {}
    }
    setAnchors(next);
  }, []);

  useEffect(() => {
    measure();
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  useEffect(() => () => restoreScroll.current?.(), []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setEntered(true);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -15% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const suppressSmoothScroll = () => {
    restoreScroll.current?.();
    const hosts = [document.documentElement, document.body];
    const previous = hosts.map((el) => el.style.scrollBehavior);
    hosts.forEach((el) => {
      el.style.scrollBehavior = 'auto';
    });
    restoreScroll.current = () => {
      hosts.forEach((el, i) => {
        el.style.scrollBehavior = previous[i];
      });
      restoreScroll.current = null;
    };

    window.setTimeout(() => restoreScroll.current?.(), 800);
  };

  return (
    <nav
      ref={rootRef}
      className={styles.joinMenu}
      data-in={entered ? '' : undefined}
      aria-label="더 알아보기"
    >
      <p className={styles.joinMenuKicker}>더 알아보기</p>

      <ul className={styles.joinMenuList}>
        {MENUS.map((menu, index) => {
          const hasChildren = Boolean(menu.children);
          const open = openLabel === menu.label;
          const anchor = anchors[menu.label];
          const height = hasChildren ? TREE_H : WORD_H;

          return (
            <li
              key={menu.label}
              className={styles.joinMenuItem}
              data-open={open ? '' : undefined}
              data-branch={hasChildren ? '' : undefined}
              style={{
                '--collapsed': `${(WORD_H / VB_W) * 100}%`,
                '--expanded': `${(TREE_H / VB_W) * 100}%`,
                '--order': index,
              }}
              onMouseEnter={hasChildren ? () => setOpenLabel(menu.label) : undefined}
              onMouseLeave={hasChildren ? () => setOpenLabel(null) : undefined}
            >
              <svg
                className={styles.joinSvg}
                viewBox={`0 0 ${VB_W} ${height}`}
                style={{ aspectRatio: `${VB_W} / ${height}` }}
                aria-hidden="true"
              >
                <text
                  ref={(node) => {
                    textRefs.current[menu.label] = node;
                  }}
                  className={styles.joinWordSolid}
                  x={WORD_RIGHT}
                  y={BASELINE}
                  textAnchor="end"
                  fontSize={WORD_SIZE}
                >
                  {menu.label}
                </text>
                <text
                  className={styles.joinWordDraw}
                  x={WORD_RIGHT}
                  y={BASELINE}
                  textAnchor="end"
                  fontSize={WORD_SIZE}
                  strokeDasharray={DASH}
                  strokeDashoffset={DASH}
                  aria-hidden="true"
                >
                  {menu.label}
                </text>

                {hasChildren && anchor && (
                  <g className={styles.joinBranch}>
                    <path
                      className={styles.joinBranchLine}
                      d={`M ${anchor.x - BRANCH_SPAN} ${anchor.y} H ${TWIG_END}`}
                      pathLength="1"
                      style={{ '--seq': 0 }}
                    />
                    <circle
                      className={styles.joinBranchDot}
                      cx={TWIG_END}
                      cy={anchor.y}
                      r={DOT_R}
                    />
                    <path
                      className={styles.joinBranchLine}
                      d={`M ${(anchor.x - BRANCH_SPAN + TWIG_END) / 2} ${anchor.y} V ${rowY(anchor.y, menu.children.length - 1)}`}
                      pathLength="1"
                      style={{ '--seq': 1 }}
                    />
                    {menu.children.map((child, childIndex) => (
                      <path
                        key={child.label}
                        className={styles.joinBranchLine}
                        d={`M ${(anchor.x - BRANCH_SPAN + TWIG_END) / 2} ${rowY(anchor.y, childIndex)} h ${STUB}`}
                        pathLength="1"
                        style={{ '--seq': 2 + childIndex }}
                      />
                    ))}
                  </g>
                )}
              </svg>

              {hasChildren ? (
                <>
                  <button
                    type="button"
                    className={styles.joinHit}
                    aria-expanded={open}
                    onClick={() => setOpenLabel((v) => (v === menu.label ? null : menu.label))}
                  >
                    <span className={styles.srOnly}>{menu.label}</span>
                  </button>
                  <ul className={styles.joinSubList}>
                    {menu.children.map((child, childIndex) => (
                      <li
                        key={child.label}
                        style={{
                          '--row-top': anchor
                            ? `${(rowY(anchor.y, childIndex) / VB_W) * 100}%`
                            : '0%',
                          '--row-right': `${((VB_W - WORD_RIGHT) / VB_W) * 100}%`,
                          '--seq': 2 + childIndex,
                        }}
                      >
                        <Link
                          href={child.href}
                          className={styles.joinSubLink}
                          onClick={suppressSmoothScroll}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <Link
                  href={menu.href}
                  className={styles.joinHit}
                  onClick={suppressSmoothScroll}
                >
                  <span className={styles.srOnly}>{menu.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
