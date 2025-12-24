import type { Theme } from '../context/theme/Context';
import { useTheme } from '../hooks/useTheme';
import { Moon } from './icons/Moon';
import { Sun } from './icons/Sun';

const getThemeLabel = (theme: Theme) => {
  return theme === 'dark' ? 'Claro' : 'Oscuro';
};

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const label = getThemeLabel(theme);

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${label}`}
      title={`Cambiar a modo ${label}`}
    >
      <span>{theme === 'dark' ? <Sun /> : <Moon />}</span>
    </button>
  );
};
