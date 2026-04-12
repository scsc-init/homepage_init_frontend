import FormsRenderer from '@/components/form-control/FormsRenderer';

export default function SigForm({
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
          label: 'SIG 이름',
          placeholder: 'AI SIG',
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
          label: 'SIG 한 줄 설명',
          placeholder: 'AI를 공부하는 SIG입니다',
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
          label: 'SIG 소개',
          name: 'editor',
          activated: true,
        },
      ],
    },
    {
      index: 2,
      gridCols: 2,
      formControls: [
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
      <FormsRenderer
        inputSections={inputSections}
        register={register}
        control={control}
        editorKey={editorKey}
        submitButtonText={isCreate ? 'SIG 생성' : 'SIG 수정'}
      />
    </form>
  );
}
