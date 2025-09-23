'use client';

import Editor from '@/components/board/EditorWrapper.jsx';
import PigForm from '@/components/board/PigForm';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { minExecutiveLevel } from '@/util/constants';

function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export default function EditPigClient({ pigId }) {
  const router = useRouter();
  const [user, setUser] = useState();
  const isFormSubmitted = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [pig, setPig] = useState(null);
  const [article, setArticle] = useState(null);
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
    // 기본값에 is_rolling_admission 추가 (빠져있던 부분 복구)
    defaultValues: {
      title: '',
      description: '',
      editor: '',
      should_extend: false,
      is_rolling_admission: false,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(`/api/user/profile`);
      if (res.ok) setUser(await res.json());
      else router.push('/us/login');
    };
    fetchProfile();

    const fetchPigData = async () => {
      const res = await fetch(`/api/pig/${pigId}`);
      if (!res.ok) {
        alert('피그 정보를 불러오지 못했습니다.');
        router.push('/pig');
        return;
      }
      const pig = await res.json();
      setPig(pig);

      const articleRes = await fetch(`/api/article/${pig.content_id}`);
      if (!articleRes.ok) {
        alert('피그 정보를 불러오지 못했습니다.');
        router.push('/pig');
        return;
      }
      const article = await articleRes.json();
      setArticle(article);
    };
    fetchPigData();
  }, [router, pigId]);

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
    if (!user) {
      alert('잠시 뒤 다시 시도해주세요');
      return;
    } else if (!user.discord_id) {
      if (!confirm('계정에 디스코드 계정이 연결되지 않았습니다. 그래도 계속 진행하시겠습니까?'))
        return;
    }
    setSubmitting(true);

    try {
      const res = await fetch(
        user.role >= minExecutiveLevel
          ? `/api/pig/${pigId}/update/executive`
          : `/api/pig/${pigId}/update`,
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
        alert('PIG 수정 성공!');
        router.push(`/pig/${pigId}`);
        router.refresh();
      } else if (res.status === 401) {
        alert('로그인이 필요합니다.');
        router.push('/us/login');
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

  useEffect(() => {
    if (pig && article && mounted) {
      reset({
        title: pig.title ?? '',
        description: pig.description ?? '',
        editor: article.content ?? '',
        should_extend: pig.should_extend ?? false,
        is_rolling_admission: pig.is_rolling_admission ?? false,
      });
      setEditorKey((k) => k + 1);
    }
  }, [pig, article, mounted, reset]);

  return (
    <div className="CreatePigContainer">
      <div className="CreatePigHeader">
        <h1 className="CreatePigTitle">PIG 수정</h1>
      </div>
      <div className="CreatePigCard">
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
