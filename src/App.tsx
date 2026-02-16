import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import TopicList from './pages/TopicList'
import TopicDetail from './pages/TopicDetail'
import ExamGuide from './pages/ExamGuide'
import About from './pages/About'
import PdfReader from './pages/PdfReader'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<TopicList />} />
          <Route path="/topics/:slug" element={<TopicDetail />} />
          <Route path="/exam-guide" element={<ExamGuide />} />
          <Route path="/exam-guide/:slug" element={<ExamGuide />} />
          <Route path="/about" element={<About />} />
          <Route path="/pdf-reader" element={<PdfReader />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
