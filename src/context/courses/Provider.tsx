import { useState, type ReactNode } from 'react';
import { CoursesContext, type CoursesContextType } from './Context';
import type { Course, CourseCategory, CourseFormData, CourseLevel } from '../../types/Course';

interface Props {
  children: ReactNode;
}
export const CoursesProvider = ({ children }: Props) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [favorites, setFavorites] = useState(new Set<number>());
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
