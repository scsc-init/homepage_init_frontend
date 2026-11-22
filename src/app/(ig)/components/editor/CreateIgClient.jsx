'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import IgForm from '@/app/(ig)/components/editor/IgForm';
import TextInput from '@/components/form-control/TextInput';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useMe } from '@/util/hooks/useMe';
import { sanitizeWebsites } from '@/util/websites';

const CREATE_CONFIG = {
  sig: {
    storageKey: 'sigForm',
    routeBase: '/sig',
    tags: ['SIG'],
    getDefaultRolling: (status) => (status === 'active' ? 'always' : 'during_recruiting'),
    shouldWarnRolling: (status, value) => status === 'active' && !value,
  },
  'small-group': {
    storageKey: 'smallGroupForm',
    routeBase: '/small-group',
    tags: ['소모임'],
    getDefaultRolling: (status) => (status === 'active' ? 'always' : 'during_recruiting'),
    shouldWarnRolling: (status, value) => status === 'active' && !value,
  },
  pig: {
    storageKey: 'pigForm',
    routeBase: '/pig',
    tags: ['PIG'],
    getDefaultRolling: (status) =>
      typeof status === 'active' ? 'always' : 'during_recruiting',
    shouldWarnRolling: (status, value) =>
      status === 'active' && (value === 'during_recruiting' || value === 'never'),
  },
};

const categoryTagKeys = Object.values(CREATE_CONFIG).flatMap(({ tags }) =>
  tags.map((tag) => tag.toLowerCase()),
);

function getAdditionalTagNames(value) {
  const seen = new Set(categoryTagKeys);
  return (value ?? '')
    .split(',')
    .map((tag) => tag.trim().replace(/^#/, '').trim())
    .filter((tag) => {
      const key = tag.toLowerCase();
      if (!tag || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

async function readTagResponse(response, fallback) {
  if (response.ok) return response.json();

  const error = await response.json().catch(() => null);
  const message = typeof error?.detail === 'string' ? error.detail : fallback;
  throw Object.assign(new Error(message), { status: response.status });
}

async function resolveAdditionalTags(names, isExecutive, t) {
  if (!names.length) return [];

  const loadCatalog = async () => {
    const response = await fetchBackendClient('/api/tags', { cache: 'no-store' });
    return readTagResponse(response, t('tags.loadError'));
  };

  const tagNames = [];
  let catalog = await loadCatalog();
  const findTag = (text) =>
    catalog.find((tag) => tag.text === text) ??
    catalog.find((tag) => tag.text.toLowerCase() === text.toLowerCase());

  for (const text of names) {
    let tag = findTag(text);
    if (!tag) {
      const response = await fetchBackendClient('/api/tag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (response.status === 409) {
        catalog = await loadCatalog();
        tag = findTag(text);
      }
      tag ??= await readTagResponse(response, t('tags.createError'));
    }
    if (tag.is_major && !isExecutive) {
      throw new Error(t('tags.majorRestricted', { tag: tag.text }));
    }
    tagNames.push(tag.text);
  }
  return tagNames;
}

export default function CreateIgClient({ kind, scscGlobalStatus }) {
  const config = CREATE_CONFIG[kind];
  const t = useTranslations('Ig');
  const kindLabel = t(`kind.${kind}`);
  const router = useRouter();
  const { me: user, isLoading, isUnauthenticated } = useMe();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadedStorageKey, setLoadedStorageKey] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      editor: '',
      is_rolling_admission: config.getDefaultRolling(scscGlobalStatus),
      additionalTags: '',
    },
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(config.storageKey);
      if (saved) {
        const { selectedTags, ...draft } = JSON.parse(saved);
        reset({
          ...draft,
          additionalTags:
            draft.additionalTags ?? selectedTags?.map((tag) => tag.text).join(', ') ?? '',
        });
      }
    } catch {}
    setLoadedStorageKey(config.storageKey);
  }, [config.storageKey, reset]);

  useEffect(() => {
    if (isLoading) return;
    if (isUnauthenticated || !user) {
      pushLoginWithRedirect(router);
    }
  }, [isLoading, isUnauthenticated, router, user]);

  const watched = watch();
  useEffect(() => {
    if (loadedStorageKey === config.storageKey && !isFormSubmitted.current) {
      sessionStorage.setItem(config.storageKey, JSON.stringify(watched));
    }
  }, [config.storageKey, loadedStorageKey, watched]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = () => {
      if (!isFormSubmitted.current && isDirty) {
        const confirmed = confirm(t('unsaved'));
        if (!confirmed) {
          router.events.emit('routeChangeError');
          throw 'Route change aborted by user.';
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    router.events?.on?.('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      router.events?.off?.('routeChangeStart', handleRouteChange);
    };
  }, [isDirty, router, t]);

  const onSubmit = async (data) => {
    if (submitting || isFormSubmitted.current) return;

    if (!user) {
      alert(t('retryLater'));
      return;
    } else if (config.shouldWarnRolling(scscGlobalStatus, data.is_rolling_admission)) {
      if (!confirm(t('rollingWarning'))) {
        return;
      }
    } else if (!user.discord_id) {
      if (!confirm(t('discordWarning'))) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const additionalTags = await resolveAdditionalTags(
        getAdditionalTagNames(data.additionalTags),
        user.role >= minExecutiveLevel,
        t,
      );
      const res = await fetchBackendClient('/api/sig/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          tags: [...config.tags, ...additionalTags],
          description: data.description,
          content: data.editor,
          is_rolling_admission: data.is_rolling_admission,
          websites: sanitizeWebsites(data.websites),
        }),
      });

      if (res.status === 201) {
        isFormSubmitted.current = true;
        sessionStorage.removeItem(config.storageKey);
        alert(t('createSuccess', { kind: kindLabel }));
        router.push(config.routeBase);
        router.refresh();
      } else if (res.status === 401) {
        alert(t('loginRequired'));
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(t('createFailure', { kind: kindLabel }) + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      if (err?.status === 401) {
        alert(t('loginRequired'));
        pushLoginWithRedirect(router);
      } else {
        alert(err?.message || t('networkError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('createHeading', { kind: kindLabel })}</h1>
          <p className={styles.subtitle}>{t('createSubtitle', { kind: kindLabel })}</p>
        </div>
        <IgForm
          kind={kind}
          register={register}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          editorKey={0}
          isCreate={true}
          submitDisabled={!user || submitting}
          afterFields={
            <>
              <p className={styles.defaultTagHint}>
                {t.rich('tags.defaultHint', {
                  tag: config.tags[0],
                  strong: (text) => <strong>{text}</strong>,
                })}
              </p>
              <TextInput
                name="additionalTags"
                label={t('tags.additional')}
                placeholder={t('tags.additionalPlaceholder')}
                register={register}
                required={false}
              />
            </>
          }
        />
      </div>
    </div>
  );
}
