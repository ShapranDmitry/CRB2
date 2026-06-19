import Main_page from './pages/main_page';
import Create_page from './pages/create_page';
import Notfound_page from './pages/notround_page';
import Tournament_page from './pages/tournament_page';
import Tournament_list_page from './pages/tournamet_list_page';
import Grid_page from './pages/grid_page';
import { Routes, Route, Link } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <>
    <div className="sidebar">
      <ul>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/create">Создать</Link>
          </li>
          <li>
            <Link to="/tour_list">Список турниров</Link>
          </li>
      </ul>
      </div>
      <div>
      <Routes>
        <Route path="/" element={<Main_page />} />
        <Route path="/create" element={<Create_page />} />
        <Route path="/tour_list" element={<Tournament_list_page />} />
        <Route path="/tournaments/:id" element={<Tournament_page />} />
        <Route path="/tournaments/:id/grid" element={<Grid_page />} />
        <Route path="*" element={<Notfound_page />} />
      </Routes>
      </div>
    </>
  );
}

export default App;
