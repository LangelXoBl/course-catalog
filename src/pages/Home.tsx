import { CourseCard } from '../components/CourseCard';
import { FilterBar } from '../components/FilterBar';
import { SearchBar } from '../components/SearchBar';
import { useCourses } from '../hooks/useCourses';

export const Home = () => {
  console.log('Home rendered');
  return (
    <section className="flex flex-col gap-4 p-4 bg-surface text-content shadow-xl rounded-2xl">
      <h1 className="text-2xl font-bold text-center">Cursos disponibles</h1>
      <div className=" w-full flex justify-between items-center gap-4">
        <SearchBar />
        <FilterBar />
      </div>
      <GridCourses />
    </section>
  );
};

const GridCourses = () => {
  console.log('GridCourses rendered');
  const { filteredCourses } = useCourses();
  return (
    <>
      <span className="text-muted">Mostrando {filteredCourses.length} cursos</span>
      <div className="grid grid-cols-2 gap-4">
        {filteredCourses.map((course) => {
          return <CourseCard key={course.id} Course={course} />;
        })}
      </div>
    </>
  );
};
