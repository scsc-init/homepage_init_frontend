'use client';

import IgForm from '@/app/(ig)/components/editor/IgForm';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import SigTagManager from '@/app/(ig)/components/editor/SigTagManager';
import type {
  AdmissionMode,
  IgArticle,
  IgFormValues,
  IgItem,
  IgKind,
  SigTagManagerHandle,
} from '@/app/(ig)/components/editor/types';
import { isAdmissionMode } from '@/app/(ig)/components/editor/types';
import { minExecutiveLevel } from '@/util/constants';
import { fetchBackendClient } from '@/util/fetch/client';
import { useMe } from '@/util/hooks/useMe';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { mapWebsitesForForm, sanitizeWebsites } from '@/util/websites';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type EditIgClientProps = {
  kind: IgKind;
  itemId: string;
  item: IgItem;
  article: IgArticle;
};

type EditConfig = {
  upperLabel: 'SIG' | 'PIG';
  routeBase: '/sig' | '/pig';
  targetLabel?: 'PIG';
};

type RouterEvents = {
  emit?: (event: 'routeChangeError') => void;
  on?: (event: 'routeChangeStart', handler: () => void) => void;
  off?: (event: 'routeChangeStart', handler: () => void) => void;
};

type RouterWithEvents = ReturnType<typeof useRouter> & {
  events?: RouterEvents;
};

const EDIT_CONFIG: Record<IgKind, EditConfig> = {
  sig: {
    upperLabel: 'SIG',
    routeBase: '/sig',
  },
  pig: {
    upperLabel: 'PIG',
    routeBase: '/pig',
    targetLabel: 'PIG',
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getUserRole(value: unknown): number {
  return isRecord(value) && typeof value.role === 'number' ? value.role : 0;
}

function hasDiscordId(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.discord_id === 'string' &&
    value.discord_id.trim().length > 0
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

async function readErrorDetail(response: Response): Promise<string> {
  const data: unknown = await response.json().catch(() => null);
  if (isRecord(data) && typeof data.detail === 'string') return data.detail;
  return data === null ? '알 수 없는 오류' : JSON.stringify(data);
}

function useMounted(): boolean {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}

function normalizeAdmissionMode(value: unknown): AdmissionMode {
  return isAdmissionMode(value) ? value : 'during_recruiting';
}

function generateDefaultForms(item: IgItem, article: IgArticle): IgFormValues {
  const websites =
    Array.isArray(item.websites) && item.websites.length > 0
      ? (mapWebsitesForForm(
          item.websites as Parameters<typeof mapWebsitesForForm>[0],
        ) as IgFormValues['websites'])
      : [{ url: '' }];

  return {
    title: item.title ?? '',
    description: item.description ?? '',
    editor: article.content ?? '',
    should_extend: item.should_extend ?? false,
    is_rolling_admission: normalizeAdmissionMode(item.is_rolling_admission),
    websites,
  };
}

export default function EditIgClient({ kind, itemId, item, article }: EditIgClientProps) {
  const config = EDIT_CONFIG[kind];
  const { me, isLoading, isUnauthenticated } = useMe();
  const router = useRouter();
  const routerWithEvents = router as RouterWithEvents;
  const isFormSubmitted = useRef<boolean>(false);
  const tagManagerRef = useRef<SigTagManagerHandle | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const mounted = useMounted();
  const [editorKey, setEditorKey] = useState<number>(0);

  useEffect(() => {
    if (isUnauthenticated) pushLoginWithRedirect(router);
  }, [isUnauthenticated, router]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<IgFormValues>({
    defaultValues: generateDefaultForms(item, article),
  });

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      if (!isFormSubmitted.current && isDirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    const handleRouteChange = (): void => {
      if (!isFormSubmitted.current && isDirty) {
        const confirmed = window.confirm('작성 중인 내용이 있습니다. 페이지를 떠나시겠습니까?');
        if (!confirmed) {
          routerWithEvents.events?.emit?.('routeChangeError');
          throw new Error('Route change aborted by user.');
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    routerWithEvents.events?.on?.('routeChangeStart', handleRouteChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      routerWithEvents.events?.off?.('routeChangeStart', handleRouteChange);
    };
  }, [isDirty, routerWithEvents]);

  useEffect(() => {
    if (mounted && !isDirty) {
      reset(generateDefaultForms(item, article));
      setEditorKey((key) => key + 1);
    }
  }, [article, isDirty, item, mounted, reset]);

  const onSubmit = async (data: IgFormValues): Promise<void> => {
    if (submitting) return;

    if (!me) {
      window.alert('잠시 뒤 다시 시도해주세요');
      return;
    }

    if (!hasDiscordId(me)) {
      const confirmed = window.confirm(
        '계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?',
      );
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      const endpoint =
        getUserRole(me) >= minExecutiveLevel
          ? `/api/sig/${itemId}/update/executive`
          : `/api/sig/${itemId}/update`;

      const response = await fetchBackendClient(endpoint, {
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

      if (response.status === 204) {
        await tagManagerRef.current?.syncTags();
        isFormSubmitted.current = true;
        window.alert(`${config.upperLabel} 수정 성공!`);
        router.push(`${config.routeBase}/${itemId}`);
        router.refresh();
      } else if (response.status === 401) {
        window.alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const detail = await readErrorDetail(response);
        window.alert(`${config.upperLabel} 수정 실패: ${detail}`);
      }
    } catch (error) {
      window.alert(getErrorMessage(error, '네트워크 오류'));
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
              initialTags={item.tags}
              isExecutive={getUserRole(me) >= minExecutiveLevel}
              disabled={submitting}
              targetLabel={config.targetLabel}
            />
          }
        />
      </div>
    </div>
  );
}
