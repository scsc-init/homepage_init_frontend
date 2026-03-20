'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Button from '@/components/Button';

export default function SigCreateButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    if (loading) return;

    setLoading(true);
    router.push('/sig/create');
  };

  return (
    <Button.Root id="SigCreateButton" onClick={handleClick} disabled={loading}>
      {loading ? '로딩 중...' : '시그 만들기'}
    </Button.Root>
  );
}
