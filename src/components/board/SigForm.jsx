import Editor from '@/components/board/EditorWrapper.jsx';
import InputField from './InputField';
import * as Button from '@/components/Button.jsx';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import ToggleInput from '@/components/form-control/ToggleInput';
import InputPage from '@/components/form-control/InputPage';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { Controller } from 'react-hook-form';
import { useState } from 'react';

export default function SigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const [activePageIndex, setActivePageIndex] = useState(0);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <InputPage
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        currentPageIndex={0}
        numPages={4}
      >
        <TextInput label="시그 이름" placeholder="AI SIG" register={register} name="title" />
      </InputPage>
      <InputPage
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        currentPageIndex={1}
        numPages={4}
      >
        <TextInput
          label="시그 설명"
          placeholder="AI를 공부하는 SIG입니다"
          register={register}
          name="description"
        />
      </InputPage>
      <InputPage
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        currentPageIndex={2}
        numPages={4}
      >
        <EditorInput label="상세 소개" control={control} name="editor" />
      </InputPage>
      <InputPage
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        currentPageIndex={3}
        numPages={4}
        submitButtonText={isCreate ? 'SIG 생성' : 'SIG 수정'}
      >
        <ToggleInput label="가입 기간 자유화" name="is_rolling_admission" control={control} />
        {!isCreate && (
          <ToggleInput label="다음 학기에 연장 신청" name="should_extend" control={control} />
        )}
      </InputPage>
    </form>
  );
}
