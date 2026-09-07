'use client';

import { fetchBackendClient } from '@/util/fetch/client';
import IgForm from '@/app/(ig)/components/editor/IgForm';
import SigTagManager from '@/app/(ig)/components/editor/SigTagManager';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { useMe } from '@/util/hooks/useMe';
import { mapWebsitesForForm, sanitizeWebsites } from '@/util/websites';

const EDIT_CONFIG = {
  sig: {
    upperLabel: 'SIG',
    routeBase: '/sig',
    targetLabel: undefined,
  },
  pig: {
    upperLabel: 'PIG',
    routeBase: '/pig',
    targetLabel: 'PIG',
  },
};

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

function generateDefaultForms(item, article) {
  return {
    title: item?.title ?? '',
    description: item?.description ?? '',
    editor: article?.content ?? '',
    should_extend: item?.should_extend ?? false,
    is_rolling_admission:
      typeof item?.is_rolling_admission === 'string'
        ? item.is_rolling_admission
        : 'during_recruiting',
    websites:
      item && Array.isArray(item.websites) && item.websites.length > 0
        ? mapWebsitesForForm(item.websites)
        : [{ url: '' }],
  };
}

export default function EditIgClient({ kind, itemId, item, article }) {
  const config = EDIT_CONFIG[kind];
  const { me, isLoading, isUnauthenticated } = useMe();
  const router = useRouter();
  const isFormSubmitted = useRef(false);
  const tagManagerRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const mounted = useMounted();
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (isUnauthenticated) pushLoginWithRedirect(router);
  }, [isUnauthenticated, router]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: generateDefaultForms(item, article),
  });

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

  useEffect(() => {
    if (item && article && mounted && !isDirty) {
      reset(generateDefaultForms(item, article));
      setEditorKey((key) => key + 1);
    }
  }, [item, article, mounted, isDirty, reset]);

  const onSubmit = async (data) => {
    if (submitting) return;

    if (!me) {
      alert('잠시 뒤 다시 시도해주세요');
      return;
    } else if (!me.discord_id) {
      if (
        !confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?')
      ) {
        return;
      }
    }
    setSubmitting(true);

    try {
      const endpoint =
        me.role >= minExecutiveLevel
          ? `/api/sig/${itemId}/update/executive`
          : `/api/sig/${itemId}/update`;

      const res = await fetchBackendClient(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.editor,
          should_extend: data.should_extend,
          is_rolling_admission: data.is_rolling_admission,
          websites: sanitizeWebsites(data.websites),
        }),
      });

      if (res.status === 204) {
        await tagManagerRef.current?.syncTags();
        isFormSubmitted.current = true;
        alert(`${config.upperLabel} 수정 성공!`);
        router.push(`${config.routeBase}/${itemId}`);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json();
        alert(`${config.upperLabel} 수정 실패: ` + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || isUnauthenticated || !me) return null;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{`${config.upperLabel} 수정`}</h1>
        </div>
        <IgForm
          kind={kind}
          register={register}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          editorKey={editorKey}
          isCreate={false}
          afterFields={
            <SigTagManager
              ref={tagManagerRef}
              sigId={itemId}
              initialTags={item?.tags}
              isExecutive={Boolean(me?.role >= minExecutiveLevel)}
              disabled={submitting}
              targetLabel={config.targetLabel}
            />
          }
        />
      </div>
    </div>
  );
}
