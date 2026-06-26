import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AppDetails from './pages/AppDetails';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CreateApp from './pages/admin/CreateApp';
import EditApp from './pages/admin/EditApp';
import AdminLayout from './components/layout/AdminLayout';
import ErrorBoundary from './components/ErrorBoundary';
import UserAuth from './pages/UserAuth';
import { useEffect } from 'react';
import { supabase } from './lib/supabase';

function App() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // On essaie d'insérer, si ça échoue (déjà existant), on met à jour
        const { error } = await supabase.from('daily_visits').insert({ visit_date: today, visitors_count: 1 });
        
        if (error && error.code === '23505') { // Code d'erreur pour violation d'unicité
           const { data } = await supabase.from('daily_visits').select('visitors_count').eq('visit_date', today).single();
           if (data) {
             await supabase.from('daily_visits').update({ visitors_count: data.visitors_count + 1 }).eq('visit_date', today);
           }
        }
      } catch (e) {
        console.error("Erreur tracking visiteur:", e);
      }
    };
    
    // On track une visite par session pour éviter le spam (basique)
    if (!sessionStorage.getItem('visited_today')) {
      trackVisitor();
      sessionStorage.setItem('visited_today', 'true');
    }
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/app/:slug" element={<AppDetails />} />
          <Route path="/auth" element={<UserAuth />} />
          
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
