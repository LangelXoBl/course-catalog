import { useReducer } from 'react';
import { filterReducer, FiltersActionType } from '../../../reducers/filters';
import { FiltersCourseContext } from './Context';
import type { CourseLevel, CourseCategory } from '../../../types/Course';

export const FiltersCourseProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(filterReducer, {
    searchQuery: '',
    level: 'all',
    category: 'all',
    instructor: '',
  });

  const setSearchTerm = (term: string) => {
    dispatch({ type: FiltersActionType.CHANGE_SEARCH_QUERY, payload: term });
  };
  const setFilterLevel = (level: CourseLevel | 'all') => {
    dispatch({ type: FiltersActionType.CHANGE_LEVEL, payload: level });
  };
  const setFilterCategory = (category: CourseCategory | 'all') => {
    dispatch({ type: FiltersActionType.CHANGE_CATEGORY, payload: category });
  };
  const setFilterInstructor = (instructor: string) => {
    dispatch({ type: FiltersActionType.CHANGE_INSTRUCTOR, payload: instructor });
  };

  const resetFilters = () => {
    dispatch({ type: FiltersActionType.CLEAR_FILTERS });
  };

  return (
    <FiltersCourseContext.Provider
      value={{
        ...state,
        setSearchTerm,
        setFilterLevel,
        setFilterCategory,
        setFilterInstructor,
        resetFilters,
      }}
    >
      {children}
    </FiltersCourseContext.Provider>
  );
};
