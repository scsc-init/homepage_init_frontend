// src/app/executive/DiscordBotPanel.jsx (CLIENT)
'use client';
export default function DiscordBotPanel({ is_logged_in }) {
  const discordLogin = async () => {
    const res = await fetch(`/api/bot/discord/login`, {
      method: 'POST',
    });
    if (res.status === 204) alert('로그인 성공!');
    else alert(`로그인 실패: ${await res.text()}`);
  };

  return (
    <div className="adm-section">
      <div style={{ marginBottom: '0.5rem' }}>
        {is_logged_in === 'error'
          ? 'Server Error, failed to fetch bot status'
          : is_logged_in
            ? 'Bot is logged in'
            : 'Bot is not logged in'}
      </div>
      <button className="adm-button" onClick={discordLogin}>
        login discord bot
      </button>
    </div>
  );
}
