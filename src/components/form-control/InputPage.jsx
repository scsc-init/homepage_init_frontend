'use client';

import styles from './InputPage.module.css';

import ButtonInput from './ButtonInput';

export default function InputPage({
  children,
  activePageIndex,
  setActivePageIndex,
  currentPageIndex,
  numPages,
  submitButtonText,
}) {
  const isFirstIndex = currentPageIndex === 0;
  const isLastIndex = currentPageIndex === numPages - 1;

  return (
    <div className={styles.inputPage} data-active={activePageIndex === currentPageIndex}>
      {children}
      <div className={styles.pageTransitionGroup}>
        <ButtonInput
          className={isFirstIndex ? styles.invisible : ''}
          onClick={() => setActivePageIndex(activePageIndex - 1)}
        >
          이전
        </ButtonInput>
        <ButtonInput
          className={isLastIndex ? styles.submitBtn : ''}
          data-submit={isLastIndex}
          onClick={() => setActivePageIndex(activePageIndex + 1)}
        >
          {isLastIndex ? submitButtonText : '다음'}
        </ButtonInput>
      </div>
    </div>
  );
}
