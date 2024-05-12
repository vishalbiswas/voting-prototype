import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div>
      <Header />
      <div className="mt-5">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
