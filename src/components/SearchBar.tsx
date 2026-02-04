import { useCourseFilters } from '../hooks/useCourseFilters';
//import { useCourses } from '../hooks/useCourses';

export const SearchBar = () => {
  console.log('SearchBar rendered');
  //const { searchTerm, setSearchTerm } = useCourses();
  const { searchQuery, setSearchTerm } = useCourseFilters();

  return (
    <div className="w-full">
      <input
        type="text"
        placeholder="Buscar por título o instructor..."
        value={searchQuery}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-2 text-content border-2 rounded-lg border-tertiary"
      />
    </div>
  );
};
