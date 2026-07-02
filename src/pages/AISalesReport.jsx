import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AISalesReport() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)

  const generate = async () => {
    setLoading(true)
    const { data: leads } = await supabase.from('leads').select('*')
    const { data: history } = await supabase.from('history').select('*').order('created_at', { ascending: false }).limit(20)

    const prompt = `You are a sales mentor. Based on this pipeline data, give a daily debrief.

LEADS: ${JSON.stringify(leads)}
RECENT ACTIVITY: ${JSON.stringify(history)}

Respond in this exact format:
## What went well today
- [point]

## What to improve
- [point]

## Top 3 priorities for tomorrow
1. [priority]`

    const res = await fetch('http://35.188.172.166:3000/api/ai-report', {
      method: 'POST',
      headers: {
  'Content-Type': 'application/json',
},
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] })
    })
    const json = await res.json()
    setReport(json.content?.[0]?.text || 'Could not generate report.')
    setLoading(false)
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '4px' }}>AI Sales Report</h1>
      <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>A mentor-style daily debrief based on your live pipeline.</p>
      {!report ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🤖</div>
          <h3 style={{ marginBottom: '8px' }}>Generate today's report</h3>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Your AI sales mentor reviews every lead and activity, then tells you what went well, what to fix, and your top 3 priorities for tomorrow.</p>
          <button onClick={generate} disabled={loading} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 32px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
            {loading ? 'Generating...' : '⚙️ Generate Daily Report'}
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div><strong>Daily Sales Report</strong><br /><span style={{ color: '#6b7280', fontSize: '13px' }}>{new Date().toLocaleString()}</span></div>
            <button onClick={generate} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer' }}>Regenerate</button>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#374151' }}>{report}</div>
        </div>
      )}
    </div>
  )
}
