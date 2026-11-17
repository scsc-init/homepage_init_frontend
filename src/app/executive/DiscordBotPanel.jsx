// src/app/executive/DiscordBotPanel.jsx (CLIENT)
'use client';

import { useTranslations } from 'next-intl';
import * as AdminLayout from '@/app/executive/AdminLayout';
import { fetchBackendClient } from '@/util/fetch/client';

export default function DiscordBotPanel({ is_logged_in }) {
  const t = useTranslations('Executive');
  const discordLogin = async () => {
    const res = await fetchBackendClient(`/api/bot/discord/login`, {
      method: 'POST',
    });
    if (res.status === 204) alert(t('loginSuccess'));
    else alert(t('loginFailed', { value0: String(await res.text()) }));
  };

  return (
    <AdminLayout.AdminSection>
      <div style={{ marginBottom: '0.5rem' }}>
        {is_logged_in === 'error'
          ? t('botStatusError')
          : is_logged_in
            ? t('botLoggedIn')
            : t('botLoggedOut')}
      </div>
      <AdminLayout.AdminButton onClick={discordLogin}>{t('botLogin')}</AdminLayout.AdminButton>
    </AdminLayout.AdminSection>
  );
}
