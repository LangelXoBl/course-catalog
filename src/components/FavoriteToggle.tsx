interface Props {
  isFavorite: boolean;
  onClick: () => void;
}

export const FavoriteToggle = ({ isFavorite, onClick }: Props) => {
  const color = isFavorite ? 'text-amber-300' : 'text-gray-400';

  return (
    <button onClick={onClick} className={`text-2xl ${color} hover:scale-110 cursor-pointer`}>
      <span>{isFavorite ? '★' : '☆'}</span>
    </button>
  );
};
