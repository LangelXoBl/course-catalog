import { createContext } from 'react';
import type { Course, CourseLevel, CourseCategory, CourseFormData } from '../../types/Course';

export interface CoursesContextType {
  courses: Course[];
  favoriteCourses: Course[];
  filteredCourses: Course[];
  instructors: string[];
  favorites: Set<number>;
  // searchTerm: string;
  // filterLevel: CourseLevel | 'all';
  // filterCategory: CourseCategory | 'all';
  // filterInstructor: string;
  // setSearchTerm: (term: string) => void;
  // setFilterLevel: (level: CourseLevel | 'all') => void;
  // setFilterCategory: (category: CourseCategory | 'all') => void;
  // setFilterInstructor: (instructor: string) => void;
  addCourse: (course: CourseFormData) => void;
  updateCourse: (id: number, course: CourseFormData) => void;
  deleteCourse: (id: number) => void;
  toggleFavorite: (id: number) => void;
  getCourseById: (id: number) => Course | undefined;
}

export const CoursesContext = createContext<CoursesContextType | undefined>(undefined);
