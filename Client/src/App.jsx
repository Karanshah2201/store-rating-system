import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserStoreList from './pages/UserStoreList';
import OwnerDashboard from './pages/OwnerDashboard';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/user"
              element={
                <ProtectedRoute allowedRoles={['User']}>
                  <UserStoreList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/owner"
              element={
                <ProtectedRoute allowedRoles={['StoreOwner']}>
                  <OwnerDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update-password"
              element={
                <ProtectedRoute>
                  <UpdatePassword />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<HomeRedirect />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const HomeRedirect = () => {
  const userString = localStorage.getItem('user');
  if (!userString) return <Navigate to="/login" />;

  const user = JSON.parse(userString);
  if (user.role === 'Admin') return <Navigate to="/admin" />;
  if (user.role === 'StoreOwner') return <Navigate to="/owner" />;
  return <Navigate to="/user" />;
};

export default App;
