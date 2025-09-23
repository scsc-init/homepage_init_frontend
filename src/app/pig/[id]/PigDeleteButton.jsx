'use client';

export default function PigDeleteButton({ pigId, canDelete, isOwner }) {
  const [pending, setPending] = useState(false);
  const router = useRouter();

  const readError = async (res) => {
    const base = `HTTP ${res.status}`;
    const ct = res.headers.get('content-type') || '';
    try {
      if (ct.includes('application/json')) {
        const body = await res.json();
        const detail = body?.detail ?? body?.message ?? body?.error;
        return detail ? `${base} - ${detail}` : `${base} - ${JSON.stringify(body)}`;
      }
      const text = await res.text();
      return text ? `${base} - ${text}` : base;
    } catch {
      return base;
    }
  };

  const deleteBySelf = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/pig/${pigId}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert('PIG 비활성화 성공!');
        router.refresh();
      } else {
        alert('PIG 비활성화 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('PIG 비활성화 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  const deleteByExec = async () => {
    try {
      setPending(true);
      const res = await fetch(`/api/pig/${pigId}/delete/executive`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        alert('PIG 비활성화 성공!');
        router.refresh();
      } else {
        alert('PIG 비활성화 실패: ' + (await readError(res)));
      }
    } catch (e) {
      alert('PIG 비활성화 실패: ' + (e?.message || '네트워크 오류'));
    } finally {
      setPending(false);
    }
  };

  return canDelete ? (
    <button
      type="button"
      className={`PigButton is-delete`}
      onClick={isOwner ? deleteBySelf : deleteByExec}
      disabled={pending}
      aria-busy={pending}
    >
      {'피그 비활성화'}
    </button>
  ) : null;
}
