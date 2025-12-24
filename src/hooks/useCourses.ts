import { useContext } from 'react';
import { CoursesContext } from '../context/courses/Context';

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
};
