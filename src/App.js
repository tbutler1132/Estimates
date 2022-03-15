import './App.css';
import Project from './components/Project';
import ProjectManager from './components/ProjectManager';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ProjectManager />}/>
        <Route path="/project" element={<Project />}/>
      </Routes>
    </div>
  );
}

export default App;
