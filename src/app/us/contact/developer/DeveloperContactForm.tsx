'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

import { fetchBackendClient } from '@/util/fetch/client';

import styles from './page.module.css';

type ContactFormValues = {
  name: string;
  email: string;
  title: string;
  content: string;
};

type Feedback = {
  type: 'success' | 'error';
  message: string;
} | null;

const INITIAL_VALUES: ContactFormValues = {
  name: '',
  email: '',
  title: '',
  content: '',
};

export default function DeveloperContactForm() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof ContactFormValues;

    setValues((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
    setFeedback(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    const payload: ContactFormValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      title: values.title.trim(),
      content: values.content.trim(),
    };

    if (!payload.name || !payload.email || !payload.title || !payload.content) {
      setFeedback({
        type: 'error',
        message: '모든 항목을 입력해주세요.',
      });
      return;
    }

    try {
      setSubmitting(true);
      setFeedback(null);

      const response = await fetchBackendClient('/api/bot/discord/developer/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 422) {
          throw new Error('입력값의 형식과 길이를 확인해주세요.');
        }
        if (response.status === 503) {
          throw new Error('문의 서비스를 잠시 사용할 수 없습니다.');
        }
        throw new Error(`문의 전송에 실패했습니다. (${response.status})`);
      }

      setValues(INITIAL_VALUES);
      setFeedback({
        type: 'success',
        message: '개발자 문의가 전달되었습니다.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : '문의 전송 중 알 수 없는 오류가 발생했습니다.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.activityBlock}>
      <div className={styles.sectionHeader}>DEVELOPER CONTACT:</div>
      <p className={styles.developerContactDescription}>
        홈페이지 오류나 개선 의견을 개발팀에 보내주세요. 로그인하지 않아도 문의할 수 있습니다.
      </p>

      <form className={styles.developerContactForm} onSubmit={handleSubmit}>
        <fieldset className={styles.developerContactFieldset} disabled={submitting}>
          <div className={styles.developerContactGrid}>
            <label className={styles.developerContactField}>
              <span className={styles.developerContactLabel}>이름</span>
              <input
                className={styles.developerContactInput}
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                autoComplete="name"
                minLength={1}
                maxLength={50}
                required
              />
            </label>

            <label className={styles.developerContactField}>
              <span className={styles.developerContactLabel}>회신 이메일</span>
              <input
                className={styles.developerContactInput}
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </label>

            <label
              className={`${styles.developerContactField} ${styles.developerContactFullWidth}`}
            >
              <span className={styles.developerContactLabel}>제목</span>
              <input
                className={styles.developerContactInput}
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                minLength={1}
                maxLength={100}
                required
              />
            </label>

            <label
              className={`${styles.developerContactField} ${styles.developerContactFullWidth}`}
            >
              <span className={styles.developerContactLabel}>문의 내용</span>
              <textarea
                className={styles.developerContactTextarea}
                name="content"
                value={values.content}
                onChange={handleChange}
                minLength={1}
                maxLength={1500}
                required
              />
            </label>
          </div>

          <div className={styles.developerContactFooter}>
            <button
              className={styles.developerContactSubmit}
              type="submit"
              disabled={submitting}
            >
              {submitting ? '전송 중...' : '문의 보내기'}
            </button>

            {feedback && (
              <p
                className={`${styles.developerContactFeedback} ${
                  feedback.type === 'success'
                    ? styles.developerContactSuccess
                    : styles.developerContactError
                }`}
                role={feedback.type === 'error' ? 'alert' : 'status'}
              >
                {feedback.message}
              </p>
            )}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
