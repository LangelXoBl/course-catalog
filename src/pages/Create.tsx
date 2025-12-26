import { CourseForm } from '../components/CourseForm';
import { useCourses } from '../hooks/useCourses';
import type { CourseFormData } from '../types/Course';

export const Create = () => {
  const { addCourse } = useCourses();

  const handleAddCourse = (payload: CourseFormData) => addCourse(payload);

  return (
    <section className="flex flex-col items-center gap-2 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold">Crear un nuevo curso</h1>
      <CourseForm onSubmit={handleAddCourse} submitButtonText="Añadir" />
    </section>
  );
};
