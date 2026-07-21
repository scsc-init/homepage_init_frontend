'use client';

import { useEffect, useState } from 'react';
import { fetchBackendClient } from '@/util/fetch/client';
import { utc2kst } from '@/util/constants';
import * as AdminLayout from '@/components/AdminLayout';

export default function ExternalMemberManagementPanel() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await fetchBackendClient('/api/executive/user/external/applicants');

        if (!response.ok) {
          throw new Error(`신청 목록 조회 실패: ${response.status}`);
        }

        setApplicants(await response.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  const processApplication = async (application, action) => {
    const actionLabel = action === 'approve' ? '승인' : '거절';

    if (
      !window.confirm(
        `${application.name}님의 외부회원 가입 신청을 ${actionLabel}하시겠습니까?`,
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

        alert(`${application.name}님 ${actionLabel} 실패: ${detail || response.status}`);
        return;
      }

      setApplicants((previous) => previous.filter((item) => item.id !== application.id));

      alert(`${application.name}님 외부회원 가입 신청 ${actionLabel} 완료`);
    } finally {
      setSaving((previous) => ({
        ...previous,
        [application.id]: false,
      }));
    }
  };

  return (
    <div>
      <h2>외부회원 가입 신청자 목록</h2>

      {loading ? (
        <p>신청 목록을 불러오는 중입니다.</p>
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
                  <td colSpan={7}>대기 중인 외부회원 가입 신청이 없습니다.</td>
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
                            승인
                          </AdminLayout.AdminButton>

                          <AdminLayout.AdminButton
                            type="button"
                            disabled={isSaving}
                            onClick={() => processApplication(application, 'reject')}
                          >
                            거절
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
