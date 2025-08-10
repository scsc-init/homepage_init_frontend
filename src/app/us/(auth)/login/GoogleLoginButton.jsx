import { useEffect } from "react";
import "./page.css";

export default function GoogleLoginButton() {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
      <div className="google-signin-button-wrapper">
        <div
          id='g_id_onload'
          data-client_id="876662086445-m79pj1qjg0v7m7efqhqtboe7h0ra4avm.apps.googleusercontent.com"
          data-callback="handleCredentialResponse"
          data-auto_prompt="false"
        />
        <div
          className="g_id_signin"
          data-type="standard"
          data-size="large"
          data-theme="outline"
          data-text="sign_in_with"
          data-shape="rectangular"
          data-logo_alignment="left"
        ></div>
      </div>
  );
};
