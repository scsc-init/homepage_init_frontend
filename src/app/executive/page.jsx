import ScscStatusPanel from './ScscStatusPanel';
import DiscordBotPanel from './DiscordBotPanel';
import EnrollmentPolicyPanel from './EnrollmentPolicyPanel';
import { fetchGlobalStatus, fetchDiscordBotStatus } from '@/util/fetch/server-util';
import * as AdminLayout from '@/components/AdminLayout';
import { EXECUTIVE_NAV_ITEMS } from './navigation';

export default async function AdminPanel() {
  const [scscGlobalStatus, discordBotStatus] = await Promise.allSettled([
    fetchGlobalStatus(),
    fetchDiscordBotStatus(),
  ]);

  const resolvedScscGlobalStatus =
    scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value : null;

  return (
    <AdminLayout.AdminPanel>
      <AdminLayout.AdminPageList>
        {EXECUTIVE_NAV_ITEMS.map(({ title, description, href }) => {
          return (
            <AdminLayout.AdminPageCard key={href} href={href} title={title}>
              <AdminLayout.AdminPageCardContent>
                <h3>{title}</h3>
                <p>{description}</p>
              </AdminLayout.AdminPageCardContent>
            </AdminLayout.AdminPageCard>
          );
        })}
      </AdminLayout.AdminPageList>

      <div
        style={{
          border: '1px solid var(--color-button-alert-bg)',
          background: 'transparent',
          padding: '1rem',
          borderRadius: '1rem',
        }}
      >
        <span style={{ color: 'var(--color-button-alert-bg)', fontWeight: 600 }}>
          * 이 영역에는 시스템에 직접적인 영향을 미칠 수 있는 기능이 포함되어 있습니다. 조작 시
          주의해주세요. *
        </span>

        <h2>SCSC status 관리</h2>
        <AdminLayout.AdminSection>
          <EnrollmentPolicyPanel scscGlobalStatus={resolvedScscGlobalStatus} />
        </AdminLayout.AdminSection>
        <AdminLayout.AdminSection>
          <ScscStatusPanel
            scscGlobalStatus={resolvedScscGlobalStatus?.status}
            semester={resolvedScscGlobalStatus?.semester}
            year={resolvedScscGlobalStatus?.year}
          />
        </AdminLayout.AdminSection>
      </div>

      <h2>디스코드 봇 관리</h2>
      <AdminLayout.AdminSection>
        <DiscordBotPanel
          is_logged_in={
            discordBotStatus.status === 'fulfilled' ? discordBotStatus.value : 'error'
          }
        />
      </AdminLayout.AdminSection>
    </AdminLayout.AdminPanel>
  );
}
