'use client';

import { useTranslations } from 'next-intl';
import { fetchBackendClient } from '@/util/fetch/client';
import IgForm from '@/app/(ig)/components/editor/IgForm';
import SigTagManager from '@/app/(ig)/components/editor/SigTagManager';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const categoryTags = Object.values(CREATE_CONFIG).flatMap(({ tags }) => tags);

export default function CreateIgClient({ kind, scscGlobalStatus }) {
  const config = CREATE_CONFIG[kind];
  const t = useTranslations('Ig');
  const kindLabel = t(`kind.${kind}`);
  const router = useRouter();
  const { me: user, isLoading, isUnauthenticated } = useMe();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [creatingTag, setCreatingTag] = useState(false);
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
      selectedTags: [],
    },
  });

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(config.storageKey);
      if (saved) reset({ selectedTags: [], ...JSON.parse(saved) });
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
    if (submitting || creatingTag || isFormSubmitted.current) return;

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
      const res = await fetchBackendClient('/api/sig/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          tags: [...new Set([...config.tags, ...data.selectedTags.map((tag) => tag.text)])],
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
      alert(err?.message || t('networkError'));
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
          submitDisabled={!user || submitting || creatingTag}
          afterFields={
            <Controller
              name="selectedTags"
              control={control}
              render={({ field }) => (
                <SigTagManager
                  isCreate
                  selectedTags={field.value}
                  onSelectedTagsChange={field.onChange}
                  excludedTagTexts={categoryTags}
                  onCreatingTagChange={setCreatingTag}
                  isExecutive={Boolean(user?.role >= minExecutiveLevel)}
                  disabled={!user || submitting}
                  targetLabel={kindLabel}
                />
              )}
            />
          }
        />
      </div>
    </div>
  );
}
