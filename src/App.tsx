import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import ScanDetail from './pages/ScanDetail';
import Intelligence from './pages/Intelligence';
import HistoryPage from './pages/History';
import Reports from './pages/Reports';
import SettingsPage from './pages/Settings';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login initialStep="register" />} />
        <Route path="/register" element={<Login initialStep="register" />} />
        <Route path="/forgot-password" element={<Login initialStep="forgot" />} />
        <Route path="/forgot" element={<Login initialStep="forgot" />} />
        
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/reconnaissance" element={<Layout><Scanner /></Layout>} />
        <Route path="/scan/:scanId" element={<Layout><ScanDetail /></Layout>} />
        <Route path="/intelligence" element={<Layout><Intelligence /></Layout>} />
        <Route path="/history" element={<Layout><HistoryPage /></Layout>} />
        <Route path="/reports" element={<Layout><Reports /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
  );
}
