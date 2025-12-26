import { labelCategory, labelLevel } from '../constants/seedCourses';
import { useCourses } from '../hooks/useCourses';
import type { Course } from '../types/Course';
import { FavoriteToggle } from './FavoriteToggle';
import { ClockIcon } from './icons/Clock';
import { LevelIcon } from './icons/Level';
import { Link, useNavigate } from 'react-router';

interface Props {
  Course: Course;
}

const getCategoryLabel = (category: Course['category']) => {
  return labelCategory[category];
};

const getLevelLabel = (level: Course['level']) => {
  return labelLevel[level];
};

export const CourseCard = ({ Course }: Props) => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, deleteCourse } = useCourses();

  const isFavorite = favorites.has(Course.id);

  const handleDelete = () => {
    if (window.confirm(`¿Estás seguro de eliminar el curso "${Course.title}"?`)) {
      deleteCourse(Course.id);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-card text-content border-2 border-tertiary hover:border-primary p-2 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.01] transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Link className="text-primary hover:underline" to={`/details/${Course.id}`}>
            <span className="font-bold text-xl">{Course.title}</span>
          </Link>
          <span className="text-muted">{Course.instructor}</span>
        </div>
        <FavoriteToggle isFavorite={isFavorite} onClick={() => toggleFavorite(Course.id)} />
      </div>
      <div className="flex flex-wrap gap-2">
        <span className="border border-tertiary text-sm px-2 py-1 rounded-md">
          {getCategoryLabel(Course.category)}
        </span>
        <div className="flex items-center gap-1 border border-tertiary text-sm px-2 py-1 rounded-md">
          <LevelIcon className="fill-content" />
          <span>{getLevelLabel(Course.level)}</span>
        </div>
        <div className="flex items-center gap-1 border border-tertiary text-sm px-2 py-1 rounded-md">
          <ClockIcon className="fill-content" />
          <span>{Course.duration}</span>
        </div>
      </div>
      <p>{Course.description}</p>
      <div className="flex justify-end gap-2">
        <button
          className="p-2 rounded-md text-white bg-primary hover:bg-primary/10 hover:text-primary"
          type="button"
          onClick={() => navigate('/edit/' + Course.id)}
        >
          Editar
        </button>
        <button
          className="p-2 rounded-md text-white bg-danger hover:bg-danger/10 hover:text-danger"
          type="button"
          onClick={handleDelete}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};
