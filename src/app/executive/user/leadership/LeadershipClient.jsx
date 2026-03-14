'use client';

import { useState } from 'react';
import { ExecutiveUserTable } from '../UserList';

export default function LeadershipClient({ users, majors }) {
  const [debugMessage, setDebugMessage] = useState('');

  const handleShowDetail = (user) => {
    try {
      setDebugMessage(JSON.stringify(user, null, 2));
    } catch (_err) {
      setDebugMessage('사용자 정보를 출력하지 못했습니다.');
    }
  };

  return (
    <div>
      <ExecutiveUserTable users={users} majors={majors} onShowDetail={handleShowDetail} />
      <div style={{ marginTop: '1rem' }}>
        <label
          htmlFor="leadership-debug-console"
          style={{ display: 'block', marginBottom: '0.5rem' }}
        >
          디버깅 메시지 콘솔
        </label>
        <textarea
          id="leadership-debug-console"
          className="adm-input"
          style={{
            width: '100%',
            minHeight: '180px',
            fontFamily: 'monospace',
            resize: 'vertical',
          }}
          readOnly
          value={debugMessage}
          placeholder="상세 보기 버튼을 누르면 이곳에 JSON이 표시됩니다."
        />
      </div>
    </div>
  );
}
