'use client';

import styles from './InputPage.module.css';

import ButtonInput from './ButtonInput';

export default function InputPage({
  children,
  activePageIndex,
  currentPageIndex,
  numPages,
  submitButtonText,
}) {
  const isLastIndex = currentPageIndex === numPages - 1;

  return (
    <div className={styles.inputPage} data-active={activePageIndex >= currentPageIndex}>
      {children}
      {isLastIndex && (
        <div className={styles.pageTransitionGroup}>
          <ButtonInput className={styles.submitBtn} isSubmit={true}>
            {submitButtonText}
          </ButtonInput>
        </div>
      )}
    </div>
  );
}
