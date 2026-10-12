import type { IgFormValues, IgKind } from '@/app/(ig)/components/editor/types';
import ButtonInput from '@/components/form-control/ButtonInput';
import DropdownInput from '@/components/form-control/DropdownInput';
import EditorInput from '@/components/form-control/EditorInput';
import TextInput from '@/components/form-control/TextInput';
import TextListInput from '@/components/form-control/TextListInput';
import ToggleInput from '@/components/form-control/ToggleInput';
import { PIG_ADMISSION_LABEL_MAP, SIG_ADMISSION_LABEL_MAP } from '@/util/constants';
import type { ReactNode } from 'react';
import type {
  Control,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';

type IgFormProps = {
  kind: IgKind;
  register: UseFormRegister<IgFormValues>;
  control: Control<IgFormValues>;
  handleSubmit: UseFormHandleSubmit<IgFormValues>;
  onSubmit: SubmitHandler<IgFormValues>;
  editorKey: number;
  isCreate: boolean;
  afterFields?: ReactNode;
};

const FORM_CONFIG = {
  sig: {
    upperLabel: 'SIG',
    titlePlaceholder: 'AI SIG',
    descriptionPlaceholder: 'AI를 공부하는 SIG입니다',
    admissionLabelMap: SIG_ADMISSION_LABEL_MAP,
  },
  pig: {
    upperLabel: 'PIG',
    titlePlaceholder: 'INIT',
    descriptionPlaceholder: '홈페이지 관리 PIG입니다',
    admissionLabelMap: PIG_ADMISSION_LABEL_MAP,
  },
} as const;

export default function IgForm({
  kind,
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
  afterFields,
}: IgFormProps) {
  const config = FORM_CONFIG[kind];

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handleSubmit(onSubmit)(event);
      }}
    >
      <TextInput
        label={`${config.upperLabel} 이름`}
        placeholder={config.titlePlaceholder}
        register={register}
        name="title"
      />
      <TextInput
        label={`${config.upperLabel} 한 줄 설명`}
        placeholder={config.descriptionPlaceholder}
        register={register}
        name="description"
      />
      <EditorInput
        label={`${config.upperLabel} 소개`}
        control={control}
        name="editor"
        editorKey={editorKey}
      />
      <TextListInput
        label="웹사이트"
        name="websites"
        register={register}
        control={control}
        inputKey="url"
      />
      <DropdownInput
        label="가입 기간"
        name="is_rolling_admission"
        options={{
          always: config.admissionLabelMap.always,
          during_recruiting: config.admissionLabelMap.during_recruiting,
          never: config.admissionLabelMap.never,
        }}
        control={control}
      />
      {!isCreate ? (
        <ToggleInput label="다음 학기에 연장 신청" name="should_extend" control={control} />
      ) : null}
      {afterFields ? <div style={{ margin: '3rem 0' }}>{afterFields}</div> : null}

      <ButtonInput isSubmit>
        {isCreate ? `${config.upperLabel} 생성` : `${config.upperLabel} 수정`}
      </ButtonInput>
    </form>
  );
}
