# Catálogo de Cursos - React

Aplicación web de Catálogo de Cursos desarrollada con React, TypeScript, React Router y Context API. Permite crear, visualizar, buscar, filtrar y marcar cursos como favoritos.

## Tecnologías Utilizadas

- React
- TypeScript
- React Router
- Vite
- Tailwind CSS

## Características

- **CRUD Completo**: Crear, leer, actualizar y eliminar(con confirmación) cursos
- **Navegación**: Implementada con React Router
- **Gestión de Estado**: Context API + Custom Hook
- **Búsqueda en Tiempo Real**: Por título o instructor
- **Filtros**: Por categoría y nivel
- **Favoritos**: Marcar/desmarcar cursos favoritos
- **Persistencia**: LocalStorage para cursos, favoritos y tema (oscuro/claro)
- **Formularios Controlados**: Validación de campos
- **Responsive Design**: Adaptable a diferentes dispositivos
- **TypeScript**: Tipado estático para mayor seguridad

## Instalación y Ejecución

### Prerequisitos

- Node.js (v18 o superior)
- pnpm, npm o yarn

### Pasos

1. Clonar el repositorio o descargar el código

2. Instalar las dependencias:
```bash
pnpm install
# o
npm install
# o
yarn install
```


3. Ejecutar el servidor de desarrollo:
```bash
pnpm run dev
# o
npm run dev
# o
yarn dev
```

4. Abrir el navegador en la URL que aparece en la consola (generalmente http://localhost:5173)

### Otros Comandos

```bash
# Compilar para producción
pnpm run build

# Previsualizar build de producción
pnpm run preview

# Ejecutar linter
pnpm run lint
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── CourseCard.tsx   # Tarjeta de curso
│   ├── CourseForm.tsx   # Formulario crear/editar
│   ├── FilterBar.tsx    # Barra de filtros
│   ├── Navbar.tsx       # Barra de navegación
│   └── SearchBar.tsx    # Barra de búsqueda
├── context/             # Context API
│   └── CoursesContext.tsx
├── data/                # Datos iniciales
│   └── initialCourses.ts
├── hooks/               # Custom hooks
│   └── useCourses.ts
├── pages/               # Páginas de la aplicación
│   ├── CreateCourse.tsx
│   ├── EditCourse.tsx
│   ├── Favorites.tsx
│   └── Home.tsx
├── types/               # Tipos TypeScript
│   └── course.ts
├── App.tsx              # Componente principal
├── App.css              # Estilos principales
├── index.css            # Estilos globales
└── main.tsx             # Punto de entrada
```

## Rutas de la Aplicación

- `/` Página principal con todos los cursos
- `/favorites` Cursos marcados como favoritos
- `/create` Formulario para crear un nuevo curso
- `/edit/:id` Formulario para editar un curso existente
- `/courses/:id` Detalles del curso con ID

## Estructura de Datos

```typescript
interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'web_development' | 'mobile_development' | 'data_science' | 'design' | 'business';
  start_date: string;
  duration: string;
}
```