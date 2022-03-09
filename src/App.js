import './App.css';
import Project from './components/Project';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Project />}/>
      </Routes>
    </div>
  );
}

export default App;
