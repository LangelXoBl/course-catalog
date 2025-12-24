import { Link } from 'react-router';

export const Navbar = () => {
  return (
    <nav className="bg-surface text-content shadow-md">
      <div className="w-3/5 mx-auto flex justify-between items-center gap-8">
        <Link className="text-primary text-2xl font-bold" to="/">
          Catálogo de Cursos
        </Link>
        <ul className="flex gap-4 list-none">
          <li>
            <Link to="/">Todos los Cursos</Link>
          </li>
          <li>
            <Link to="/favorites">Favoritos</Link>
          </li>
          <li>
            <Link to="/create">+ Crear Curso</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};
