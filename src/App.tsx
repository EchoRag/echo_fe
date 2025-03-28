import { useState } from 'react'
import { Button } from 'flowbite-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginModal } from './components/LoginModal'
import { Navigation } from './components/Navigation'
import { SideNav } from './components/SideNav'
import Projects from './pages/Projects'
import './App.css'
import { AuthProvider, useAuthContext } from './context/AuthContext';

function Home() {
  const [showLoginModal, setShowLoginModal] = useState(false)

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">Welcome to Echo</h1>
        <Button
          gradientDuoTone="purpleToBlue"
          size="lg"
          className="shadow-lg"
          onClick={() => setShowLoginModal(true)}
        >
          Sign In
        </Button>
      </div>
      <LoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  )
}

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext();
  const isAuthenticated = !!user;

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

function AppLayout({ children }: { children: JSX.Element }) {
  const { user } = useAuthContext();
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  
  if (!user) {
    return children;
  }

  return (
    <div className="flex h-full">
      <div className="fixed inset-y-0 left-0">
        <SideNav onCollapseChange={setIsSideNavCollapsed} />
      </div>
      <div className={`flex-1 transition-all duration-300 ${isSideNavCollapsed ? 'ml-[60px]' : 'ml-64'}`}>
        <div className={`fixed top-0 right-0 transition-all duration-300 ${isSideNavCollapsed ? 'left-[60px]' : 'left-64'} z-10`}>
          <Navigation />
        </div>
        <main className="container mx-auto px-4 py-8 mt-16 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute><div>Calendar Page (Coming Soon)</div></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><div>Tasks Page (Coming Soon)</div></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><div>Settings Page (Coming Soon)</div></ProtectedRoute>} />
          </Routes>
        </AppLayout>
      </AuthProvider>
    </Router>
  )
}

export default App