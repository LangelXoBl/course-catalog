import { useContext } from 'react';

import { FiltersCourseContext } from '../context/courses/filters/Context';

export const useCourseFilters = () => {
  const context = useContext(FiltersCourseContext);
  if (!context) {
    throw new Error('useCourseFilters must be used within a FiltersCourseProvider');
  }
  return context;
};
