import { Routes, Route } from 'react-router-dom';
import { useCheckAuthQuery } from './features/auth/api/authApi';
import Layout from './components/Layout';
import ChatPage from './pages/ChatPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import GuestRoute from './components/GuestRoute';
import ChatLyout from './components/ChatLyout';

function App() {
  const { isLoading } = useCheckAuthQuery(undefined, { refetchOnFocus: true });

  if (isLoading) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center gap-4">
        <span className="loading loading-spinner loading-xs"></span>
        <span>Cecking Authentication...</span>
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route element={<ProtectedRoute />}>
          <Route element={<ChatLyout />}>
            <Route index element={<ChatPage />} />
          </Route>
        </Route>
        <Route element={<GuestRoute />}>
          <Route path="signup" element={<SignupPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
