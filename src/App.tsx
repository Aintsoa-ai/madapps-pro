import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CreateApp from './pages/admin/CreateApp';
import EditApp from './pages/admin/EditApp';
import AdminLayout from './components/layout/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/:slug" element={<AppDetails />} />
          
          {/* Routes Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="apps/new" element={<CreateApp />} />
            <Route path="apps/edit/:slug" element={<EditApp />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
