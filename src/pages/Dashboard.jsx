import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const COLORS = { Hot: '#ef4444', Warm: '#f59e0b', 'Not Ready': '#6b7280' }

const StatCard = ({ icon, bg, num, label }) => (
  <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', flex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f3f4f6' }}>
    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '1rem' }}>{icon}</div>
    <div style={{ fontSize: '2.2rem', fontWeight: '700', letterSpacing: '-1px', marginBottom: '4px' }}>{num}</div>
    <div style={{ color: '#9ca3af', fontSize: '14px', fontWeight: '500' }}>{label}</div>
  </div>
)

export default function Dashboard() {
  const [totalCount, setTotalCount] = useState(0)
  const [hot, setHot] = useState(0)
  const [warm, setWarm] = useState(0)
  const [cold, setCold] = useState(0)
  const [industryData, setIndustryData] = useState([])
  const [recentLeads, setRecentLeads] = useState([])

  useEffect(() => {
    supabase.from('leads').select('*', { count: 'exact', head: true }).then(({ count }) => setTotalCount(count || 0))
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tag', 'Hot').then(({ count }) => setHot(count || 0))
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tag', 'Warm').then(({ count }) => setWarm(count || 0))
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('tag', 'Not Ready').then(({ count }) => setCold(count || 0))
    supabase.from('leads').select('id, business_name, industry, tag').order('id', { ascending: false }).limit(5).then(({ data }) => setRecentLeads(data || []))

    const fetchAllIndustries = async () => {
      let all = []
      let from = 0
      while (true) {
        const { data } = await supabase.from('leads').select('industry').range(from, from + 999)
        if (!data || data.length === 0) break
        all = [...all, ...data]
        if (data.length < 1000) break
        from += 1000
      }
      const byInd = all.reduce((acc, l) => { if (l.industry) acc[l.industry] = (acc[l.industry] || 0) + 1; return acc }, {})
      setIndustryData(Object.entries(byInd).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10))
    }
    fetchAllIndustries()
  }, [])

  const tempData = [
    { name: 'Hot', value: hot },
    { name: 'Warm', value: warm },
    { name: 'Not Ready', value: cold },
  ].filter(d => d.value > 0)

  return (
    <div style={{ padding: '2.5rem', maxWidth: '1200px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>Good morning, Cristopher</h1>
          <p style={{ color: '#9ca3af', fontSize: '15px' }}>Here's where your pipeline stands today.</p>
        </div>
        <button style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '10px 18px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>View Lead Finder ↗</button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <StatCard icon="👥" bg="#f0fdf4" num={totalCount} label="Total Leads" />
        <StatCard icon="🔥" bg="#fff1f1" num={hot} label="Hot Leads" />
        <StatCard icon="⚡" bg="#fffbeb" num={warm} label="Warm Leads" />
        <StatCard icon="❄️" bg="#eff6ff" num={cold} label="Cold Leads" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 2, background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Leads by industry</div>
          <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '1.5rem' }}>Where your pipeline is concentrated</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={industryData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Pipeline temperature</div>
          <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '1rem' }}>How leads are tagged</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={tempData} dataKey="value" innerRadius={55} outerRadius={85}>
                {tempData.map((entry) => <Cell key={entry.name} fill={COLORS[entry.name]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
            {tempData.map(d => (
              <span key={d.name} style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', color: '#6b7280' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[d.name], display: 'inline-block' }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '4px' }}>Recent activity</div>
        <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '1.25rem' }}>Your latest lead touches</div>
        {recentLeads.map((l, i) => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid #f9fafb' : 'none' }}>
            <div>
              <div style={{ fontWeight: '600', fontSize: '14px' }}>{l.business_name}</div>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{l.industry}</div>
            </div>
            {l.tag && <span style={{ fontSize: '12px', background: COLORS[l.tag] + '18', color: COLORS[l.tag], borderRadius: '20px', padding: '4px 12px', fontWeight: '600' }}>{l.tag}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
