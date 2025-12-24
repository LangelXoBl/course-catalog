import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import { Navbar } from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Course Catalog</h1>} />
        <Route path="/create" element={<h1>Create</h1>} />
        <Route path="/favorites" element={<h1>Favorites</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
