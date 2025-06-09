// app/sig/create/page.jsx
import { cookies } from "next/headers";
import CreateSigClient from "./CreateSigClient";

export default async function CreateSigPage() {
  const cookieStore = cookies();
  const res = await fetch("http://localhost:8080/api/user/profile", {
    method: "GET",
    headers: {
      Cookie: cookieStore
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; "),
      "x-api-secret": "some-secret-code",
    },
  });

  if (res.status === 401) {
    // redirect to login if needed
    return <p>로그인이 필요합니다.</p>;
  }

  const data = await res.json();
  return <CreateSigClient userId={data.id} />;
}
