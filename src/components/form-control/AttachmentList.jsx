'use client';

import { getAttachmentDownloadUrl } from '@/util/getAttachmentDownloadUrl';
import styles from './Attachment.module.css';

export default function AttachmentList({
  attachmentIds,
  attachmentMetaMap,
  label = '첨부 파일',
}) {
  return (
    <section className={styles.AttachmentSection}>
      <div className={styles.AttachmentHeader}>
        <div className={styles.AttachmentLabel}>{label}</div>
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
