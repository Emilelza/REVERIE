import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Diary from './pages/Diary'
import { useStore } from './store/useStore'

function RequireRoom({ children }) {
  const { roomCode, authorName } = useStore()
  if (!roomCode || !authorName) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/diary" element={<RequireRoom><Diary /></RequireRoom>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}