import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar';
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
const MatchHistory = lazy(() => import('./pages/MatchHistory')); // Add this line
const MatchResults = lazy(() => import('./pages/MatchResults'));


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

  // Show loading screen while initializing auth
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {isAuthenticated && <Navbar />}

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

            {/* Add this new route */}
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
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppContent />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;