import { useNavigate, useParams } from 'react-router';
import { useCourses } from '../hooks/useCourses';

export const Details = () => {
  const { id } = useParams<{ id: string }>();
  const { getCourseById } = useCourses();

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const courseId = id ? parseInt(id) : undefined;
  const course = courseId ? getCourseById(courseId) : undefined;
  if (!course) {
    return <div>No se encontró el curso</div>;
  }
  return (
    <section className="flex flex-col items-center gap-2 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
      <div className="w-4/5 border border-muted rounded-lg p-4 bg-card">
        <p className="font-bold">
          Nivel: <span className="font-light">{course.level}</span>
        </p>
        <p className="font-bold">
          Categoría: <span className="font-light">{course.category}</span>
        </p>
        <p className="font-bold">
          Fecha de inicio: <span className="font-light">{course.start_date}</span>
        </p>
        <p className="font-bold">
          Duración: <span className="font-light">{course.duration}</span>
        </p>
        <p className="font-bold">
          Instructor: <span className="font-light">{course.instructor}</span>
        </p>
      </div>
      <button
        className="p-2 rounded-md text-white bg-primary hover:bg-primary/10 hover:text-primary"
        onClick={handleBack}
      >
        Volver
      </button>
    </section>
  );
};
