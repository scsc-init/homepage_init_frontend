// components/sig/SigForm.jsx
import SigInputField from './SigInputField';
import * as Button from '@/components/Button.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { Controller } from 'react-hook-form';

export default function SigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  Editor,
  editorKey,
  isCreate,
}) {
  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SigInputField label="시그 이름" placeholder="AI SIG" register={register} name="title" />
      <SigInputField
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

      <div>
        <label className="block mb-2 font-semibold">가입 기간 자유화</label>
        <div>
          <Controller
            name="is_rolling_admission"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <ToggleSwitch checked={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      </div>

      {isCreate ? null : (
        <div>
          <label className="block mb-2 font-semibold">다음 학기에 연장 신청</label>
          <div>
            <Controller
              name="should_extend"
              control={control}
              defaultValue={false}
              render={({ field }) => (
                <ToggleSwitch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
      )}

      <Button.Root type="submit">{isCreate ? 'SIG 생성' : 'SIG 수정'}</Button.Root>
    </form>
  );
}
