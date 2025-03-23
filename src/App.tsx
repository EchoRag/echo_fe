import { useState } from 'react'
import { Button } from 'flowbite-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LoginModal } from './components/LoginModal'
import { Navigation } from './components/Navigation'
import { Projects } from './pages/Projects'
import './App.css'

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

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
