'use client';

import { useEffect, useState } from 'react';
import TextInput from './TextInput';
import ToggleInput from './ToggleInput';
import EditorInput from './EditorInput';
import InputPage from './InputPage';
import SimpleGrid from '@/components/SimpleGrid';
import DropdownInput from './DropdownInput';
import TextListInput from './TextListInput';

function renderInputElement(
  pageIndex,
  formControl,
  register,
  control,
  editorKey,
  activePageIndex,
  setActivePageIndex,
) {
  if (!formControl.activated) return <></>;

  switch (formControl.inputType) {
    case 'text':
      return (
        <TextInput
          key={formControl.name}
          label={formControl.label}
          placeholder={formControl.placeholder}
          register={register}
          name={formControl.name}
          activePageIndex={activePageIndex}
          activateNext={() =>
            activePageIndex === pageIndex &&
            setActivePageIndex(Math.max(activePageIndex, pageIndex + 1))
          }
          deactivateNext={() =>
            activePageIndex > pageIndex &&
            setActivePageIndex(Math.min(activePageIndex, pageIndex))
          }
        />
      );
    case 'editor':
      return (
        <EditorInput
          key={formControl.name}
          label={formControl.label}
          control={control}
          name={formControl.name}
          editorKey={editorKey}
        />
      );
    case 'toggle':
      return (
        <ToggleInput
          key={formControl.name}
          label={formControl.label}
          name={formControl.name}
          control={control}
        />
      );
    case 'dropdown':
      return (
        <DropdownInput
          key={formControl.name}
          label={formControl.label}
          name={formControl.name}
          options={formControl.options}
          control={control}
        />
      );
    case 'textlist':
      return (
        <TextListInput
          label={formControl.label}
          name={formControl.name}
          register={register}
          control={control}
          inputKey={formControl.inputKey}
        />
      );
  }
}

export default function InputBook({
  inputPages,
  register,
  control,
  editorKey,
  submitButtonText,
}) {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [renderedBook, setRenderedBook] = useState(<></>);

  useEffect(() => {
    const renderablePages = {};
    for (const page of inputPages) {
      const gridElement = (
        <SimpleGrid cols={page.gridCols}>
          {page.formControl.map((child) => {
            return renderInputElement(
              page.page,
              child,
              register,
              control,
              editorKey,
              activePageIndex,
              setActivePageIndex,
            );
          })}
        </SimpleGrid>
      );

      if (!renderablePages.hasOwnProperty(page.page)) {
        renderablePages[page.page] = gridElement;
      } else {
        renderablePages[page.page] = (
          <>
            {renderablePages[page.page]}
            {gridElement}
          </>
        );
      }
    }

    setRenderedBook(
      Object.values(renderablePages).map((child, index) => {
        return (
          <InputPage
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            currentPageIndex={index}
            numPages={Object.keys(renderablePages).length}
            submitButtonText={submitButtonText}
            key={index}
          >
            {child}
          </InputPage>
        );
      }),
    );
  }, [inputPages, activePageIndex]);

  return <>{renderedBook}</>;
}
