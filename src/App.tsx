import { BrowserRouter, Route, Routes } from 'react-router';
import { Navbar } from './components/Navbar';
import { ThemeProvider } from './context/theme/Provider';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<h1 className="text-content">Course Catalog</h1>} />
          <Route path="/create" element={<h1>Create</h1>} />
          <Route path="/favorites" element={<h1>Favorites</h1>} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
