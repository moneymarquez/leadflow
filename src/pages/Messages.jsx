import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const CONTACTS = [
  { name: 'Michael', role: 'Visionary — Aurora' },
  { name: 'Devin Cole', role: 'Solar Specialist Contact' },
  { name: 'Tony Marino', role: 'Restaurant Closer' },
]

export default function Messages() {
  const [selected, setSelected] = useState(CONTACTS[0])
  const [notes, setNotes] = useState([])
  const [input, setInput] = useState('')

  useEffect(() => {
    supabase.from('messages').select('*').eq('contact', selected.name).order('created_at', { ascending: false }).then(({ data }) => setNotes(data || []))
  }, [selected])

  const save = async () => {
    if (!input.trim()) return
    const { data } = await supabase.from('messages').insert([{ contact: selected.name, note: input }]).select()
    if (data) { setNotes([data[0], ...notes]); setInput('') }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>Messages</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>Quick contact for the people who help you close.</p>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <div style={{ width: '220px' }}>
          {CONTACTS.map(c => (
            <div key={c.name} onClick={() => setSelected(c)} style={{ padding: '12px 16px', borderRadius: '10px', marginBottom: '8px', cursor: 'pointer', background: selected.name === c.name ? '#f0fdf4' : '#fff', border: selected.name === c.name ? '1px solid #bbf7d0' : '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{c.name[0]}</span>
                <div><strong style={{ fontSize: '14px' }}>{c.name}</strong><div style={{ fontSize: '12px', color: '#6b7280' }}>{c.role}</div></div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' }}>{selected.name[0]}</span>
            <div><strong>{selected.name}</strong><div style={{ fontSize: '13px', color: '#6b7280' }}>{selected.role}</div></div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>NOTES</div>
            {notes.map((n, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '14px' }}>{n.note}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{new Date(n.created_at).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={`Quick note or message to ${selected.name}...`} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb', resize: 'none', height: '80px', boxSizing: 'border-box', marginBottom: '8px' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={save} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer', fontWeight: '600' }}>✉️ Save Note</button>
          </div>
        </div>
      </div>
    </div>
  )
}
