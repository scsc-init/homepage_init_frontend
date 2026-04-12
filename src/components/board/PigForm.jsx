import { PIG_ADMISSION_LABEL_MAP } from '@/util/constants';
import FormsRenderer from '../form-control/FormsRenderer';

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const inputSections = [
    {
      index: 0,
      gridCols: 1,
      formControls: [
        {
          inputType: 'text',
          label: 'PIG 이름',
          placeholder: 'INIT',
          name: 'title',
          activated: true,
        },
      ],
    },
    {
      index: 1,
      gridCols: 1,
      formControls: [
        {
          inputType: 'text',
          label: 'PIG 한 줄 설명',
          placeholder: '홈페이지 관리 PIG입니다',
          name: 'description',
          activated: true,
        },
      ],
    },
    {
      index: 2,
      gridCols: 1,
      formControls: [
        {
          inputType: 'editor',
          label: 'PIG 소개',
          name: 'editor',
          activated: true,
        },
      ],
    },
    {
      index: 2,
      gridCols: 1,
      formControls: [
        {
          inputType: 'textlist',
          label: '웹사이트',
          name: 'websites',
          inputKey: 'url',
          activated: true,
        },
      ],
    },
    {
      index: 2,
      gridCols: 1,
      formControls: [
        {
          inputType: 'dropdown',
          label: '가입 기간',
          name: 'is_rolling_admission',
          options: {
            always: PIG_ADMISSION_LABEL_MAP.always,
            during_recruiting: PIG_ADMISSION_LABEL_MAP.during_recruiting,
            never: PIG_ADMISSION_LABEL_MAP.never,
          },
          activated: true,
        },
      ],
    },
    {
      index: 2,
      gridCols: 1,
      formControls: [
        {
          inputType: 'toggle',
          label: '다음 학기에 연장 신청',
          name: 'should_extend',
          activated: !isCreate,
        },
      ],
    },
  ];

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <FormsRenderer
        inputSections={inputSections}
        register={register}
        control={control}
        editorKey={editorKey}
        submitButtonText={isCreate ? 'PIG 생성' : 'PIG 수정'}
      />
    </form>
  );
}
