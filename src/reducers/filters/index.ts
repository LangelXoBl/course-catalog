import type { FiltersState } from '../../context/courses/filters/Context';
import type { CourseLevel, CourseCategory } from '../../types/Course';

export enum FiltersActionType {
  CHANGE_SEARCH_QUERY = 'CHANGE_SEARCH_QUERY',
  CHANGE_LEVEL = 'CHANGE_LEVEL',
  CHANGE_CATEGORY = 'CHANGE_CATEGORY',
  CHANGE_INSTRUCTOR = 'CHANGE_INSTRUCTOR',
  CLEAR_FILTERS = 'CLEAR_FILTERS',
}

type FiltersAction =
  | { type: FiltersActionType.CHANGE_SEARCH_QUERY; payload: string }
  | { type: FiltersActionType.CHANGE_LEVEL; payload: CourseLevel | 'all' }
  | { type: FiltersActionType.CHANGE_CATEGORY; payload: CourseCategory | 'all' }
  | { type: FiltersActionType.CHANGE_INSTRUCTOR; payload: string }
  | { type: FiltersActionType.CLEAR_FILTERS };

export const filterReducer = (state: FiltersState, action: FiltersAction): FiltersState => {
  switch (action.type) {
    case FiltersActionType.CHANGE_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case FiltersActionType.CHANGE_LEVEL:
      return { ...state, level: action.payload };
    case FiltersActionType.CHANGE_CATEGORY:
      return { ...state, category: action.payload };
    case FiltersActionType.CHANGE_INSTRUCTOR:
      return { ...state, instructor: action.payload };
    case FiltersActionType.CLEAR_FILTERS:
      return {
        searchQuery: '',
        level: 'all',
        category: 'all',
        instructor: '',
      };
    default:
      return state;
  }
};
