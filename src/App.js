import { BrowserRouter as Router,
Route,
Routes } from 'react-router-dom'
import Admin from './components/Admin';
import Login from './components/Login';
import Inicio from './components/Inicio';
import Menu from './components/Menu';


function App() {
  return (
    <div className='container'>
      <Router>
        <Menu />
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/Admin' element={<Admin />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;
