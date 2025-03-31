import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navigation } from './components/Navigation'
import { SideNav } from './components/SideNav'
import { Chat } from './components/Chat/Chat'
import { LoginModal } from './components/LoginModal'
import Projects from './pages/Projects'
import './App.css'
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { LoginModalProvider, useLoginModal } from './context/LoginModalContext';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext();
  const { openLoginModal } = useLoginModal();
  const isAuthenticated = !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    openLoginModal();
    return <Navigate to="/" />;
  }

  return children;
}

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
              <Route path="/" element={<Chat />} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
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