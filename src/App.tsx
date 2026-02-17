import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import TopicList from './pages/TopicList'
import TopicDetail from './pages/TopicDetail'
import ExamGuide from './pages/ExamGuide'
import About from './pages/About'

const PdfReader = lazy(() => import('./pages/PdfReader'))

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="flex items-center justify-center py-20 text-gray-500">読み込み中...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/topics" element={<TopicList />} />
            <Route path="/topics/:slug" element={<TopicDetail />} />
            <Route path="/exam-guide" element={<ExamGuide />} />
            <Route path="/exam-guide/:slug" element={<ExamGuide />} />
            <Route path="/about" element={<About />} />
            <Route path="/pdf-reader" element={<PdfReader />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
