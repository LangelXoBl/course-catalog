import { Link } from 'react-router';
import { CourseCard } from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';

export const Favorites = () => {
  const { getFavoriteCourses } = useCourses();
  const favoriteCourses = getFavoriteCourses();

  return (
    <section className="flex flex-col items-center gap-2 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold">Cursos favoritos</h1>

      {favoriteCourses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 p-4">
          <p>No tienes cursos favoritos aún.</p>
          <p>
            Explora los{' '}
            <Link className="text-primary hover:underline" to="/">
              cursos disponibles
            </Link>{' '}
            y marca tus favoritos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {favoriteCourses.map((course) => (
            <CourseCard key={course.id} Course={course} />
          ))}
        </div>
      )}
    </section>
  );
};
