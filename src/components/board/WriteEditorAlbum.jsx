'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AttachmentSection from '@/components/board/AttachmentSection';
import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';

export default function WriteEditorAlbum({ boardInfo, onSubmit, submitting }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { title: '', description: '' },
  });

  const [attachmentIds, setAttachmentIds] = useState([]);

  const handleInternalSubmit = (data) => {
    const imageMarkdown = attachmentIds
      .map((id) => {
        const encoded = encodeURIComponent(id);
        const url = `/api/image/download/${encoded}`;

        return `![album_image](${url})`;
      })
      .join('\n\n');

    onSubmit({
      title: data.title,
      editor: `${imageMarkdown}\n\n${data.description || ''}`,
      attachments: attachmentIds,
    });
  };

  return (
    <div className="CreateSigCard space-y-10 p-6">
      <form onSubmit={handleSubmit(handleInternalSubmit)} className="space-y-8">
        <div className="p-6 border-2 border-dashed rounded-xl bg-gray-50/5 text-center mb-4">
          <p className="mb-4 font-bold text-blue-400">앨범에 올릴 사진을 선택해주세요</p>
          <AttachmentSection
            valueIds={attachmentIds}
            onChangeIds={setAttachmentIds}
            uploadType="image"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-400">앨범 제목</label>
          <input
            type="text"
            {...register('title', { required: true })}
            placeholder="앨범 제목 (예: 즐거운 워크샵 사진)"
            className="w-full border p-3 rounded text-lg font-semibold"
          />
        </div>

        <textarea
          {...register('description')}
          placeholder="Write a short description of the picture"
          className="w-full h-32 border p-3 rounded"
        />

        <button
          type="submit"
          className="SigCreateBtn w-full py-4 rounded-xl font-bold transition-all"
          disabled={submitting}
          style={{
            backgroundColor: submitting ? '#6B7280' : '#128e9f',
            cursor: submitting ? 'not-allowed' : 'pointer',
            color: 'white',
            border: 'none',
          }}
        >
          {submitting ? '업로드 중...' : '앨범 등록하기'}
        </button>
      </form>
    </div>
  );
}
