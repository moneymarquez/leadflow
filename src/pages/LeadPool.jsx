import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LeadPool() {
  const [pool, setPool] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('industry')

  useEffect(() => {
    supabase.from('leads').select('*').eq('pooled', true).then(({ data }) => {
      setPool(data || [])
      setLoading(false)
    })
  }, [])

  const removeFromPool = async (id) => {
    await supabase.from('leads').update({ pooled: false }).eq('id', id)
    setPool(pool.filter(l => l.id !== id))
  }

  const sorted = [...pool].sort((a, b) => {
    if (sortBy === 'industry') return (a.industry || '').localeCompare(b.industry || '')
    if (sortBy === 'reviews') return (b.review_count || 0) - (a.review_count || 0)
    return 0
  })

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '4px' }}>Lead Pool</h1>
          <p style={{ color: '#9ca3af', fontSize: '15px' }}>{pool.length} leads ready to call</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setSortBy('industry')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: sortBy === 'industry' ? '#16a34a' : '#fff', color: sortBy === 'industry' ? '#fff' : '#374151', cursor: 'pointer', fontWeight: '500' }}>By Industry</button>
          <button onClick={() => setSortBy('reviews')} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: sortBy === 'reviews' ? '#16a34a' : '#fff', color: sortBy === 'reviews' ? '#fff' : '#374151', cursor: 'pointer', fontWeight: '500' }}>By Reviews</button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#9ca3af' }}>Loading pool...</p>
      ) : pool.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '16px', padding: '3rem', textAlign: 'center', border: '1px solid #f3f4f6' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎯</div>
          <h3 style={{ fontWeight: '700', marginBottom: '8px' }}>Your pool is empty</h3>
          <p style={{ color: '#9ca3af' }}>Go to Lead Finder and click "+ Pool" on any lead to add them here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sorted.map(lead => (
            <div key={lead.id} style={{ background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', fontSize: '15px' }}>{lead.business_name}</div>
                <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>{lead.industry} · {lead.state} {lead.review_count ? `· ⭐ ${lead.review_count} reviews` : ''}</div>
                {lead.phone && <a href={`tel:${lead.phone}`} style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600', textDecoration: 'none', marginTop: '4px', display: 'block' }}>📞 {lead.phone}</a>}
              </div>
              <button onClick={() => removeFromPool(lead.id)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fff', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
