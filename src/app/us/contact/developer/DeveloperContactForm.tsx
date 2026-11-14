'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('UsDeveloperContact');
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
        message: t('required'),
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
          throw new Error(t('invalidInput'));
        }
        if (response.status === 503) {
          throw new Error(t('serviceUnavailable'));
        }
        throw new Error(t('sendFailed', { status: response.status }));
      }

      setValues(INITIAL_VALUES);
      setFeedback({
        type: 'success',
        message: t('success'),
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error instanceof Error ? error.message : t('unknownError'),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.activityBlock}>
      <div className={styles.sectionHeader}>DEVELOPER CONTACT:</div>
      <p className={styles.developerContactDescription}>{t('description')}</p>

      <form className={styles.developerContactForm} onSubmit={handleSubmit}>
        <fieldset className={styles.developerContactFieldset} disabled={submitting}>
          <div className={styles.developerContactGrid}>
            <label className={styles.developerContactField}>
              <span className={styles.developerContactLabel}>{t('name')}</span>
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
              <span className={styles.developerContactLabel}>{t('replyEmail')}</span>
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
              <span className={styles.developerContactLabel}>{t('subject')}</span>
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
              <span className={styles.developerContactLabel}>{t('message')}</span>
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
              {submitting ? t('sending') : t('send')}
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
