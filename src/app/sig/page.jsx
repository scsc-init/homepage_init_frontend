import SigCreateButton from "./SigCreateButton";

export default async function SigListPage() {
  const res = await fetch("http://localhost:8080/api/sigs", {
    method: "GET",
    headers: {
      "x-api-secret": "some-secret-code",
    },
    credentials: "include",
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    // SSR에선 redirect 못하므로 안내 메시지
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        로그인 후 이용 가능합니다.
      </div>
    );
  }

  const data = await res.json();

  return (
    <div id="SigListContainer" className="p-6 max-w-4xl mx-auto">
      <div id="SigList">
        <h1 className="text-2xl font-bold mb-4">시그 리스트</h1>
        <SigCreateButton />
        <hr className="my-4" />
        {data.map((sig) => (
          <div key={sig.id} className="border rounded p-4 mb-4 bg-white shadow">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{sig.title}</h2>
            </div>
            <p className="text-gray-700">{sig.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
