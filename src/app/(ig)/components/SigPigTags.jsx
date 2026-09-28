'use client';

function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function sortSigPigTags(tags) {
  return [...(Array.isArray(tags) ? tags : [])]
    .filter((tag) => tag?.text)
    .sort((a, b) => {
      if (!!a?.is_major !== !!b?.is_major) return a?.is_major ? -1 : 1;
      return String(a?.text ?? '').localeCompare(String(b?.text ?? ''), 'ko');
    });
}

export function getSigPigAvailableTags(items) {
  const tagByText = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    sortSigPigTags(item?.tags).forEach((tag) => {
      if (!tagByText.has(tag.text)) tagByText.set(tag.text, tag);
    });
  });

  return sortSigPigTags([...tagByText.values()]);
}

export function filterSigPigItemsByTags(items, selectedTags) {
  const safeItems = Array.isArray(items) ? items : [];
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags.filter(Boolean) : [];
  if (safeSelectedTags.length === 0) return safeItems;

  return safeItems.filter((item) => {
    const itemTagTexts = new Set(sortSigPigTags(item?.tags).map((tag) => tag.text));
    return safeSelectedTags.every((tagText) => itemTagTexts.has(tagText));
  });
}

export function SigPigTagList({ tags, itemId, listClassName, tagClassName, majorClassName }) {
  const sortedTags = sortSigPigTags(tags);
  if (sortedTags.length === 0) return null;

  return (
    <div className={listClassName}>
      {sortedTags.map((tag) => (
        <span
          key={`${itemId ?? 'sig-pig'}-${tag.id ?? tag.text}`}
          className={cx(tagClassName, tag.is_major ? majorClassName : '')}
        >
          #{tag.text}
        </span>
      ))}
    </div>
  );
}

export function SigPigTagFilter({ items, selectedTags, onChange, classNames }) {
  const safeSelectedTags = Array.isArray(selectedTags) ? selectedTags : [];
  const availableTags = getSigPigAvailableTags(items);

  const updateSelectedTags = (nextTags) => {
    onChange?.(nextTags);
  };

  const toggleTagFilter = (tagText) => {
    const exists = safeSelectedTags.includes(tagText);
    const nextTags = exists
      ? safeSelectedTags.filter((tag) => tag !== tagText)
      : [...safeSelectedTags, tagText];

    updateSelectedTags(nextTags);
  };

  const clearTagFilter = () => {
    updateSelectedTags([]);
  };

  return (
    <div className={classNames.section}>
      <div className={classNames.header}>
        <span className={classNames.title}>태그 필터</span>
        {safeSelectedTags.length > 0 ? (
          <button type="button" className={classNames.clearButton} onClick={clearTagFilter}>
            초기화
          </button>
        ) : null}
      </div>

      <div className={classNames.list}>
        <button
          type="button"
          className={cx(
            classNames.chip,
            safeSelectedTags.length === 0 ? classNames.active : '',
          )}
          onClick={clearTagFilter}
        >
          #전체
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag.id ?? tag.text}
            type="button"
            className={cx(
              classNames.chip,
              safeSelectedTags.includes(tag.text) ? classNames.active : '',
              tag.is_major ? classNames.major : '',
            )}
            onClick={() => toggleTagFilter(tag.text)}
          >
            #{tag.text}
          </button>
        ))}
      </div>
    </div>
  );
}
