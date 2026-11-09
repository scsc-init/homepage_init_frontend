'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { fetchBackendClient } from '@/util/fetch/client';
import { formatExecutiveDate } from '@/app/executive/formatExecutiveDate';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default function ExternalMemberManagementPanel() {
  const t = useTranslations('Executive');
  const locale = useLocale();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetchBackendClient('/api/executive/user/external/applicants');

        if (!response.ok) {
          throw new Error(
            t('applicationsLoadFailedStatus', { value0: String(response.status) }),
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error(t('applicationsInvalid'));
        }

        setApplicants(data);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : t('applicationsLoadFailed'));
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [t]);

  const processApplication = async (application, action) => {
    const actionLabel = action === 'approve' ? t('approve') : t('reject');

    if (
      !window.confirm(
        t('confirmExternalApplication', {
          value0: String(application.name),
          value1: String(actionLabel),
        }),
      )
    ) {
      return;
    }

    setSaving((previous) => ({
      ...previous,
      [application.id]: true,
    }));

    try {
      const response = await fetchBackendClient(
        `/api/executive/user/external/${application.id}/${action}`,
        {
          method: 'POST',
        },
      );

      if (!response.ok) {
        let detail = null;

        try {
          detail = (await response.json())?.detail;
        } catch {
          detail = null;
        }

        alert(
          t('externalApplicationFailed', {
            value0: String(application.name),
            value1: String(actionLabel),
            value2: String(detail || response.status),
          }),
        );
        return;
      }

      setApplicants((previous) => previous.filter((item) => item.id !== application.id));

      alert(
        t('externalApplicationProcessed', {
          value0: String(application.name),
          value1: String(actionLabel),
        }),
      );
    } catch (error) {
      console.error(error);
      alert(
        t('externalApplicationNetworkError', {
          value0: String(application.name),
          value1: String(actionLabel),
        }),
      );
    } finally {
      setSaving((previous) => ({
        ...previous,
        [application.id]: false,
      }));
    }
  };

  return (
    <div>
      <h2>{t('externalApplications')}</h2>

      {loading ? (
        <p>{t('applicationsLoading')}</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <AdminLayout.AdminTableWrap>
          <AdminLayout.AdminTable>
            <thead>
              <tr>
                <th>{t('name')}</th>
                <th>{t('email')}</th>
                <th>{t('phone')}</th>
                <th>{t('studentId')}</th>
                <th>{t('applicationReason')}</th>
                <th>{t('applicationTime')}</th>
                <th>{t('process')}</th>
              </tr>
            </thead>

            <tbody>
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={7}>{t('noExternalApplications')}</td>
                </tr>
              ) : (
                applicants.map((application) => {
                  const isSaving = Boolean(saving[application.id]);

                  return (
                    <tr key={application.id}>
                      <td>{application.name}</td>
                      <td>{application.email}</td>
                      <td>{application.phone}</td>
                      <td>{application.student_id || '-'}</td>
                      <td>{application.reason || '-'}</td>
                      <td>{formatExecutiveDate(application.created_at, locale)}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            gap: '0.5rem',
                            justifyContent: 'center',
                          }}
                        >
                          <AdminLayout.AdminButton
                            type="button"
                            disabled={isSaving}
                            onClick={() => processApplication(application, 'approve')}
                          >
                            {t('approve')}
                          </AdminLayout.AdminButton>

                          <AdminLayout.AdminButton
                            type="button"
                            disabled={isSaving}
                            onClick={() => processApplication(application, 'reject')}
                          >
                            {t('reject')}
                          </AdminLayout.AdminButton>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </AdminLayout.AdminTable>
        </AdminLayout.AdminTableWrap>
      )}
    </div>
  );
}
