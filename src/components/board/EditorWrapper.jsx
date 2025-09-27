// components/sig/EditorWrapper.jsx
'use client';

import dynamic from 'next/dynamic';

// NOTE(unknown): `forwardRef: true` ensures that refs are properly 
// passed down to the dynamically imported MDXEditor component.
const Editor = dynamic(() => import('./MDXEditor.jsx'), {
  ssr: false,
  loading: () => <p>로딩 중...</p>,
  forwardRef: true,
});

export default Editor;
