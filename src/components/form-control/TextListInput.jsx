'use client';

import styles from './TextListInput.module.css';

import TextInput from './TextInput';
import { Fragment, useCallback, useRef, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoIosLink } from 'react-icons/io';

export default function TextListInput({ label, name, register, control, inputKey }) {
  const [currentInput, setCurrentInput] = useState('');
  const { fields, append, remove } = useFieldArray({ control, name });
  const ref = useRef();

  const handleAdd = useCallback(() => {
    let fieldValue = {};
    fieldValue[inputKey] = currentInput;
    append(fieldValue);
    ref.current.value = '';
  }, [append, currentInput]);

  const removeValue = (e, index) => {
    e.currentTarget.classList.add(styles.taggedForRemoval);
    setTimeout(() => {
      remove(index);
    }, 1000);
  };

  return (
    <div className={styles.textListInputGroup} key={name}>
      <div className={styles.currentTextList}>
        {fields.map((field, index) => {
          if (field[inputKey] === '') return <Fragment key={'emptyFragment'}></Fragment>;

          return (
            <Fragment key={field.id}>
              <span className={styles.textListData} onClick={(e) => removeValue(e, index)}>
                <span className={styles.textListDataLink}>
                  <IoIosLink />
                </span>
                <span className={styles.textListDataText}>{field[inputKey]}</span>
                <span className={styles.textListDataTrash}>
                  <FaRegTrashAlt color="white" />
                </span>
              </span>
              <input type="hidden" name={name} {...register(`${name}.${index}.${inputKey}`)} />
            </Fragment>
          );
        })}
      </div>
      <TextInput
        activateNext={(v) => setCurrentInput(v)}
        deactivateNext={() => setCurrentInput('')}
        label={label}
        name={`fakeinput-${name}`}
        placeholder={'엔터를 눌러 추가하세요'}
        register={() => ({ ref })}
        onEnter={handleAdd}
      />
    </div>
  );
}
