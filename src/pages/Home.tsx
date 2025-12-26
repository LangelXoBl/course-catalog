import { CourseCard } from '../components/CourseCard';
import { useCourses } from '../hooks/useCourses';

export const Home = () => {
  const { getFilteredCourses } = useCourses();
  const courses = getFilteredCourses();
  return (
    <div className="grid grid-cols-2 gap-4">
      {courses.map((course) => {
        return <CourseCard Course={course} />;
      })}
    </div>
  );
};
