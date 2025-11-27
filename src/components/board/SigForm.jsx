import Editor from '@/components/board/EditorWrapper.jsx';
import InputField from './InputField';
import * as Button from '@/components/Button.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { Controller } from 'react-hook-form';

export default function SigForm({
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
      <InputField label="시그 이름" placeholder="AI SIG" register={register} name="title" />
      <InputField
        label="시그 설명"
        placeholder="AI를 공부하는 SIG입니다"
        register={register}
        name="description"
      />

      <div className="editorSection">
        <label className="block mb-2 font-semibold">상세 소개</label>
        <Controller
          name="editor"
          control={control}
          render={({ field }) => (
            <Editor
              key={editorKey}
              markdown={typeof field.value === 'string' ? field.value : ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="form-toggle-row">
        <span className="form-toggle-label">가입 기간 자유화</span>
        <span className="form-toggle-right">
          <Controller
            name="is_rolling_admission"
            control={control}
            render={({ field }) => (
              <ToggleSwitch checked={!!field.value} onChange={field.onChange} />
            )}
          />
        </span>
      </div>

      {isCreate ? null : (
        <div className="form-toggle-row">
          <span className="form-toggle-label">다음 학기에 연장 신청</span>
          <span className="form-toggle-right">
            <Controller
              name="should_extend"
              control={control}
              render={({ field }) => (
                <ToggleSwitch checked={!!field.value} onChange={field.onChange} />
              )}
            />
          </span>
        </div>
      )}

      <Button.Root type="submit">{isCreate ? 'SIG 생성' : 'SIG 수정'}</Button.Root>
    </form>
  );
}
