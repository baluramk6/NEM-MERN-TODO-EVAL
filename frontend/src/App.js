import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Signin } from './components/Signin';
import { Signup } from './components/Signup';
import { Todos } from './components/Todos';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<h1>Home page</h1>} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </div>
  );
}

export default App;
