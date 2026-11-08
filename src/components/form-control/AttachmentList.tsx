'use client';

import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import styles from './Attachment.module.css';
import { useTranslations } from 'next-intl';

import type { AttachmentMeta } from '@/util/getAttachmentDownloadUrl';

type AttachmentListProps = {
  attachmentIds: string[];
  attachmentMetaMap: Map<string, AttachmentMeta>;
  label?: string;
};

export default function AttachmentList({
  attachmentIds,
  attachmentMetaMap,
  label,
}: AttachmentListProps) {
  const t = useTranslations('AttachmentList');

  return (
    <section className={styles.AttachmentSection}>
      <div className={styles.AttachmentHeader}>
        <div className={styles.AttachmentLabel}>{label ?? t('label')}</div>
      </div>
      <ul className={styles.AttachmentList}>
        {attachmentIds.map((attachmentId) => {
          const meta = attachmentMetaMap.get(attachmentId);
          const displayName = meta?.original_filename || attachmentId;

          return (
            <li key={attachmentId} className={styles.AttachmentItem}>
              <a
                className={styles.AttachmentLink}
                href={getAttachmentDownloadUrl(attachmentId, meta)}
                target="_blank"
                rel="noreferrer"
              >
                {displayName}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
