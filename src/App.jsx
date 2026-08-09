import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Simulate from './pages/Simulate'
import Info from './pages/Info'
import Act from './pages/Act'

/** 路由切换时自动滚回顶部 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="min-h-screen bg-cream font-sans text-cocoa">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/simulate" element={<Simulate />} />
        <Route path="/info" element={<Info />} />
        <Route path="/act" element={<Act />} />
      </Routes>
    </div>
  )
}
