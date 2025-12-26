import { useCourses } from '../hooks/useCourses';

export const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useCourses();

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Buscar por título o instructor..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 text-content border-2 rounded-lg border-tertiary"
      />
    </div>
  );
};
