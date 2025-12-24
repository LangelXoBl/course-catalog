import { useCourses } from '../hooks/useCourses';

export const Create = () => {
  const { addCourse } = useCourses();
  const handleAddCourse = () => {
    addCourse({
      title: 'React desde 0',
      description:
        'En este modulo aprenderás los fundamentos de React, incluyendo componentes, hooks, y manejo de estado.',
      instructor: 'Ana García',
      level: 'principiante',
      category: 'web_development',
      start_date: '2025-01-15',
      duration: '8 horas',
    });
  };
  return <button onClick={handleAddCourse}>Añadir</button>;
};
