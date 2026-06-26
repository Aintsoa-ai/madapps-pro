import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app/:slug" element={<AppDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
