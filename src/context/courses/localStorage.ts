import { initialCourses } from '../../constants/seedCourses';

import type { Course } from '../../types/Course';

const COURSE_STORAGE_KEY = 'courses';
const FAVORITES_STORAGE_KEY = 'favorite_courses';

export const loadCourses = () => {
  const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : initialCourses;
};

export const saveCourses = (courses: Course[]) => {
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
};

export const loadFavoriteCourses = (): Set<number> => {
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set<number>();
};

export const saveFavoriteCourses = (favorites: Set<number>) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
};
