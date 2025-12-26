import { CourseCard } from '../components/CourseCard';
import { FilterBar } from '../components/FilterBar';
import { SearchBar } from '../components/SearchBar';
import { useCourses } from '../hooks/useCourses';

export const Home = () => {
  const { getFilteredCourses } = useCourses();
  const courses = getFilteredCourses();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <SearchBar />
        <FilterBar />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {courses.map((course) => {
          return <CourseCard key={course.id} Course={course} />;
        })}
      </div>
    </div>
  );
};
