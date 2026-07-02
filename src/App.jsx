import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import LeadFinder from './pages/LeadFinder'
import PitchPlaybook from './pages/PitchPlaybook'
import AISalesReport from './pages/AISalesReport'
import History from './pages/History'
import WarRoom from './pages/WarRoom'
import LeadPool from './pages/LeadPool'
import Messages from './pages/Messages'

const CRM_PASSWORD = 'leadflow2025'

function ProtectedCRM() {
  if (!localStorage.getItem('lf_access')) return <Navigate to="/" replace />
  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<LeadFinder />} />
          <Route path="playbook" element={<PitchPlaybook />} />
          <Route path="report" element={<AISalesReport />} />
          <Route path="history" element={<History />} />
              <Route path="warroom" element={<WarRoom />} />
        <Route path="leadpool" element={<LeadPool />} />
          <Route path="messages" element={<Messages />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing password={CRM_PASSWORD} />} />
        <Route path="/crm/*" element={<ProtectedCRM />} />
      </Routes>
    </BrowserRouter>
  )
}
