import { useParams, Navigate } from 'react-router';
import { CourseForm } from '../components/CourseForm';
import { useCourses } from '../hooks/useCourses';
import type { CourseFormData } from '../types/Course';

export const Edit = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourseById, updateCourse } = useCourses();

  const courseId = id ? parseInt(id) : undefined;
  const course = courseId ? getCourseById(courseId) : undefined;

  if (!course) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (data: CourseFormData) => {
    if (courseId) {
      updateCourse(courseId, data);
    }
  };

  return (
    <section className="flex flex-col items-center gap-2 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold">Editar curso</h1>
      <CourseForm
        initialData={{ ...course }}
        onSubmit={handleSubmit}
        submitButtonText="Actualizar Curso"
      />
    </section>
  );
};
