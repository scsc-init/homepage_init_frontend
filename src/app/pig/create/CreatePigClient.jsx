'use client';

import PigForm from '@/components/board/PigForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

const sanitizeWebsites = (websites = []) =>
  (Array.isArray(websites) ? websites : [])
    .map((site, index) => {
      const url = site?.url?.trim() ?? '';
      return { label: url || `링크 ${index + 1}`, url, sort_order: index };
    })
    .filter((site) => site.url);

export default function CreatePigClient({ scscGlobalStatus }) {
  const router = useRouter();
  const [user, setUser] = useState();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);

  const saved = typeof window !== 'undefined' ? sessionStorage.getItem('pigForm') : null;
  const parsed = saved ? JSON.parse(saved) : null;

  const defaultFormValues = {
    title: parsed?.title ?? '',
    description: parsed?.description ?? '',
    editor: parsed?.editor ?? '',
    is_rolling_admission:
      typeof parsed?.is_rolling_admission === 'string'
        ? String(parsed.is_rolling_admission)
        : scscGlobalStatus === 'active'
          ? 'always'
          : 'during_recruiting',
    websites:
      parsed && Array.isArray(parsed.websites) && parsed.websites.length > 0
        ? parsed.websites
        : [{ url: '' }],
  };

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/user/profile`);
      if (res.ok) setUser(await res.json());
      else pushLoginWithRedirect(router);
    };
    fetchProfile();
  }, [router]);

  const watched = watch();
  useEffect(() => {
    if (!isFormSubmitted.current) {
      sessionStorage.setItem('pigForm', JSON.stringify(watched));
    }
  }, [watched]);

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
    } else if (
      scscGlobalStatus === 'active' &&
      (data.is_rolling_admission === 'during_recruiting' ||
        data.is_rolling_admission === 'never')
    ) {
      if (
        !confirm(
          '가입 기간 자유화를 활성화하지 않으면 다른 사람이 가입할 수 없습니다. 그래도 계속 진행하시겠습니까?',
        )
      )
        return;
    } else if (!user.discord_id) {
      if (!confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?'))
        return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(`/api/pig/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          content: data.editor,
          is_rolling_admission: data.is_rolling_admission,
          websites: sanitizeWebsites(data.websites),
        }),
      });

      if (res.status === 201) {
        alert('PIG 생성 성공!');
        isFormSubmitted.current = true;
        sessionStorage.removeItem('pigForm');
        router.push('/pig');
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json();
        alert('PIG 생성 실패: ' + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="CreatePigContainer">
      <div className="CreatePigHeader">
        <h1 className="CreatePigTitle">PIG 생성</h1>
        <p className="CreatePigSubtitle">새로운 PIG를 만들어 보세요.</p>
      </div>
      <div className={`CreatePigCard ${submitting ? 'is-busy' : ''}`}>
        <PigForm
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
