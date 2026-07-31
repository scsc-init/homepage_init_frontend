'use client';

import { useEffect, useState } from 'react';
import { fetchBackendClient } from '@/util/fetch/client';
import { utc2kst } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

export default function ExternalMemberManagementPanel() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetchBackendClient('/api/executive/user/external/applicants');

        if (response.status === 404) {
          setApplicants([]);
          setError('');
          return;
        }

        if (!response.ok) {
          throw new Error(`신청 목록 조회 실패: ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('신청 목록 응답 형식이 올바르지 않습니다.');
        }

        setApplicants(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : '신청 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const processApplication = async (application, action) => {
    const actionLabel = action === 'approve' ? '?뱀씤' : '嫄곗젅';

    if (
      !window.confirm(
        `${application.name}?섏쓽 ?몃??뚯썝 媛???좎껌??${actionLabel}?섏떆寃좎뒿?덇퉴?`,
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

        alert(`${application.name}??${actionLabel} ?ㅽ뙣: ${detail || response.status}`);
        return;
      }

      setApplicants((previous) => previous.filter((item) => item.id !== application.id));

      alert(`${application.name}???몃??뚯썝 媛???좎껌 ${actionLabel} ?꾨즺`);
    } catch (error) {
      console.error(error);
      alert(
        `${application.name}??${actionLabel} 泥섎━ 以??ㅽ듃?뚰겕 ?ㅻ쪟媛 諛쒖깮?덉뒿?덈떎.`,
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
      <h2>?몃??뚯썝 媛???좎껌??紐⑸줉</h2>

      {loading ? (
        <p>?좎껌 紐⑸줉??遺덈윭?ㅻ뒗 以묒엯?덈떎.</p>
      ) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <AdminLayout.AdminTableWrap>
          <AdminLayout.AdminTable>
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th>학번</th>
                <th>신청 사유</th>
                <th>신청 시각</th>
                <th>처리</th>
              </tr>
            </thead>

            <tbody>
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={7}>?湲?以묒씤 ?몃??뚯썝 媛???좎껌???놁뒿?덈떎.</td>
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
                      <td>{utc2kst(application.created_at)}</td>
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
                            ?뱀씤
                          </AdminLayout.AdminButton>

                          <AdminLayout.AdminButton
                            type="button"
                            disabled={isSaving}
                            onClick={() => processApplication(application, 'reject')}
                          >
                            嫄곗젅
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
