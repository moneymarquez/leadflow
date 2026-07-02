import { NavLink, useNavigate } from 'react-router-dom'

const links = [
  { to: '/crm/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/crm/warroom', label: 'War Room', icon: '⚔️' },
  { to: '/crm/leadpool', label: 'Lead Pool', icon: '🎯' },
  { to: '/crm/leads', label: 'Lead Finder', icon: '🔍' },
  { to: '/crm/playbook', label: 'Pitch Playbook', icon: '📖' },
  { to: '/crm/report', label: 'AI Sales Report', icon: '🤖' },
  { to: '/crm/history', label: 'History', icon: '🕐' },
  { to: '/crm/messages', label: 'Messages', icon: '💬' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const exit = () => { localStorage.removeItem('lf_access'); navigate('/') }

  return (
    <div style={{ width: '230px', background: '#fff', borderRight: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', padding: '1.5rem 1rem', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2.5rem', padding: '0 8px' }}>
        <div style={{ width: '32px', height: '32px', background: '#16a34a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📍</div>
        <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>LeadFlow</span>
      </div>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 12px', borderRadius: '10px', marginBottom: '2px',
          textDecoration: 'none',
          color: isActive ? '#16a34a' : '#6b7280',
          background: isActive ? '#f0fdf4' : 'transparent',
          fontWeight: isActive ? '600' : '500',
          fontSize: '14px',
        })}>
          <span style={{ fontSize: '16px' }}>{l.icon}</span>
          {l.label}
        </NavLink>
      ))}
      <div style={{ marginTop: 'auto', padding: '8px 12px' }}>
        <button onClick={exit} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#9ca3af', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          ↩ Exit Portal
        </button>
      </div>
    </div>
  )
}
