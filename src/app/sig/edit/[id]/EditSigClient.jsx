'use client';

import Editor from '@/components/board/EditorWrapper.jsx';
import SigForm from '@/components/board/SigForm';
import SigTagManager from '@/components/board/SigTagManager';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';
import { pushLoginWithRedirect } from '@/util/loginRedirect';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function EditSigClient({ sigId, me, sig, article }) {
  const router = useRouter();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const mounted = useMounted();
  const [editorKey, setEditorKey] = useState(0);
  const initialTags = useMemo(() => (Array.isArray(sig?.tags) ? sig.tags : []), [sig?.tags]);
  const [pendingTags, setPendingTags] = useState(initialTags);

  const {
    register,
    control,
    handleSubmit,
    reset,
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
      setPendingTags(Array.isArray(sig?.tags) ? sig.tags : []);
      setEditorKey((k) => k + 1);
    }
  }, [sig, article, mounted, isDirty, reset]);

  const syncTags = async () => {
    const originalTags = Array.isArray(sig?.tags) ? sig.tags : [];
    const currentTags = Array.isArray(pendingTags) ? pendingTags : [];

    const originalIdSet = new Set(
      originalTags
        .filter((tag) => !String(tag.id).startsWith('temp-'))
        .map((tag) => String(tag.id)),
    );

    const currentExistingTags = currentTags.filter(
      (tag) => !String(tag.id).startsWith('temp-'),
    );
    const currentExistingIdSet = new Set(currentExistingTags.map((tag) => String(tag.id)));
    const removedTags = originalTags.filter((tag) => !currentExistingIdSet.has(String(tag.id)));
    const addedExistingTags = currentExistingTags.filter(
      (tag) => !originalIdSet.has(String(tag.id)),
    );
    const newTags = currentTags.filter(
      (tag) => Boolean(tag?.__isNew) || String(tag.id).startsWith('temp-'),
    );

    for (const tag of removedTags) {
      const res = await fetch(`/api/sig/${sigId}/tag/${tag.id}`, {
        method: 'DELETE',
      });

      if (!res.ok && res.status !== 204) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? '태그 삭제 실패');
      }
    }

    for (const tag of addedExistingTags) {
      const res = await fetch(`/api/sig/${sigId}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: Number(tag.id) }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail ?? '기존 태그 추가 실패');
      }
    }

    for (const tag of newTags) {
      const createRes = await fetch(
        me.role >= minExecutiveLevel ? '/api/executive/tag' : '/api/tag',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(
            me.role >= minExecutiveLevel
              ? { text: tag.text, is_major: Boolean(tag.is_major) }
              : { text: tag.text },
          ),
        },
      );

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}));
        throw new Error(err.detail ?? '새 태그 생성 실패');
      }

      const createdTag = await createRes.json();

      const addRes = await fetch(`/api/sig/${sigId}/tag`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_id: createdTag.id }),
      });

      if (!addRes.ok) {
        const err = await addRes.json().catch(() => ({}));
        throw new Error(err.detail ?? '새 태그 연결 실패');
      }
    }
  };

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
      const res = await fetch(
        me.role >= minExecutiveLevel
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
        await syncTags();
        isFormSubmitted.current = true;
        alert('SIG 수정 성공!');
        router.push(`/sig/${sigId}`);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        pushLoginWithRedirect(router);
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
      <div className={`CreateSigCard ${submitting ? 'is-busy' : ''}`}>
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
      <div className={`CreateSigCard ${submitting ? 'is-busy' : ''}`}>
        <SigTagManager
          initialTags={initialTags}
          isExecutive={Boolean(me?.role >= minExecutiveLevel)}
          onChange={setPendingTags}
          disabled={submitting}
        />
      </div>
    </div>
  );
}
