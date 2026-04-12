'use client';

import { useEffect, useState } from 'react';
import TextInput from './TextInput';
import ToggleInput from './ToggleInput';
import EditorInput from './EditorInput';
import InputSection from './InputSection';
import SimpleGrid from '@/components/SimpleGrid';
import DropdownInput from './DropdownInput';
import TextListInput from './TextListInput';

function renderInputElement(
  sectionIndex,
  formControl,
  register,
  control,
  editorKey,
  activeSectionIndex,
  setActiveSectionIndex,
) {
  if (formControl.activated === false) return <></>;

  switch (formControl.inputType) {
    case 'text':
      return (
        <TextInput
          key={formControl.name}
          label={formControl.label}
          placeholder={formControl.placeholder}
          register={register}
          name={formControl.name}
          activeSectionIndex={activeSectionIndex}
          activateNext={() =>
            activeSectionIndex === sectionIndex &&
            setActiveSectionIndex(Math.max(activeSectionIndex, sectionIndex + 1))
          }
          deactivateNext={() =>
            activeSectionIndex > sectionIndex &&
            setActiveSectionIndex(Math.min(activeSectionIndex, sectionIndex))
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

export default function FormsRenderer({
  inputSections,
  register,
  control,
  editorKey,
  submitButtonText,
}) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [renderedElement, setRenderedElement] = useState(<></>);

  useEffect(() => {
    const renderableSections = {};
    for (const section of inputSections) {
      const gridElement = (
        <SimpleGrid cols={section.gridCols}>
          {section.formControls.map((formControl) => {
            return renderInputElement(
              section.index,
              formControl,
              register,
              control,
              editorKey,
              activeSectionIndex,
              setActiveSectionIndex,
            );
          })}
        </SimpleGrid>
      );

      if (!renderableSections.hasOwnProperty(section.index)) {
        renderableSections[section.index] = gridElement;
      } else {
        renderableSections[section.index] = (
          <>
            {renderableSections[section.index]}
            {gridElement}
          </>
        );
      }
    }

    setRenderedElement(
      Object.values(renderableSections).map((child, index) => {
        return (
          <InputSection
            activeSectionIndex={activeSectionIndex}
            setActiveSectionIndex={setActiveSectionIndex}
            currentSectionIndex={index}
            numSections={Object.keys(renderableSections).length}
            submitButtonText={submitButtonText}
            key={index}
          >
            {child}
          </InputSection>
        );
      }),
    );
  }, [inputSections, activeSectionIndex]);

  return <>{renderedElement}</>;
}
