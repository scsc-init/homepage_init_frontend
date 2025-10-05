'use client';

import Editor from '@/components/board/EditorWrapper.jsx';
import SigForm from '@/components/board/SigForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function EditSigClient({ sigId, me, sig, article }) {
  const router = useRouter();
  const currentUser = me;
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const mounted = useMounted();
  const [editorKey, setEditorKey] = useState(0);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      editor: '',
      should_extend: false,
      is_rolling_admission: false,
    },
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
    if (sig && article && mounted && !isDirty) {
      reset({
        title: sig.title ?? '',
        description: sig.description ?? '',
        editor: article.content ?? '',
        should_extend: sig.should_extend ?? false,
        is_rolling_admission: sig.is_rolling_admission ?? false,
      });
      setEditorKey((k) => k + 1);
    }
  }, [sig, article, mounted, isDirty, reset]);

  const onSubmit = async (data) => {
    if (!currentUser) {
      alert('잠시 뒤 다시 시도해주세요');
      return;
    } else if (!currentUser.discord_id) {
      if (!confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?')) return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(
        currentUser.role >= minExecutiveLevel
          ? `/api/sig/${sigId}/update/executive`
          : `/api/sig/${sigId}/update`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            content: data.editor,
            should_extend: data.should_extend,
            is_rolling_admission: data.is_rolling_admission,
          }),
        },
      );

      if (res.status === 204) {
        isFormSubmitted.current = true;
        alert('SIG 수정 성공!');
        router.push(`/sig/${sigId}`);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/us/login');
      } else {
        const err = await res.json();
        alert('SIG 수정 실패: ' + (err.detail ?? JSON.stringify(err)));
      }
    } catch (err) {
      alert(err.message || '네트워크 오류');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="CreateSigContainer">
      <div className="CreateSigHeader">
        <h1 className="CreateSigTitle">SIG 수정</h1>
      </div>
      <div className="CreateSigCard">
        <SigForm
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
