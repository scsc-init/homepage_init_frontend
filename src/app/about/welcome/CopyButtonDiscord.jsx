'use client';


export default function CopyButtonDiscord() {

    
    return (
    <button onClick={() => navigator.clipboard.writeText("https://discord.gg/SmXFDxA7XE")} className="copy-discord-link">
    🔗COPY
    </button>
  );
}