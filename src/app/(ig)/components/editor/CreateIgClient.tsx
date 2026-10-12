'use client';

import IgForm from '@/app/(ig)/components/editor/IgForm';
import styles from '@/app/(ig)/components/editor/IgEditorPage.module.css';
import type {
  AdmissionMode,
  IgFormValues,
  IgKind,
  WebsiteFormValue,
} from '@/app/(ig)/components/editor/types';
import { isAdmissionMode } from '@/app/(ig)/components/editor/types';
import { fetchBackendClient } from '@/util/fetch/client';
import { useMe } from '@/util/hooks/useMe';
import { pushLoginWithRedirect } from '@/util/loginRedirect';
import { sanitizeWebsites } from '@/util/websites';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

type CreateIgClientProps = {
  kind: IgKind;
  scscGlobalStatus: string | null;
};

type CreateConfig = {
  upperLabel: 'SIG' | 'PIG';
  storageKey: string;
  routeBase: '/sig' | '/pig';
  tags: string[];
  subtitle: string;
  getDefaultRolling: (status: string | null) => AdmissionMode;
  shouldWarnRolling: (status: string | null, value: AdmissionMode) => boolean;
};

type RouterEvents = {
  emit?: (event: 'routeChangeError') => void;
  on?: (event: 'routeChangeStart', handler: () => void) => void;
  off?: (event: 'routeChangeStart', handler: () => void) => void;
};

type RouterWithEvents = ReturnType<typeof useRouter> & {
  events?: RouterEvents;
};

const CREATE_CONFIG: Record<IgKind, CreateConfig> = {
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
    getDefaultRolling: (status) => (status === 'active' ? 'always' : 'during_recruiting'),
    shouldWarnRolling: (status, value) =>
      status === 'active' && (value === 'during_recruiting' || value === 'never'),
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeWebsites(value: unknown): WebsiteFormValue[] {
  if (!Array.isArray(value)) return [{ url: '' }];

  const websites = value.filter(isRecord).map((entry) => ({
    url: typeof entry.url === 'string' ? entry.url : '',
  }));

  return websites.length > 0 ? websites : [{ url: '' }];
}

function createDefaultValues(defaultRolling: AdmissionMode): IgFormValues {
  return {
    title: '',
    description: '',
    editor: '',
    should_extend: false,
    is_rolling_admission: defaultRolling,
    websites: [{ url: '' }],
  };
}

function parseStoredValues(
  raw: string | null,
  defaultRolling: AdmissionMode,
): IgFormValues | null {
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;

    return {
      title: typeof parsed.title === 'string' ? parsed.title : '',
      description: typeof parsed.description === 'string' ? parsed.description : '',
      editor: typeof parsed.editor === 'string' ? parsed.editor : '',
      should_extend: parsed.should_extend === true,
      is_rolling_admission: isAdmissionMode(parsed.is_rolling_admission)
        ? parsed.is_rolling_admission
        : defaultRolling,
      websites: normalizeWebsites(parsed.websites),
    };
  } catch {
    return null;
  }
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

export default function CreateIgClient({ kind, scscGlobalStatus }: CreateIgClientProps) {
  const config = CREATE_CONFIG[kind];
  const router = useRouter();
  const routerWithEvents = router as RouterWithEvents;
  const { me: user, isLoading, isUnauthenticated } = useMe();
  const isFormSubmitted = useRef<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const defaultRolling = config.getDefaultRolling(scscGlobalStatus);

  const parsed = useMemo(
    () =>
      typeof window === 'undefined'
        ? null
        : parseStoredValues(sessionStorage.getItem(config.storageKey), defaultRolling),
    [config.storageKey, defaultRolling],
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isDirty },
  } = useForm<IgFormValues>({
    defaultValues: parsed ?? createDefaultValues(defaultRolling),
  });

  useEffect(() => {
    const stored = parseStoredValues(sessionStorage.getItem(config.storageKey), defaultRolling);
    if (stored) reset(stored);
  }, [config.storageKey, defaultRolling, reset]);

  useEffect(() => {
    if (isLoading) return;
    if (isUnauthenticated || !user) pushLoginWithRedirect(router);
  }, [isLoading, isUnauthenticated, router, user]);

  const watched = watch();

  useEffect(() => {
    if (!isFormSubmitted.current) {
      sessionStorage.setItem(config.storageKey, JSON.stringify(watched));
    }
  }, [config.storageKey, watched]);

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

  const onSubmit = async (data: IgFormValues): Promise<void> => {
    if (submitting) return;

    if (!user) {
      window.alert('잠시 뒤 다시 시도해주세요');
      return;
    }

    if (config.shouldWarnRolling(scscGlobalStatus, data.is_rolling_admission)) {
      const confirmed = window.confirm(
        '가입 기간 자유화를 활성화하지 않으면 다른 사람이 가입할 수 없습니다. 그래도 계속 진행하시겠습니까?',
      );
      if (!confirmed) return;
    } else if (!hasDiscordId(user)) {
      const confirmed = window.confirm(
        '계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?',
      );
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      const response = await fetchBackendClient('/api/sig/create', {
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

      if (response.status === 201) {
        isFormSubmitted.current = true;
        sessionStorage.removeItem(config.storageKey);
        window.alert(`${config.upperLabel} 생성 성공!`);
        router.push(config.routeBase);
        router.refresh();
      } else if (response.status === 401) {
        window.alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const detail = await readErrorDetail(response);
        window.alert(`${config.upperLabel} 생성 실패: ${detail}`);
      }
    } catch (error) {
      window.alert(getErrorMessage(error, '네트워크 오류'));
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
          isCreate
        />
      </div>
    </div>
  );
}
