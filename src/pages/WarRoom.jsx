import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const G = '#16a34a'

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

const MINDSET = [
  "Every no gets you closer to a yes. Your job today is to collect nos as fast as possible.",
  "You're not interrupting them — you're finding the ones who need you. Most just don't know it yet.",
  "Confidence isn't feeling ready. It's deciding to go anyway. Dial.",
  "The rep who makes the most calls wins. It's math, not magic.",
  "You have a solution to a real problem. Act like it.",
  "One conversation can change a business forever. Be that conversation.",
  "Rejection is information. Every objection tells you exactly what to say next.",
]

const OPENERS = {
  restaurant: "Hey, is this [Business Name]? Hey perfect — I was actually trying to place an order through your website and couldn't find one. Do you guys have a site up right now?",
  salon: "Hi, is this [Business Name]? Hey I was trying to book an appointment online but couldn't find your booking page — do you have a website or is it all by phone?",
  barbershop: "Hey is this [Business Name]? I was trying to find your hours online but couldn't pull up a website — are you guys on Google yet?",
  gym: "Hey, is this [Business Name]? I was looking up membership info online but couldn't find a site — do you have one up?",
  plumber: "Hi, is this [Business Name]? I was searching for a plumber in the area and found your number but no website — are you guys online anywhere?",
  electrician: "Hey is this [Business Name]? Found your number but couldn't find a website — are you taking new customers right now?",
  default: "Hey, is this [Business Name]? I was trying to find you online but couldn't pull up a website — do you have one up right now?"
}

const DRILLS = [
  { title: "Objection: 'I'm not interested'", response: "Totally fair — I'm not trying to sell you anything right now. I just noticed you didn't have a site and wanted to show you what other [industry] owners in your area are doing. Can I send you a quick link?" },
  { title: "Objection: 'We already have a website'", response: "Oh perfect! Can I ask — is it showing up when people search [industry] near [city]? A lot of sites exist but aren't actually pulling traffic. Takes 30 seconds to check." },
  { title: "Objection: 'We're too busy'", response: "That's actually exactly why I called — the businesses that are too busy for marketing are usually the ones losing customers to competitors who aren't. I'll keep it under 2 minutes." },
  { title: "Objection: 'Send me an email'", response: "I can do that — what's the best email? And just so I know what to send, is the main thing you're missing more walk-ins, more calls, or just showing up on Google?" },
  { title: "Objection: 'How much does it cost?'", response: "Depends on what you need — we've got options starting under $200/month. But before I quote anything, can I ask what's your biggest thing right now — website, Google listing, or getting more calls?" },
]

export default function WarRoom() {
  const [allLeads, setAllLeads] = useState([])
  const [configured, setConfigured] = useState(false)
  const [config, setConfig] = useState({ states: [], niche: 'restaurant', count: 20 })
  const [queue, setQueue] = useState([])
  const [index, setIndex] = useState(0)
  const [callMode, setCallMode] = useState(false)
  const [results, setResults] = useState({})
  const [notes, setNotes] = useState({})

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const mindset = MINDSET[new Date().getDay() % MINDSET.length]
  const drill = DRILLS[new Date().getDay() % DRILLS.length]
  const opener = OPENERS[config.niche] || OPENERS.default

  useEffect(() => {
    supabase.from('leads').select('*').then(({ data }) => setAllLeads(data || []))
  }, [])

  const buildQueue = () => {
    let filtered = allLeads.filter(l => l.industry === config.niche)
    if (config.states.length > 0) filtered = filtered.filter(l => config.states.includes(l.state))
    const shuffled = filtered.sort(() => Math.random() - 0.5)
    setQueue(shuffled.slice(0, config.count))
    setIndex(0)
    setResults({})
    setNotes({})
    setConfigured(true)
  }

  const toggleState = (s) => {
    setConfig(c => ({
      ...c,
      states: c.states.includes(s) ? c.states.filter(x => x !== s) : [...c.states, s]
    }))
  }

  const logResult = (id, result) => {
    setResults(r => ({ ...r, [id]: result }))
    supabase.from('leads').update({ tag: result === 'hot' ? 'Hot' : result === 'warm' ? 'Warm' : 'Not Ready' }).eq('id', id)
  }

  const current = queue[index]
  const done = index >= queue.length && queue.length > 0

  if (!configured) return (
    <div style={{ padding: '2.5rem', maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-0.5px', marginBottom: '4px' }}>⚔️ War Room</h1>
        <p style={{ color: '#6b7280' }}>{today} — Let's set up your day.</p>
      </div>

      {/* Mindset */}
      <div style={{ background: '#111827', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ color: G, fontWeight: '700', fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>TODAY'S MINDSET</div>
        <p style={{ color: '#fff', fontSize: '16px', lineHeight: '1.7', fontStyle: 'italic' }}>"{mindset}"</p>
      </div>

      {/* Drill */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ color: G, fontWeight: '700', fontSize: '12px', letterSpacing: '1px', marginBottom: '8px' }}>TODAY'S DRILL — {drill.title}</div>
        <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.7' }}>"{drill.response}"</p>
        <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '8px' }}>Practice this out loud 3 times before you dial.</p>
      </div>

      {/* Config */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: '700', fontSize: '16px', marginBottom: '1rem' }}>Configure Today's Lead Queue</div>

        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Niche / Industry</label>
        <select value={config.niche} onChange={e => setConfig(c => ({...c, niche: e.target.value}))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1rem', fontSize: '14px' }}>
          {['restaurant','salon','barbershop','gym','plumber','electrician','HVAC contractor','solar','real estate'].map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
        </select>

        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Number of Leads</label>
        <input type="number" min={5} max={100} value={config.count} onChange={e => setConfig(c => ({...c, count: parseInt(e.target.value)}))} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '1rem', fontSize: '14px', boxSizing: 'border-box' }} />

        <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '8px' }}>Target States (leave empty for all)</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
          {US_STATES.map(s => (
            <button key={s} onClick={() => toggleState(s)} style={{ padding: '4px 10px', borderRadius: '20px', border: `1px solid ${config.states.includes(s) ? G : '#e5e7eb'}`, background: config.states.includes(s) ? G : '#fff', color: config.states.includes(s) ? '#fff' : '#374151', fontSize: '12px', cursor: 'pointer', fontWeight: config.states.includes(s) ? '600' : '400' }}>
              {s}
            </button>
          ))}
        </div>

        <button onClick={buildQueue} style={{ width: '100%', background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
          🚀 Build My Day ({config.count} leads)
        </button>
      </div>
    </div>
  )

  if (done) return (
    <div style={{ padding: '2.5rem', maxWidth: '700px' }}>
      <div style={{ background: '#111827', borderRadius: '20px', padding: '3rem', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏆</div>
        <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800', marginBottom: '8px' }}>Session Complete</h2>
        <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>You worked through {queue.length} leads today.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ background: '#ef444422', borderRadius: '12px', padding: '1rem 1.5rem' }}>
            <div style={{ color: '#ef4444', fontWeight: '800', fontSize: '24px' }}>{Object.values(results).filter(r => r === 'hot').length}</div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>Hot 🔥</div>
          </div>
          <div style={{ background: '#f59e0b22', borderRadius: '12px', padding: '1rem 1.5rem' }}>
            <div style={{ color: '#f59e0b', fontWeight: '800', fontSize: '24px' }}>{Object.values(results).filter(r => r === 'warm').length}</div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>Warm ⚡</div>
          </div>
          <div style={{ background: '#6b728022', borderRadius: '12px', padding: '1rem 1.5rem' }}>
            <div style={{ color: '#6b7280', fontWeight: '800', fontSize: '24px' }}>{Object.values(results).filter(r => r === 'cold').length}</div>
            <div style={{ color: '#9ca3af', fontSize: '13px' }}>Not Ready ❄️</div>
          </div>
        </div>
        <button onClick={() => setConfigured(false)} style={{ background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '12px 24px', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>Start New Session</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding: '2.5rem', maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '4px' }}>⚔️ War Room</h1>
          <p style={{ color: '#6b7280', fontSize: '13px' }}>Lead {index + 1} of {queue.length} · {config.niche} · {config.states.length > 0 ? config.states.join(', ') : 'All states'}</p>
        </div>
        <button onClick={() => setConfigured(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', color: '#6b7280' }}>⚙️ Reconfigure</button>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '6px', marginBottom: '1.5rem' }}>
        <div style={{ background: G, height: '6px', borderRadius: '99px', width: `${((index) / queue.length) * 100}%`, transition: 'width 0.3s' }} />
      </div>

      {/* Opener reminder */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px 16px', marginBottom: '1.5rem', fontSize: '13px', color: '#374151', lineHeight: '1.6' }}>
        <strong style={{ color: G }}>Today's Opener:</strong> {opener}
      </div>

      {/* Lead Card */}
      {current && (
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px' }}>{current.business_name}</h2>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {current.state && <span style={{ background: '#e0e7ff', color: '#3730a3', borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{current.state}</span>}
                {current.industry && <span style={{ background: '#f0fdf4', color: G, borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{current.industry}</span>}
                {current.website_status && <span style={{ background: current.website_status === 'no_website' ? '#fef2f2' : '#f0fdf4', color: current.website_status === 'no_website' ? '#ef4444' : G, borderRadius: '20px', padding: '2px 10px', fontSize: '12px', fontWeight: '600' }}>{current.website_status === 'no_website' ? '🚫 No Website' : '✅ Has Website'}</span>}
              </div>
            </div>
            {current.phone && (
              <a href={`tel:${current.phone}`} style={{ background: G, color: '#fff', borderRadius: '12px', padding: '12px 20px', fontWeight: '700', textDecoration: 'none', fontSize: '15px', whiteSpace: 'nowrap' }}>📲 Call Now</a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>PHONE</div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{current.phone || '–'}</div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>INDUSTRY</div>
              <div style={{ fontWeight: '700', fontSize: '16px' }}>{current.industry || '–'}</div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>FULL BUSINESS NAME (LLC)</div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{current.business_name || '–'}</div>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>Use on TruePeopleSearch →</div>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>WEBSITE STATUS</div>
              <div style={{ fontWeight: '700', fontSize: '14px' }}>{current.website_status || '–'}</div>
            </div>
          </div>

          {/* Notes */}
          <textarea
            placeholder="Call notes — what happened? Callback time? Decision maker name?"
            value={notes[current.id] || ''}
            onChange={e => setNotes(n => ({...n, [current.id]: e.target.value}))}
            rows={3}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', resize: 'vertical', marginBottom: '1rem' }}
          />

          {/* Tag result */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            {[['hot','🔥 Hot','#ef4444'],['warm','⚡ Warm','#f59e0b'],['cold','❄️ Not Ready','#6b7280']].map(([val, label, color]) => (
              <button key={val} onClick={() => logResult(current.id, val)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `2px solid ${results[current.id] === val ? color : '#e5e7eb'}`, background: results[current.id] === val ? color + '18' : '#fff', color: results[current.id] === val ? color : '#374151', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', background: index === 0 ? '#f9fafb' : '#fff', cursor: index === 0 ? 'default' : 'pointer', fontWeight: '600', color: '#374151' }}>← Prev</button>
            <button onClick={() => setIndex(index + 1)} style={{ flex: 2, padding: '12px', borderRadius: '10px', border: 'none', background: G, color: '#fff', fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>
              {index < queue.length - 1 ? 'Next Lead →' : 'Finish Session ✓'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
