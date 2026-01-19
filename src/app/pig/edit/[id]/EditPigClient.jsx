'use client';

import Editor from '@/components/board/EditorWrapper.jsx';
import PigForm from '@/components/board/PigForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

const mapWebsitesForForm = (websites = []) =>
  (Array.isArray(websites) ? websites : []).map((site) => ({
    url: site?.url ?? '',
  }));

const sanitizeWebsites = (websites = []) =>
  (Array.isArray(websites) ? websites : [])
    .map((site, index) => {
      const url = site?.url?.trim() ?? '';
      return { label: url || `링크 ${index + 1}`, url, sort_order: index };
    })
    .filter((site) => site.url);

export default function EditPigClient({ pigId, me, pig, article }) {
  const router = useRouter();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const mounted = useMounted();
  const [editorKey, setEditorKey] = useState(0);

  const defaultFormValues = {
    title: pig?.title ?? '',
    description: pig?.description ?? '',
    editor: article?.content ?? '',
    should_extend: pig?.should_extend ?? false,
    is_rolling_admission: pig?.is_rolling_admission ?? false,
    websites:
      pig && Array.isArray(pig.websites) && pig.websites.length > 0
        ? mapWebsitesForForm(pig.websites)
        : [{ url: '' }],
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: defaultFormValues,
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
    if (pig && article && mounted && !isDirty) {
      reset({ ...defaultFormValues });
      setEditorKey((key) => key + 1);
    }
  }, [pig, article, mounted, isDirty, reset]);

  const onSubmit = async (data) => {
    if (submitting) return;

    if (!me) {
      alert('잠시 뒤 다시 시도해주세요');
      return;
    } else if (!me.discord_id) {
      if (!confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?'))
        return;
    }
    setSubmitting(true);

    try {
      const endpoint =
        me.role >= minExecutiveLevel
          ? `/api/pig/${pigId}/update/executive`
          : `/api/pig/${pigId}/update`;

      const res = await fetch(endpoint, {
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
        isFormSubmitted.current = true;
        alert('PIG 수정 성공!');
        router.push(`/pig/${pigId}`);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
      } else {
        const err = await res.json();
        alert('PIG 수정 실패: ' + (err.detail ?? JSON.stringify(err)));
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
        <h1 className="CreatePigTitle">PIG 수정</h1>
      </div>
      <div className={`CreatePigCard ${submitting ? 'is-busy' : ''}`}>
        <PigForm
          register={register}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          Editor={Editor}
          editorKey={editorKey}
          isCreate={false}
        />
      </div>
    </div>
  );
}
