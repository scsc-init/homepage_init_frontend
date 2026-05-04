// @/util/helper/system.ts

import type { GlobalStatus, AcademicTerm } from '@/types/system';

const PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export function buildImageUrl(id: number): string {
  const relative = `/api/image/download/${encodeURIComponent(id)}`;
  return `${PUBLIC_BACKEND_URL}${relative}`;
}

/** The current academic term from global status. */
export function getCurrentTerm(status: GlobalStatus): AcademicTerm {
  return { year: status.year, semester: status.semester };
}

/** Returns the previous academic term. */
export function getPrevTerm(term: AcademicTerm): AcademicTerm {
  return term.semester === 1
    ? { year: term.year - 1, semester: 4 }
    : { year: term.year, semester: term.semester - 1 };
}

/** Returns the next academic term. */
export function getNextTerm(term: AcademicTerm): AcademicTerm {
  return term.semester === 4
    ? { year: term.year + 1, semester: 1 }
    : { year: term.year, semester: term.semester + 1 };
}
