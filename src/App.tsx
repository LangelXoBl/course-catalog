import { BrowserRouter, Route, Routes } from 'react-router';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from './context/theme/Provider';
import { Home } from './pages/Home';
import { CoursesProvider } from './context/courses/Provider';
import { Create } from './pages/Create';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CoursesProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/favorites" element={<h1>Favorites</h1>} />
          </Routes>
        </CoursesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
