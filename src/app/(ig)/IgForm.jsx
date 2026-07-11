import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import DropdownInput from '@/components/form-control/DropdownInput';
import ToggleInput from '@/components/form-control/ToggleInput';
import ButtonInput from '@/components/form-control/ButtonInput';
import TextListInput from '@/components/form-control/TextListInput';
import { PIG_ADMISSION_LABEL_MAP, SIG_ADMISSION_LABEL_MAP } from '@/util/constants';

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
};

export default function IgForm({
  kind,
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const config = FORM_CONFIG[kind];

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
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

      <ButtonInput isSubmit={true}>
        {isCreate ? `${config.upperLabel} 생성` : `${config.upperLabel} 수정`}
      </ButtonInput>
    </form>
  );
}
