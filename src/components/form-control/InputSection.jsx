'use client';

import styles from './InputSection.module.css';

import ButtonInput from './ButtonInput';

export default function InputSection({
  children,
  activeSectionIndex,
  currentSectionIndex,
  numSections,
  submitButtonText,
}) {
  const isLastIndex = currentSectionIndex === numSections - 1;

  return (
    <div
      className={styles.inputSection}
      data-active={activeSectionIndex >= currentSectionIndex}
    >
      {children}
      {isLastIndex && (
        <div className={styles.buttonContainer}>
          <ButtonInput className={styles.submitBtn} isSubmit={true}>
            {submitButtonText}
          </ButtonInput>
        </div>
      )}
    </div>
  );
}
