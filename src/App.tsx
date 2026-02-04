import { BrowserRouter, Route, Routes } from 'react-router';

import { Layout } from './components/Layout';
import { CoursesProvider } from './context/courses';
import { ThemeProvider } from './context/theme/Provider';
import { Create } from './pages/Create';
import { Details } from './pages/Details';
import { Edit } from './pages/Edit';
import { Favorites } from './pages/Favorites';
import { Home } from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CoursesProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create" element={<Create />} />
              <Route path="/edit/:id" element={<Edit />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/details/:id" element={<Details />} />
            </Routes>
          </Layout>
        </CoursesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
