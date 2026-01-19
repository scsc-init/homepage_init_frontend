import { useCallback } from 'react';
import Editor from '@/components/board/EditorWrapper.jsx';
import InputField from './InputField';
import * as Button from '@/components/Button.jsx';
import ToggleSwitch from '@/components/ToggleSwitch.jsx';
import * as Input from '@/components/Input.jsx';
import { Controller, useFieldArray } from 'react-hook-form';

export default function PigForm({
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'websites' });

  const handleUrlKeyDown = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        append({ url: '' });
      }
    },
    [append],
  );

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <InputField label="PIG 이름" placeholder="INIT PIG" register={register} name="title" />
      <InputField
        label="PIG 설명"
        placeholder="어떤 활동을 하는지 소개해 주세요"
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

      <div className="space-y-2">
        <span className="font-semibold">웹사이트</span>
        <p className="text-sm text-gray-500">Enter를 누르면 다음 줄이 자동으로 추가됩니다.</p>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="space-y-2">
              <Input.Root>
                <Input.Label>URL</Input.Label>
                <Input.Input
                  type="text"
                  inputMode="url"
                  placeholder="https://example.com"
                  {...register(`websites.${index}.url`)}
                  onKeyDown={handleUrlKeyDown}
                />
              </Input.Root>
              {fields.length > 1 && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-red-500 hover:underline"
                    onClick={() => remove(index)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="form-toggle-row">
        <span className="form-toggle-label">상시 모집</span>
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
          <span className="form-toggle-label">다음 학기 연장 신청</span>
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
