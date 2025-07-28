"use client";

export default function DiscordBotPanel({is_logged_in}) {

  const discordLogin = async () => {
    const jwt = localStorage.getItem("jwt");
    const res = await fetch(`/api/bot/discord/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-jwt": jwt,
      },
    });
    if (res.status===204) {alert("로그인 성공!");}
    else {alert(`로그인 실패: ${await res.text()}`);}
  }
  
  return (
    <>
      <div>{is_logged_in ? "Bot is logged in" : "Bot is not logged in"}</div>
      <button onClick={discordLogin}>login discord bot</button>
    </>
  );
}
