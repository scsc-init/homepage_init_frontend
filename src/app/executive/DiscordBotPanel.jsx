// src/app/executive/DiscordBotPanel.jsx (CLIENT)
'use client';

import * as AdminLayout from '@/components/AdminLayout';

export default function DiscordBotPanel({ is_logged_in }) {
  const discordLogin = async () => {
    const res = await fetchBackendClient(
      `/api/bot/discord/login`,
      {
        method: 'POST',
      },
      true,
    );
    if (res.status === 204) alert('로그인 성공!');
    else alert(`로그인 실패: ${await res.text()}`);
  };

  return (
    <AdminLayout.AdminSection>
      <div style={{ marginBottom: '0.5rem' }}>
        {is_logged_in === 'error'
          ? 'Server Error, failed to fetch bot status'
          : is_logged_in
            ? 'Bot is logged in'
            : 'Bot is not logged in'}
      </div>
      <AdminLayout.AdminButton onClick={discordLogin}>
        login discord bot
      </AdminLayout.AdminButton>
    </AdminLayout.AdminSection>
  );
}
