import { createContext } from 'react';

import type { CourseCategory, CourseLevel } from '../../../types/Course';

export interface FiltersState {
  searchQuery: string;
  level: CourseLevel | 'all';
  category: CourseCategory | 'all';
  instructor: string;
}

interface FiltersAction {
  setSearchTerm: (term: string) => void;
  setFilterLevel: (level: CourseLevel | 'all') => void;
  setFilterCategory: (category: CourseCategory | 'all') => void;
  setFilterInstructor: (instructor: string) => void;
  resetFilters: () => void;
}

export const FiltersCourseContext = createContext<(FiltersState & FiltersAction) | undefined>(
  undefined,
);
