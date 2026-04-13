import { PIG_ADMISSION_LABEL_MAP } from '@/util/constants';
import TextInput from '../form-control/TextInput';
import EditorInput from '../form-control/EditorInput';
import DropdownInput from '../form-control/DropdownInput';
import ToggleInput from '../form-control/ToggleInput';
import ButtonInput from '../form-control/ButtonInput';
import TextListInput from '../form-control/TextListInput';

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <TextInput label="PIG 이름" placeholder="INIT" register={register} name="title" />
      <TextInput
        label="PIG 한 줄 설명"
        placeholder="홈페이지 관리 PIG입니다"
        register={register}
        name="description"
      />
      <EditorInput label="PIG 소개" control={control} name="editor" editorKey={editorKey} />
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
          always: PIG_ADMISSION_LABEL_MAP.always,
          during_recruiting: PIG_ADMISSION_LABEL_MAP.during_recruiting,
          never: PIG_ADMISSION_LABEL_MAP.never,
        }}
        control={control}
      />
      {!isCreate && (
        <ToggleInput label="다음 학기에 연장 신청" name="should_extend" control={control} />
      )}

      <ButtonInput isSubmit={true}>{isCreate ? 'PIG 생성' : 'PIG 수정'}</ButtonInput>
    </form>
  );
}
