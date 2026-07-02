import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TAG_COLORS = { Hot: '#ef4444', Warm: '#f59e0b', 'Not Ready': '#6b7280' }

export default function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    supabase.from('history').select('*').order('created_at', { ascending: false }).then(({ data }) => setHistory(data || []))
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>History</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Every lead touch and action, newest first.</p>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
        {history.map((item, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem 0', borderBottom: i < history.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#16a34a', marginTop: '5px', flexShrink: 0 }} />
              <div>
                <strong>{item.action}</strong>
                <div style={{ fontSize: '13px', color: '#6b7280' }}>{item.industry} · {new Date(item.created_at).toLocaleString()}</div>
                <div style={{ fontSize: '14px', color: '#374151', marginTop: '4px' }}>{item.note}</div>
              </div>
            </div>
            {item.tag && <span style={{ background: TAG_COLORS[item.tag] + '22', color: TAG_COLORS[item.tag], borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>{item.tag === 'Hot' ? '🔥' : item.tag === 'Warm' ? '⚡' : '❌'} {item.tag}</span>}
          </div>
        ))}
        {history.length === 0 && <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No activity yet.</p>}
      </div>
    </div>
  )
}
