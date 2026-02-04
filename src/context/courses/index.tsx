import { FiltersCourseProvider } from './filters/Provider';
import { CoursesDataProvider } from './Provider';

export const CoursesProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <FiltersCourseProvider>
      <CoursesDataProvider>{children}</CoursesDataProvider>
    </FiltersCourseProvider>
  );
};
