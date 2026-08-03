// /app/sig/[id]/loading.jsx
'use client';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="SigDetailContainer" style={{ minHeight: '40vh' }}>
      <LoadingSpinner />
    </div>
  );
}
