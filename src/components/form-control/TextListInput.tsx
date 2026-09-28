'use client';

import styles from './TextListInput.module.css';

import TextInput from './TextInput';
import { Fragment, useCallback, useRef, type MouseEvent } from 'react';
import { useFieldArray } from 'react-hook-form';
import type {
  ArrayPath,
  Control,
  FieldArray,
  FieldPathByValue,
  FieldValues,
  Path,
  UseFormRegister,
} from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoIosLink } from 'react-icons/io';

type TextListInputProps<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
> = {
  label: string;
  name: TName;
  register: UseFormRegister<TFieldValues>;
  control: Control<TFieldValues>;
  inputKey: keyof FieldArray<TFieldValues, TName> & string;
};

export default function TextListInput<
  TFieldValues extends FieldValues,
  TName extends ArrayPath<TFieldValues> = ArrayPath<TFieldValues>,
>({ label, name, register, control, inputKey }: TextListInputProps<TFieldValues, TName>) {
  const { fields, append, remove } = useFieldArray<TFieldValues, TName>({ control, name });
  const ref = useRef<HTMLInputElement>(null);

  const handleAdd = useCallback(() => {
    if (!ref.current) return;
    const value = ref.current.value;
    if (value === '') return;
    const fieldValue: Record<string, string> = {};
    fieldValue[inputKey] = value;
    append(fieldValue as FieldArray<TFieldValues, TName>);
    ref.current.value = '';
  }, [append, inputKey]);

  const removeValue = (_event: MouseEvent<HTMLButtonElement>, index: number) => {
    remove(index);
  };

  return (
    <div className={styles.textListInputGroup} key={name}>
      <TextInput<TFieldValues>
        label={label}
        name={`fakeinput-${name}` as FieldPathByValue<TFieldValues, string>}
        placeholder="엔터를 눌러 추가하세요"
        register={(() => ({ ref })) as unknown as UseFormRegister<TFieldValues>}
        onEnter={handleAdd}
      />
      <div className={styles.currentTextList}>
        {fields.map((field, index) => {
          const fieldValue = field[inputKey];
          if (fieldValue === '') return null;

          return (
            <Fragment key={field.id}>
              <button
                type="button"
                className={styles.textListData}
                onClick={(e) => removeValue(e, index)}
              >
                <span className={styles.textListDataLink}>
                  <IoIosLink />
                </span>
                <span className={styles.textListDataText}>{String(fieldValue ?? '')}</span>
                <span className={styles.textListDataTrash}>
                  <FaRegTrashAlt color="white" />
                </span>
              </button>
              <input
                type="hidden"
                {...register(`${name}.${index}.${inputKey}` as Path<TFieldValues>)}
              />
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
