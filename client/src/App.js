import './App.css';
import NavBar from './components/NavBar';
import Forum from './components/Forum';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import Addforum from './components/Addforum';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <NavBar profileStatus = "Anonymous"/>
      <Routes>
      <Route path = "/" element={<Forum/>}/>
      <Route path= "/add" element={<Addforum/>}/>
      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
