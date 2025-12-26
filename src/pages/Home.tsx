import { CourseCard } from '../components/CourseCard';
import { FilterBar } from '../components/FilterBar';
import { SearchBar } from '../components/SearchBar';
import { useCourses } from '../hooks/useCourses';

export const Home = () => {
  const { getFilteredCourses } = useCourses();
  const courses = getFilteredCourses();
  return (
    <section className="flex flex-col items-center gap-8 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold">Cursos disponibles</h1>
      <div className=" w-full flex justify-between items-center gap-4">
        <SearchBar />
        <FilterBar />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {courses.map((course) => {
          return <CourseCard key={course.id} Course={course} />;
        })}
      </div>
    </section>
  );
};
