import { useCourses } from '../hooks/useCourses';
import type { CourseLevel, CourseCategory } from '../types/Course';

export const FilterBar = () => {
  const { filterLevel, filterCategory, setFilterLevel, setFilterCategory } = useCourses();

  return (
    <div className="flex gap-2 items-center text-content">
      <div className="flex gap-2 items-center">
        <label className="text-lg" htmlFor="level-filter">
          Nivel:
        </label>
        <select
          id="level-filter"
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value as CourseLevel | 'all')}
          className="p-2 border-2 border-tertiary rounded-lg bg-surface"
        >
          <option value="all">Todos</option>
          <option value="beginner">Principiante</option>
          <option value="intermediate">Intermedio</option>
          <option value="advanced">Avanzado</option>
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <label className="text-lg" htmlFor="category-filter">
          Categoría:
        </label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as CourseCategory | 'all')}
          className="p-2 border-2 border-tertiary rounded-lg bg-surface"
        >
          <option value="all">Todas</option>
          <option value="web_development">Desarrollo Web</option>
          <option value="mobile_development">Desarrollo Móvil</option>
          <option value="data_science">Ciencia de Datos</option>
          <option value="design">Diseño</option>
          <option value="business">Negocios</option>
        </select>
      </div>
    </div>
  );
};
