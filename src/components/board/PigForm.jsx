import { useCallback } from 'react';
import Editor from '@/components/board/EditorWrapper.jsx';
import InputField from './InputField';
import * as Button from '@/components/Button.jsx';
import * as Input from '@/components/Input.jsx';
import { Controller, useFieldArray } from 'react-hook-form';
import PigAdmissionDropdown from '@/components/board/PigAdmissionDropdown.jsx';
import styles from './board.module.css';

export default function PigForm({
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
      <InputField label="피그 이름" placeholder="INIT PIG" register={register} name="title" />
      <InputField
        label="피그 설명"
        placeholder="홈페이지를 관리하는 PIG입니다"
        register={register}
        name="description"
      />

      <div>
        <label className="block mb-2 font-semibold">상세 소개</label>
        <Controller
          name="content"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Editor
              key={editorKey}
              markdown={typeof field.value === 'string' ? field.value : ''}
              onChange={field.onChange}
            />
          )}
        />
      </div>

      <div className="space-y-2" style={{ marginTop: '1.5rem' }}>
        <span className="font-semibold">웹사이트</span>

        <div className="space-y-3">
          {fields.map((field, index) => {
            const fieldId = `website-url-${index}`;
            return (
              <div key={field.id} className="PigUrlRow">
                <Input.Root className="PigUrlField">
                  <Input.Label htmlFor={fieldId}>URL</Input.Label>
                  <Input.Input
                    id={fieldId}
                    className="PigUrlInput"
                    type="text"
                    inputMode="url"
                    placeholder="https://example.com"
                    {...register(`websites.${index}.url`)}
                  />
                </Input.Root>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="PigUrlRemove text-sm text-red-500 hover:underline"
                    onClick={() => remove(index)}
                  >
                    삭제
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
            onClick={handleAddWebsite}
          >
            웹사이트 추가
          </button>
        </div>
      </div>

      <div className={styles['form-toggle-group']}>
        <div className={styles['form-toggle-row']}>
          <span className={styles['form-toggle-label']}>가입 기간</span>
          <span className={styles['form-toggle-right']}>
            <Controller
              name="is_rolling_admission"
              control={control}
              defaultValue="always"
              render={({ field }) => (
                <PigAdmissionDropdown
                  pigAdmissionState={field.value}
                  setPigAdmissionState={field.onChange}
                />
              )}
            />
          </span>
        </div>

        {isCreate ? null : (
          <div className={styles['form-toggle-row']}>
            <label className={styles['form-toggle-label']} htmlFor="should_extend">
              다음 학기에 연장 신청
            </label>
            <span className={styles['form-toggle-right']}>
              <Controller
                name="should_extend"
                control={control}
                render={({ field }) => (
                  <input
                    id="should_extend"
                    type="checkbox"
                    className="extend-checkbox"
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                  />
                )}
              />
            </span>
          </div>
        )}
      </div>

      <Button.Root type="submit">{isCreate ? 'PIG 생성' : 'PIG 수정'}</Button.Root>
    </form>
  );
}
