import { useTranslations } from 'next-intl';
import TextInput from '@/components/form-control/TextInput';
import EditorInput from '@/components/form-control/EditorInput';
import DropdownInput from '@/components/form-control/DropdownInput';
import ToggleInput from '@/components/form-control/ToggleInput';
import ButtonInput from '@/components/form-control/ButtonInput';
import TextListInput from '@/components/form-control/TextListInput';

export default function IgForm({
  kind,
  register,
  control,
  handleSubmit,
  onSubmit,
  editorKey,
  isCreate,
  afterFields,
}) {
  const t = useTranslations('Ig');
  const kindLabel = t(`kind.${kind}`);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)(e);
      }}
    >
      <TextInput
        label={t('name', { kind: kindLabel })}
        placeholder={t(`titlePlaceholder.${kind}`)}
        register={register}
        name="title"
      />
      <TextInput
        label={t('description', { kind: kindLabel })}
        placeholder={t(`descriptionPlaceholder.${kind}`)}
        register={register}
        name="description"
      />
      <EditorInput
        label={t('introduction', { kind: kindLabel })}
        control={control}
        name="editor"
        editorKey={editorKey}
      />
      <TextListInput
        label={t('websiteLabel')}
        placeholder={t('websitePlaceholder')}
        name="websites"
        register={register}
        control={control}
        inputKey="url"
      />
      <DropdownInput
        label={t('admission')}
        name="is_rolling_admission"
        options={{
          always: t('admissionAlways'),
          during_recruiting: t('admissionRecruiting', { kind: kindLabel }),
          never: t('admissionNever'),
        }}
        control={control}
      />
      {!isCreate ? (
        <ToggleInput label={t('extend')} name="should_extend" control={control} />
      ) : null}
      {afterFields ? <div style={{ margin: '3rem 0' }}>{afterFields}</div> : null}

      <ButtonInput isSubmit={true}>
        {t(isCreate ? 'create' : 'editHeading', { kind: kindLabel })}
      </ButtonInput>
    </form>
  );
}
