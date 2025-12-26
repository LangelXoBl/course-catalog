import { Link } from 'react-router';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  return (
    <nav className="bg-surface text-content shadow-md py-4">
      <div className="w-3/5 mx-auto flex justify-between items-center">
        <Link className="text-primary text-2xl font-bold" to="/">
          Catálogo de Cursos
        </Link>
        <div className="flex gap-4">
          <ul className="flex gap-4 list-none">
            <li>
              <Link
                className="p-2 rounded-md font-medium hover:bg-primary/10 hover:text-primary"
                to="/"
              >
                Todos los Cursos
              </Link>
            </li>
            <li>
              <Link
                className="p-2 rounded-md font-medium hover:bg-primary/10 hover:text-primary"
                to="/favorites"
              >
                Favoritos
              </Link>
            </li>
            <li>
              <Link
                className="p-2 rounded-md font-medium hover:bg-primary/10 hover:text-primary"
                to="/create"
              >
                + Crear Curso
              </Link>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
