'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import IgForm from '@/app/(ig)/components/editor/IgForm';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useMe } from '@/util/hooks/useMe';
import { sanitizeWebsites } from '@/util/websites';

const CREATE_CONFIG = {
  sig: {
    upperLabel: 'SIG',
    storageKey: 'sigForm',
    routeBase: '/sig',
    tags: ['SIG'],
    subtitle: '새로운 SIG를 만들어 보세요',
    getDefaultRolling: (status) => (status === 'active' ? 'always' : 'during_recruiting'),
    shouldWarnRolling: (status, value) => status === 'active' && !value,
  },
  pig: {
    upperLabel: 'PIG',
    storageKey: 'pigForm',
    routeBase: '/pig',
    tags: ['PIG'],
    subtitle: '새로운 PIG를 만들어 보세요',
    getDefaultRolling: (status) =>
      typeof status === 'active' ? 'always' : 'during_recruiting',
    shouldWarnRolling: (status, value) =>
      status === 'active' && (value === 'during_recruiting' || value === 'never'),
  },
};

export default function CreateIgClient({ kind, scscGlobalStatus }) {
  const config = CREATE_CONFIG[kind];
  const router = useRouter();
  const { me: user, isLoading, isUnauthenticated } = useMe();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const parsed = useMemo(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = sessionStorage.getItem(config.storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, [config.storageKey]);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: parsed || {
      title: '',
      description: '',
      editor: '',
      is_rolling_admission: config.getDefaultRolling(scscGlobalStatus),
    },
  });

  useEffect(() => {
    const saved = sessionStorage.getItem(config.storageKey);
    if (!saved) return;
    try {
      reset(JSON.parse(saved));
    } catch {}
  }, [config.storageKey, reset]);

  useEffect(() => {
    if (isLoading) return;
    if (isUnauthenticated || !user) {
      pushLoginWithRedirect(router);
    }
  }, [isLoading, isUnauthenticated, router, user]);

  const watched = watch();
  useEffect(() => {
    if (!isFormSubmitted.current) {
      sessionStorage.setItem(config.storageKey, JSON.stringify(watched));
    }
  }, [config.storageKey, watched]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isFormSubmitted.current && isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    const handleRouteChange = () => {
      if (!isFormSubmitted.current && isDirty) {
        const confirmed = confirm('작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?');
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
  }, [isDirty, router]);

  const onSubmit = async (data) => {
    if (submitting) return;

    if (!user) {
      alert('잠시 뒤 다시 시도해주세요');
      return;
    } else if (config.shouldWarnRolling(scscGlobalStatus, data.is_rolling_admission)) {
      if (
        !confirm(
          '가입 기간 자유화를 활성화하지 않으면 다른 사람이 가입할 수 없습니다. 그래도 계속 진행하시겠습니까?',
        )
      ) {
        return;
      }
    } else if (!user.discord_id) {
      if (
        !confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?')
      ) {
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
          tags: config.tags,
          description: data.description,
          content: data.editor,
          is_rolling_admission: data.is_rolling_admission,
          websites: sanitizeWebsites(data.websites),
        }),
      });

      if (res.status === 201) {
        isFormSubmitted.current = true;
        sessionStorage.removeItem(config.storageKey);
        alert(`${config.upperLabel} 생성 성공!`);
        router.push(config.routeBase);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(`${config.upperLabel} 생성 실패: ` + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err?.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{`신규 ${config.upperLabel} 개설`}</h1>
          <p className={styles.subtitle}>{config.subtitle}</p>
        </div>
        <IgForm
          kind={kind}
          register={register}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          editorKey={0}
          isCreate={true}
        />
      </div>
    </div>
  );
}
