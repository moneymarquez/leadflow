import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const TAGS = ['Hot', 'Warm', 'Not Ready']
const TAG_COLORS = { Hot: '#ef4444', Warm: '#f59e0b', 'Not Ready': '#6b7280' }

const US_STATES = ['All','Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

export default function LeadFinder() {
  const [leads, setLeads] = useState([])
  const [industry, setIndustry] = useState('All')
  const [tag, setTag] = useState('All')
  const [state, setState] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ business_name: '', phone: '', industry: 'restaurant', website_status: 'no_website', tag: 'Warm', state: '' })
  const [pool, setPool] = useState([])
  const [poolMode, setPoolMode] = useState(false)
  const [poolIndex, setPoolIndex] = useState(0)

  const [allIndustries, setAllIndustries] = useState(['All'])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 50

  const fetchLeads = async (pageNum = 0, reset = false, ind = industry, tg = tag, st = state) => {
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    let query = supabase.from('leads').select('*').order('id', { ascending: false }).range(from, to)
    if (ind && ind !== 'All') query = query.eq('industry', ind)
    if (tg && tg !== 'All') query = query.eq('tag', tg)
    if (st && st !== 'All') query = query.eq('state', st)
    const { data } = await query
    if (data) {
      setLeads(prev => reset ? data : [...prev, ...data])
      setHasMore(data.length === PAGE_SIZE)
    }
  }

  useEffect(() => {
    fetchLeads(0, true)
    supabase.from('leads').select('industry').limit(60000).then(({ data }) => {
      if (data) {
        const unique = ['All', ...new Set(data.map(l => l.industry).filter(Boolean))]
        setAllIndustries(unique)
      }
    })
  }, [])

  const industries = allIndustries
  const filtered = leads.filter(l =>
    (industry === 'All' || l.industry === industry) &&
    (tag === 'All' || l.tag === tag) &&
    (state === 'All' || l.state === state)
  )

  const addLead = async () => {
    const { data } = await supabase.from('leads').insert([form]).select()
    if (data) { setLeads([data[0], ...leads]); setShowAdd(false) }
  }

  const updateTag = async (id, newTag) => {
    await supabase.from('leads').update({ tag: newTag }).eq('id', id)
    setLeads(leads.map(l => l.id === id ? { ...l, tag: newTag } : l))
  }

  const togglePool = async (lead) => {
    const inPool = pool.find(p => p.id === lead.id)
    await supabase.from('leads').update({ pooled: !inPool }).eq('id', lead.id)
    setPool(inPool ? pool.filter(p => p.id !== lead.id) : [...pool, lead])
  }

  const currentPoolLead = pool[poolIndex]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Lead Finder</h1>
          <p style={{ color: '#6b7280' }}>Leads stored live from your Supabase database.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {pool.length > 0 && (
            <button onClick={() => { setPoolMode(true); setPoolIndex(0) }} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600' }}>
              Call Pool ({pool.length})
            </button>
          )}
          <button onClick={() => setShowAdd(true)} style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 18px', cursor: 'pointer', fontWeight: '600' }}>+ Add Lead</button>
        </div>
      </div>

      {/* Connection status */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px 16px', marginBottom: '1.5rem' }}>
        <strong style={{ color: '#16a34a' }}>✅ Connected to Supabase</strong>
        <p style={{ fontSize: '13px', color: '#6b7280', margin: '2px 0 0' }}>Tag changes update instantly.</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <select value={industry} onChange={e => { const v = e.target.value; setIndustry(v); setPage(0); fetchLeads(0, true, v, tag, state); }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          {industries.map(i => <option key={i}>{i}</option>)}
        </select>
        <select value={tag} onChange={e => { const v = e.target.value; setTag(v); setPage(0); fetchLeads(0, true, industry, v, state); }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          <option>All</option>
          {TAGS.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={state} onChange={e => { const v = e.target.value; setState(v); setPage(0); fetchLeads(0, true, industry, tag, v); }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
          {US_STATES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Lead Cards */}
      {filtered.map(lead => (
        <div key={lead.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{lead.business_name}</strong>
              {lead.tag && <span style={{ marginLeft: '10px', background: TAG_COLORS[lead.tag] + '22', color: TAG_COLORS[lead.tag], borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{lead.tag}</span>}
              {lead.state && <span style={{ marginLeft: '8px', background: '#e0e7ff', color: '#3730a3', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{lead.state}</span>}
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                📞 {lead.phone || '–'} · {lead.industry || '–'} · {lead.website_status || '–'}
              </div>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>📲 Call Now</a>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button onClick={() => togglePool(lead)} style={{ background: pool.find(p => p.id === lead.id) ? '#7c3aed' : '#f3f4f6', color: pool.find(p => p.id === lead.id) ? '#fff' : '#374151', border: 'none', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                {pool.find(p => p.id === lead.id) ? '✓ In Pool' : '+ Pool'}
              </button>
              <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                {expanded === lead.id ? '▲' : '▼'}
              </button>
            </div>
          </div>
          {expanded === lead.id && (
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {TAGS.map(t => (
                <button key={t} onClick={() => updateTag(lead.id, t)} style={{ padding: '6px 14px', borderRadius: '20px', border: `1px solid ${TAG_COLORS[t]}`, background: lead.tag === t ? TAG_COLORS[t] : '#fff', color: lead.tag === t ? '#fff' : TAG_COLORS[t], cursor: 'pointer', fontSize: '13px' }}>{t}</button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Pool Call Mode */}
      {poolMode && currentPoolLead && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '380px', maxWidth: '95vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: '800', fontSize: '18px' }}>📋 Call Pool</h3>
              <span style={{ color: '#6b7280', fontSize: '13px' }}>{poolIndex + 1} of {pool.length}</span>
            </div>
            <strong style={{ fontSize: '20px' }}>{currentPoolLead.business_name}</strong>
            {currentPoolLead.state && <div style={{ marginTop: '4px' }}><span style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{currentPoolLead.state}</span></div>}
            <div style={{ marginTop: '12px', fontSize: '15px', lineHeight: '1.8' }}>
              <div>📞 <strong>{currentPoolLead.phone || '–'}</strong></div>
              <div>🏢 {currentPoolLead.industry || '–'}</div>
              <div>🌐 {currentPoolLead.website_status || '–'}</div>
            </div>
            {currentPoolLead.phone && (
              <a href={`tel:${currentPoolLead.phone}`} style={{ display: 'block', marginTop: '12px', background: '#16a34a', color: '#fff', borderRadius: '8px', padding: '12px', textAlign: 'center', fontWeight: '700', textDecoration: 'none', fontSize: '16px' }}>📲 Call Now</a>
            )}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => setPoolIndex(Math.max(0, poolIndex - 1))} disabled={poolIndex === 0} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', background: poolIndex === 0 ? '#f9fafb' : '#fff' }}>← Prev</button>
              <button onClick={() => { if (poolIndex < pool.length - 1) setPoolIndex(poolIndex + 1); else setPoolMode(false) }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#16a34a', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                {poolIndex < pool.length - 1 ? 'Next →' : 'Done ✓'}
              </button>
            </div>
            <button onClick={() => setPoolMode(false)} style={{ width: '100%', marginTop: '8px', padding: '8px', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer', background: 'none', color: '#6b7280' }}>Close</button>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAdd && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '360px' }}>
            <h3 style={{ marginBottom: '1rem' }}>Add Lead</h3>
            <input placeholder="Business name" value={form.business_name} onChange={e => setForm({...form, business_name: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px', boxSizing: 'border-box' }} />
            <input placeholder="Phone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px', boxSizing: 'border-box' }} />
            <select value={form.state} onChange={e => setForm({...form, state: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px' }}>
              <option value=''>Select State</option>
              {US_STATES.filter(s => s !== 'All').map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={form.tag} onChange={e => setForm({...form, tag: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '10px' }}>
              {TAGS.map(t => <option key={t}>{t}</option>)}
            </select>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={addLead} style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
              <button onClick={() => setShowAdd(false)} style={{ flex: 1, background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
