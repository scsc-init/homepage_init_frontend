// @/util/helper/tostring.ts

import { AcademicTerm } from '@/types/system';
import { SEMESTER_MAP } from '@/util/constants';

export function semester2string(semester: number) {
  const v = SEMESTER_MAP[semester];
  return v ? `${v}학기` : `err학기`;
}

export function academicTerm2string(term: AcademicTerm) {
  return `${term.year}년 ${semester2string(term.semester)}`;
}
