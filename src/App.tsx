import { useState } from 'react'
import { Button } from 'flowbite-react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LoginModal } from './components/LoginModal'
import { Navigation } from './components/Navigation'
import Projects  from './pages/Projects'
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
    return <div>Loading...</div>; // Show a loading indicator while fetching user data
  }

  return isAuthenticated ? children : <Navigate to="/" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App