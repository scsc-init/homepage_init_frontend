import InputBook from '@/components/form-control/InputBook';

export default function SigForm({
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
          label: 'SIG 이름',
          placeholder: 'AI SIG',
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
          label: 'SIG 한 줄 설명',
          placeholder: 'AI를 공부하는 SIG입니다',
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
          label: 'SIG 소개',
          name: 'editor',
          activated: true,
        },
      ],
    },
    {
      page: 2,
      gridCols: 2,
      formControl: [
        {
          inputType: 'toggle',
          label: '상시 모집',
          name: 'is_rolling_admission',
          activated: true,
        },
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
        submitButtonText={isCreate ? 'SIG 생성' : 'SIG 수정'}
      />
    </form>
  );
}
