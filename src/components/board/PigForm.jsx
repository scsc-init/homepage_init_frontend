// component를 잘못 설계해서, sig로 재활용하는 양상이 되어버렸습니다. 배포 이전에는 수정하겠습니다.
import Editor from '@/components/board/EditorWrapper.jsx';
import SigInputField from './SigInputField';
import * as Button from '@/components/Button.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import { Controller } from 'react-hook-form';

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
      <SigInputField
        label="피그 이름"
        placeholder="INIT PIG"
        register={register}
        name="title"
      />
      <SigInputField
        label="피그 설명"
        placeholder="홈페이지를 관리하는 PIG입니다"
        register={register}
        name="description"
      />

      <div>
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

      <Button.Root type="submit">{isCreate ? 'PIG 생성' : 'PIG 수정'}</Button.Root>
    </form>
  );
}
