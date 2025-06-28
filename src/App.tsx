import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy loaded pages
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Practice = lazy(() => import('./pages/Practice'));
const PracticeProblem = lazy(() => import('./pages/PracticeProblem'));
const Match = lazy(() => import('./pages/Match'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Profile = lazy(() => import('./pages/Profile'));
const MatchFinder = lazy(() => import('./pages/MatchFinder'));
const MatchHistory = lazy(() => import('./pages/MatchHistory'));
const MatchResults = lazy(() => import('./pages/MatchResults'));

import Room  from './pages/Room';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';


type ProtectedRouteProps = {
  children: JSX.Element;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  // If authenticated, redirect to dashboard
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Define routes where Footer should be shown
  const footerRoutes = ['/dashboard', '/practice', '/leaderboard'];
  const shouldShowFooter = isAuthenticated && footerRoutes.includes(location.pathname);

  // Show loading screen while initializing auth
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {isAuthenticated && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={<LoadingScreen />}>
          <Routes>
            {/* Public routes - redirect to dashboard if already authenticated */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <Landing />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              } 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/match-finder" 
              element={
                <ProtectedRoute>
                  <MatchFinder />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/match-history" 
              element={
                <ProtectedRoute>
                  <MatchHistory />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/match-results" 
              element={
                <ProtectedRoute>
                  <MatchResults />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/practice/:id" 
              element={
                <ProtectedRoute>
                  <PracticeProblem />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/practice" 
              element={
                <ProtectedRoute>
                  <Practice />
                </ProtectedRoute>
              }
            />

            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/join-room" element={<JoinRoom />} />
            <Route path="/room/:roomCode" element={<Room />} />

            <Route 
              path="/match/:id" 
              element={
                <ProtectedRoute>
                  <Match />
                </ProtectedRoute>
              }
            />

            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Footer - only show on specific routes when authenticated */}
      {shouldShowFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <AppContent />
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;