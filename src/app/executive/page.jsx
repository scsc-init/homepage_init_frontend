import { getTranslations } from 'next-intl/server';
import ScscStatusPanel from './ScscStatusPanel';
import DiscordBotPanel from './DiscordBotPanel';
import EnrollmentPolicyPanel from './EnrollmentPolicyPanel';
import { fetchGlobalStatus, fetchDiscordBotStatus } from '@/util/fetch/server-util';
import * as AdminLayout from '@/app/executive/AdminLayout';

export default async function AdminPanel() {
  const t = await getTranslations('Executive');
  const [scscGlobalStatus, discordBotStatus] = await Promise.allSettled([
    fetchGlobalStatus(),
    fetchDiscordBotStatus(),
  ]);

  const resolvedScscGlobalStatus =
    scscGlobalStatus.status === 'fulfilled' ? scscGlobalStatus.value : null;

  return (
    <AdminLayout.AdminPanel>
      <div
        style={{
          border: '1px solid var(--color-button-alert-bg)',
          background: 'transparent',
          padding: '1rem',
          borderRadius: '1rem',
        }}
      >
        <span style={{ color: 'var(--color-button-alert-bg)', fontWeight: 600 }}>
          {t('systemWarning')}
        </span>

        <h2>{t('scscStatus')}</h2>
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

      <h2>{t('discordBotManagement')}</h2>
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
