import { Link } from 'react-router';

export const Navbar = () => {
  return (
    <nav>
      <Link to="/">Catálogo de Cursos</Link>
      <ul>
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
    </nav>
  );
};
