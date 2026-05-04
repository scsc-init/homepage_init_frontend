import TextInput from '../form-control/TextInput';
import EditorInput from '../form-control/EditorInput';
import DropdownInput from '../form-control/DropdownInput';
import ToggleInput from '../form-control/ToggleInput';
import ButtonInput from '../form-control/ButtonInput';
import { SIG_ADMISSION_LABEL_MAP } from '@/util/constants';

export default function SigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'websites' });

  const handleAddWebsite = useCallback(() => {
    append({ url: '' });
  }, [append]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <TextInput label="SIG 이름" placeholder="AI SIG" register={register} name="title" />
      <TextInput
        label="SIG 한 줄 설명"
        placeholder="AI를 공부하는 SIG입니다"
        register={register}
        name="description"
      />
      <EditorInput label="SIG 소개" control={control} name="editor" editorKey={editorKey} />
      <DropdownInput
        label="가입 기간"
        name="is_rolling_admission"
        options={{
          always: SIG_ADMISSION_LABEL_MAP.always,
          during_recruiting: SIG_ADMISSION_LABEL_MAP.during_recruiting,
          never: SIG_ADMISSION_LABEL_MAP.never,
        }}
        control={control}
      />
      {!isCreate && (
        <ToggleInput label="다음 학기에 연장 신청" name="should_extend" control={control} />
      )}

      <ButtonInput isSubmit={true}>{isCreate ? 'SIG 생성' : 'SIG 수정'}</ButtonInput>
    </form>
  );
}
