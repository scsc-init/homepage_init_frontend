import InputBook from '@/components/form-control/InputBook';
import { PIG_ADMISSION_LABEL_MAP } from '@/util/constants';

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const inputPages = [
    {
      page: 0,
      gridCols: 1,
      formControl: [
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
      page: 1,
      gridCols: 1,
      formControl: [
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
      page: 2,
      gridCols: 1,
      formControl: [
        {
          inputType: 'editor',
          label: 'PIG 소개',
          name: 'editor',
          activated: true,
        },
      ],
    },
    {
      page: 2,
      gridCols: 1,
      formControl: [
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
      page: 2,
      gridCols: 1,
      formControl: [
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
      page: 2,
      gridCols: 1,
      formControl: [
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
      <InputBook
        inputPages={inputPages}
        register={register}
        control={control}
        editorKey={editorKey}
        submitButtonText={isCreate ? 'PIG 생성' : 'PIG 수정'}
      />
    </form>
  );
}
