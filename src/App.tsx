import { HashRouter, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { ProgressProvider, useProgress } from './lib/progress'
import { UNIT1, TOPIC_SECTION_IDS } from './data/unit1/unit1'
import { Topic1Page } from './pages/Topic1Page'
import { Topic2Page } from './pages/Topic2Page'
import { PlannedTopicPage } from './pages/PlannedTopicPage'
import { Unit1BankPage } from './pages/Unit1BankPage'
import { TopicProgressDot } from './components/ProgressTracker'
import { MODE_LABEL } from './types'

const SECTION_IDS = TOPIC_SECTION_IDS

function Sidebar() {
  const navigate = useNavigate()
  const { topicId } = useParams()
  const path = window.location.hash.replace(/^#/, '')

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">ESD</div>
        <div className="brand-text">
          <strong>ESD Learning Lab</strong>
          <span>UETPE0513 · TY E&amp;TC</span>
        </div>
      </div>

      <div className="unit-label">Unit 1 — {UNIT1.code.split('—')[1]?.trim() ?? ''}</div>
      <ul className="topic-list">
        {UNIT1.topics.map((t) => {
          const active = t.id === topicId
          const locked = t.status === 'planned'
          return (
            <li key={t.id}>
              <button
                className={`topic-link ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
                onClick={() => !locked && navigate(`/u1/${t.id}`)}
                title={locked ? `${t.title} — not built yet` : t.title}
              >
                <span className="num">{t.index}</span>
                <span>{t.shortTitle}</span>
                {locked ? (
                  <span className="dot" title="planned" />
                ) : (
                  <TopicProgressDot topicId={t.id} sections={SECTION_IDS} />
                )}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="sidebar-section">
        <div className="unit-label">Unit 1 resources</div>
        <ul className="topic-list">
          <li>
            <button
              className={`topic-link ${path === '/u1/bank' ? 'active' : ''}`}
              onClick={() => navigate('/u1/bank')}
            >
              <span className="num">Σ</span>
              <span>Question Bank (Unit 1)</span>
              <span className="dot" />
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="unit-label">Other units</div>
        <ul className="topic-list">
          <li>
            <button className="topic-link locked" disabled>
              <span className="num">2</span>
              <span>Unit 2 — Analog Hardware</span>
              <span className="dot" />
            </button>
          </li>
          <li>
            <button className="topic-link locked" disabled>
              <span className="num">3</span>
              <span>Unit 3 — Digital Hardware</span>
              <span className="dot" />
            </button>
          </li>
        </ul>
      </div>

      <div className="sidebar-section">
        <div className="unit-label">Primary source</div>
        <p className="small faint" style={{ lineHeight: 1.5 }}>
          Supplied course PDFs in the repository:
          <br />• Classification &amp; reliability
          <br />• TTL CMOS characteristics
          <br />• Opamp performance parameters
          <br />• TY ESD 2026 ISE1
          <br />
          Anything not supported by them is labelled{' '}
          <span className="badge insight">Engineering Insight</span>.
        </p>
      </div>
    </aside>
  )
}

function Topbar() {
  const { state, reset } = useProgress()
  const total = UNIT1.topics.length
  const live = UNIT1.topics.filter((t) => t.status === 'live').length

  return (
    <header className="topbar">
      <div>
        <strong>Electronic System Design</strong>
        <span className="small faint"> · Unit 1 · {live} of {total} topics built</span>
      </div>
      <div className="row tight">
        <span className="badge">{MODE_LABEL[state.mode]}</span>
        <span className="badge">Attempts: {state.attempts.length}</span>
        <button className="btn sm ghost" onClick={reset} title="Clear locally stored progress">
          Reset progress
        </button>
      </div>
    </header>
  )
}

function Shell() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main">
        <Topbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/u1/u1t1" replace />} />
            <Route path="/u1/bank" element={<Unit1BankPage />} />
            <Route path="/u1/:topicId" element={<TopicRouter />} />
            <Route path="*" element={<Navigate to="/u1/u1t1" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function TopicRouter() {
  const { topicId } = useParams()
  const topic = UNIT1.topics.find((t) => t.id === topicId)
  if (!topic) return <Navigate to="/u1/u1t1" replace />
  if (topic.id === 'u1t1') return <Topic1Page />
  if (topic.id === 'u1t2') return <Topic2Page />
  return <PlannedTopicPage />
}

export default function App() {
  return (
    <ProgressProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </ProgressProvider>
  )
}
