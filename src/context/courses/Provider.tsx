import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { CoursesContext, type CoursesContextType } from './Context';
import type { Course, CourseFormData } from '../../types/Course';
import { loadCourses, loadFavoriteCourses, saveCourses, saveFavoriteCourses } from './localStorage';
import { useCourseFilters } from '../../hooks/useCourseFilters';

interface Props {
  children: ReactNode;
}

const useCoursesFavoritesState = (courses: Course[], initialFavorites: () => Set<number>) => {
  const [favorites, setFavorites] = useState(initialFavorites);

  const toggleFavorite = (courseId: number) => {
    const newSet = new Set(favorites);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setFavorites(newSet);
  };

  const favoriteCourses = useMemo(
    () => courses.filter((course) => favorites.has(course.id)),
    [courses, favorites],
  );

  return { favorites, favoriteCourses, toggleFavorite };
};

const useInstructorsState = (courses: Course[]) => {
  const instructors = useMemo(() => {
    const uniqueInstructors = new Set(courses.map((course) => course.instructor.trim()));
    return Array.from(uniqueInstructors).sort();
  }, [courses]);

  return { instructors };
};

const useCourseContext = (): CoursesContextType => {
  const [courses, setCourses] = useState<Course[]>(loadCourses);
  const { favorites, favoriteCourses, toggleFavorite } = useCoursesFavoritesState(
    courses,
    loadFavoriteCourses,
  );
  const { category, instructor, level, searchQuery } = useCourseFilters();

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchQuery.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory = category === 'all' || category === course.category;
      const matchesLevel = level === 'all' || level === course.level;
      const matchesInstructor = instructor === '' || instructor === course.instructor;

      return matchesSearch && matchesCategory && matchesLevel && matchesInstructor;
    });
  }, [courses, category, instructor, level, searchQuery]);

  const { instructors } = useInstructorsState(courses);

  // const {
  //   filteredCourses,
  //   searchTerm,
  //   filterLevel,
  //   filterCategory,
  //   filterInstructor,
  //   setSearchTerm,
  //   setFilterLevel,
  //   setFilterCategory,
  //   setFilterInstructor,
  // } = useCourseFiltersState(courses);

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
    setCourses(courses.filter((course) => course.id !== id));
    if (favorites.has(id)) {
      toggleFavorite(id);
    }
  };

  useEffect(() => {
    saveCourses(courses);
  }, [courses]);

  useEffect(() => {
    saveFavoriteCourses(favorites);
  }, [favorites]);

  return {
    courses,
    favoriteCourses,
    filteredCourses,
    instructors,
    favorites,
    addCourse,
    getCourseById,
    updateCourse,
    deleteCourse,
    toggleFavorite,
  };
};

export const CoursesDataProvider = ({ children }: Props) => {
  const value = useCourseContext();

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};
