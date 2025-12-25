import { useEffect, useState, type ReactNode } from 'react';
import { CoursesContext, type CoursesContextType } from './Context';
import type { Course, CourseCategory, CourseFormData, CourseLevel } from '../../types/Course';
import { initialCourses } from '../../constants/seedCourses';

interface Props {
  children: ReactNode;
}

const COURSE_STORAGE_KEY = 'courses';
const FAVORITES_STORAGE_KEY = 'favorite_courses';

const loadCourses = () => {
  const storedCourses = localStorage.getItem(COURSE_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : initialCourses;
};

const saveCourses = (courses: Course[]) => {
  localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(courses));
};

const loadFavoriteCourses = (): Set<number> => {
  const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
  return storedFavorites ? new Set(JSON.parse(storedFavorites)) : new Set<number>();
};

const saveFavoriteCourses = (favorites: Set<number>) => {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
};

export const CoursesProvider = ({ children }: Props) => {
  const [courses, setCourses] = useState<Course[]>(loadCourses());
  const [favorites, setFavorites] = useState(loadFavoriteCourses());
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<CourseLevel | 'all'>('all');
  const [filterCategory, setFilterCategory] = useState<CourseCategory | 'all'>('all');

  const addCourse = (payload: CourseFormData) => {
    const maxId = Math.max(0, ...courses.map((course) => course.id));
    const newCourse: Course = { ...payload, id: maxId + 1 };

    setCourses([...courses, newCourse]);
  };

  const getCourseById = (id: number) => {
    return courses.find((course) => course.id === id);
  };

  const updateCourse = (id: number, payload: CourseFormData) => {
    const newCourses = courses.map((course) => {
      if (course.id === id) return { ...course, ...payload };
      return course;
    });

    setCourses(newCourses);
  };

  const deleteCourse = (id: number) => {
    setCourses(courses.filter((course) => course.id === id));
  };

  const toggleFavorite = (courseId: number) => {
    const newSet = new Set(favorites);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setFavorites(newSet);
  };

  const getFavoriteCourses = () => {
    return courses.filter((course) => favorites.has(course.id));
  };

  const getFilteredCourses = () => {
    return courses.filter((course) => {
      const validCategory = filterCategory === 'all' ? true : filterCategory === course.category;
      const validLevel = filterLevel === 'all' ? true : filterLevel === course.level;

      return validCategory && validLevel;
    });
  };

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    saveFavoriteCourses(favorites);
  }, [favorites]);

  const value: CoursesContextType = {
    courses,
    favorites,
    searchTerm,
    filterLevel,
    filterCategory,
    setSearchTerm,
    setFilterLevel,
    setFilterCategory,
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleFavorite,
    getFavoriteCourses,
    getFilteredCourses,
  };

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};
