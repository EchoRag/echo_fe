import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { SideNav } from './components/SideNav'
import { Chat } from './components/Chat/Chat'
import { LoginModal } from './components/LoginModal'
import Projects from './pages/Projects'
import ProjectDocuments from './pages/ProjectDocuments'
import './App.css'
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LoginModalProvider, useLoginModal } from './context/LoginModalContext';
import { useClerk, useAuth } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuthContext();
  const { isSignedIn } = useAuth();
  const { loaded: isClerkLoaded } = useClerk();
  const { openLoginModal } = useLoginModal();

  useEffect(() => {
    // Only open login modal if we're sure the user is not signed in
    if (isClerkLoaded && !isSignedIn && !loading && !user) {
      openLoginModal();
    }
  }, [isClerkLoaded, isSignedIn, loading, user]);

  // Show loading state while checking auth
  if (loading || !isClerkLoaded) {
    return <div>Loading...</div>;
  }

  // If user is signed in with Clerk but not in our context yet, wait
  if (isSignedIn && !user) {
    return <div>Loading...</div>;
  }

  // If user is not signed in, redirect to home
  if (!isSignedIn || !user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppLayout({ children }: { children: JSX.Element }) {
  const { user } = useAuthContext();
  const { showLoginModal, closeLoginModal } = useLoginModal();
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);

  return (
    <>
      <div className="flex h-full">
        {user && (
          <div className="fixed inset-y-0 left-0">
            <SideNav onCollapseChange={setIsSideNavCollapsed} />
          </div>
        )}
        <div className={`flex-1 transition-all duration-300 ${user ? (isSideNavCollapsed ? 'ml-[60px]' : 'ml-64') : ''}`}>
          {user && (
            <div className={`fixed top-0 right-0 transition-all duration-300 ${isSideNavCollapsed ? 'left-[60px]' : 'left-64'} z-10`}>
              <Navigation />
            </div>
          )}
          <main className={`container mx-auto px-4 py-8 ${user ? 'mt-16' : ''} overflow-y-auto`}>
            {children}
          </main>
        </div>
      </div>
      <LoginModal show={showLoginModal} onClose={closeLoginModal} />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LoginModalProvider>
          <AppLayout>
            <Routes>
              <Route path="/" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
              <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectDocuments /></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><div>Calendar Page (Coming Soon)</div></ProtectedRoute>} />
              <Route path="/tasks" element={<ProtectedRoute><div>Tasks Page (Coming Soon)</div></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><div>Settings Page (Coming Soon)</div></ProtectedRoute>} />
            </Routes>
          </AppLayout>
        </LoginModalProvider>
      </AuthProvider>
    </Router>
  )
}

export default App