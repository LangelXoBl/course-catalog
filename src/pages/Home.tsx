import { useCourses } from '../hooks/useCourses';

export const Home = () => {
  const { getFilteredCourses } = useCourses();
  const courses = getFilteredCourses();
  return (
    <>
      {courses.map((course) => {
        return <div key={course.id}>{course.title}</div>;
      })}
    </>
  );
};
