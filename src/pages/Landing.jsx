import { useState } from 'react'

const G = '#16a34a'

export default function Landing({ password }) {
  const [showModal, setShowModal] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [section, setSection] = useState('home')
  const [consultForm, setConsultForm] = useState({
    businessName: '', industry: 'Restaurant', ownerName: '', phone: '',
    email: '', locations: '1', website: '', noWebsite: false,
    challenge: 'Outdated website', runsAds: 'No', monthlyLeads: '0–5',
    budget: 'Under $500', timeline: 'ASAP', contactMethod: 'Email',
    bestTime: 'Morning', hearAbout: 'Google', message: ''
  })

  const unlock = () => {
    if (pw === password) {
      localStorage.setItem('lf_access', '1')
      window.location.href = '/crm/dashboard'
    } else {
      setError('Incorrect password. Contact LeadFlow for access.')
      setPw('')
    }
  }

  const navStyle = { background: '#fff', borderBottom: '1px solid #f3f4f6', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px', position: 'sticky', top: 0, zIndex: 100 }
  const linkStyle = (s) => ({ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '500', color: section === s ? G : '#374151', fontFamily: 'Inter, sans-serif', padding: '0 4px' })

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', color: '#111827', background: '#fff', minHeight: '100vh' }}>
      <nav style={navStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: G, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }}>📍</div>
          <span style={{ fontWeight: '800', fontSize: '18px', letterSpacing: '-0.5px' }}>LeadFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          {['home','demo','how','about','consultation'].map(s => (
            <button key={s} onClick={() => setSection(s)} style={linkStyle(s)}>
              {s === 'how' ? 'How It Works' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <button onClick={() => setSection('consultation')} style={{ background: G, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Book a Consultation</button>
      </nav>

      {section === 'home' && (
        <>
          <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '6rem 2rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '6px 14px', fontSize: '13px', color: G, fontWeight: '500', marginBottom: '1.5rem' }}>
                Built for local business prospecting
              </div>
              <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-2px', marginBottom: '1.5rem' }}>Stop hunting leads.<br />Start closing them.</h1>
              <p style={{ color: '#6b7280', lineHeight: '1.8', fontSize: '16px', marginBottom: '2rem', maxWidth: '460px' }}>LeadFlow finds local businesses that need your help, puts them in a pipeline, and gives you everything to pitch them.</p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button onClick={() => setShowModal(true)} style={{ background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 24px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Access Your CRM →</button>
                <button onClick={() => setSection('how')} style={{ background: '#fff', color: '#374151', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 24px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>▶ Watch Demo</button>
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '4/3' }}>
                <img src="https://images.unsplash.com/photo-1556401013-a5f4ef45d027?w=800&q=80" alt="neighborhood" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', background: '#fff', borderRadius: '12px', padding: '12px 18px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
                <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '2px' }}>Leads in pipeline</div>
                <div style={{ fontSize: '22px', fontWeight: '800' }}>940 <span style={{ color: G, fontSize: '14px', fontWeight: '600' }}>active</span></div>
              </div>
            </div>
          </section>

          <section style={{ background: '#f9fafb', padding: '5rem 2rem', textAlign: 'center' }}>
            <div style={{ color: G, fontWeight: '700', fontSize: '13px', letterSpacing: '1px', marginBottom: '12px' }}>HOW IT WORKS</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '2rem' }}>From cold list to closed client</h2>
            <p style={{ color: '#6b7280', marginBottom: '3rem' }}>No guesswork. Four steps, run in order, every single day.</p>
            <div style={{ display: 'flex', gap: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
              {[
                { n: '01', icon: '🎯', title: 'Pick your industry', desc: 'Choose a target vertical and set your service area.' },
                { n: '02', icon: '📋', title: 'Leads auto-populate', desc: 'Local businesses land in Lead Finder with name, phone, and website status.' },
                { n: '03', icon: '📖', title: 'Open the Pitch Playbook', desc: 'Every industry has a proven opening hook and word-for-word close.' },
                { n: '04', icon: '📊', title: 'Log, tag & report', desc: 'Tag leads Hot/Warm/Not Ready. Get an AI debrief at end of day.' },
              ].map(s => (
                <div key={s.n} style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f3f4f6', textAlign: 'left' }}>
                  <div style={{ color: G, fontWeight: '700', fontSize: '13px', marginBottom: '12px' }}>{s.n}</div>
                  <div style={{ fontSize: '24px', marginBottom: '12px' }}>{s.icon}</div>
                  <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '8px' }}>{s.title}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px', lineHeight: '1.6' }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '5rem 2rem', display: 'flex', gap: '4rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ color: G, fontWeight: '700', fontSize: '13px', letterSpacing: '1px', marginBottom: '12px' }}>ABOUT</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem', lineHeight: '1.2' }}>Built by salespeople,<br />for salespeople.</h2>
              <p style={{ color: '#6b7280', lineHeight: '1.8', marginBottom: '1rem' }}>We spent years knocking on doors and cold-calling local businesses — restaurants losing orders to chains, plumbers invisible on Google, solar installers watching hot leads go cold.</p>
              <p style={{ color: '#6b7280', lineHeight: '1.8' }}>So we built the tool we wished we had. LeadFlow handles the discovery, drops leads into a clean pipeline, and hands you a battle-tested playbook for every industry.</p>
            </div>
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { val: '8+', label: 'Industries covered' },
                { val: 'Every vertical', label: 'Pitch playbooks' },
                { val: 'Minutes', label: 'Setup time' },
                { val: 'Solo reps', label: 'Built for' },
              ].map(s => (
                <div key={s.val} style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
                  <div style={{ color: G, fontWeight: '800', fontSize: '20px', marginBottom: '4px' }}>{s.val}</div>
                  <div style={{ color: '#6b7280', fontSize: '13px' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ margin: '0 2rem 4rem', background: '#111827', borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#fff', fontWeight: '800', letterSpacing: '-1px', marginBottom: '1.5rem' }}>Ready to fill your pipeline?</h2>
            <p style={{ color: '#9ca3af', marginBottom: '2rem' }}>Book a 20-minute consultation and we'll show you exactly how LeadFlow works for your area.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setShowModal(true)} style={{ background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Access Your CRM</button>
              <button onClick={() => setSection('consultation')} style={{ background: 'transparent', color: '#fff', border: '1px solid #374151', borderRadius: '10px', padding: '14px 28px', fontWeight: '600', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Book a Consultation</button>
            </div>
          </section>
        </>
      )}

      {section === 'consultation' && (
        <section style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', letterSpacing: '-1px', marginBottom: '8px' }}>Book a Consultation</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Tell us about your business and we'll show you how LeadFlow works for your industry.</p>
          <div style={{ background: '#fff', border: '1px solid #f3f4f6', borderRadius: '20px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Business name *</label>
                <input placeholder="Business name" value={consultForm.businessName} onChange={e => setConsultForm({...consultForm, businessName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Industry / type *</label>
                <select value={consultForm.industry} onChange={e => setConsultForm({...consultForm, industry: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['Restaurant','Salon','Barbershop','Gym','Plumber','Electrician','HVAC','Solar','Real Estate','Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Your name (decision-maker) *</label>
                <input placeholder="Your name" value={consultForm.ownerName} onChange={e => setConsultForm({...consultForm, ownerName: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Phone number *</label>
                <input placeholder="Phone number" value={consultForm.phone} onChange={e => setConsultForm({...consultForm, phone: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Email *</label>
                <input placeholder="Email" value={consultForm.email} onChange={e => setConsultForm({...consultForm, email: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Number of locations</label>
                <input placeholder="1" value={consultForm.locations} onChange={e => setConsultForm({...consultForm, locations: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Current website</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input placeholder="https://yourbusiness.com" value={consultForm.website} disabled={consultForm.noWebsite} onChange={e => setConsultForm({...consultForm, website: e.target.value})} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', background: consultForm.noWebsite ? '#f9fafb' : '#fff' }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  <input type="checkbox" checked={consultForm.noWebsite} onChange={e => setConsultForm({...consultForm, noWebsite: e.target.checked, website: ''})} />
                  I don't have one
                </label>
              </div>
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>What's your biggest challenge right now?</label>
              <select value={consultForm.challenge} onChange={e => setConsultForm({...consultForm, challenge: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                {['Outdated website','No website','Not showing on Google','No leads coming in','Hard to follow up','Other'].map(i => <option key={i}>{i}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Do you run online ads?</label>
                <select value={consultForm.runsAds} onChange={e => setConsultForm({...consultForm, runsAds: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['No','Yes - Google','Yes - Facebook/Instagram','Yes - Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>New customers/month from search</label>
                <select value={consultForm.monthlyLeads} onChange={e => setConsultForm({...consultForm, monthlyLeads: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['0–5','6–20','21–50','50+'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Rough monthly marketing budget</label>
                <select value={consultForm.budget} onChange={e => setConsultForm({...consultForm, budget: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['Under $500','$500–$1,000','$1,000–$2,500','$2,500+','Not sure'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>How soon do you want to start?</label>
                <select value={consultForm.timeline} onChange={e => setConsultForm({...consultForm, timeline: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['ASAP','Within a month','1–3 months','Just exploring'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Preferred contact method</label>
                <select value={consultForm.contactMethod} onChange={e => setConsultForm({...consultForm, contactMethod: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['Email','Phone','Text'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Best time to reach you</label>
                <select value={consultForm.bestTime} onChange={e => setConsultForm({...consultForm, bestTime: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['Morning','Afternoon','Evening','Weekend mornings','Anytime'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>How did you hear about us?</label>
                <select value={consultForm.hearAbout} onChange={e => setConsultForm({...consultForm, hearAbout: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }}>
                  {['Google','Social media','Referral','Cold call','Other'].map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Anything else you want us to know before the call?</label>
              <textarea placeholder="Optional message..." value={consultForm.message} onChange={e => setConsultForm({...consultForm, message: e.target.value})} rows={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '14px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', resize: 'vertical' }} />
            </div>
            <button style={{ width: '100%', background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Book My Consultation →</button>
          </div>
        </section>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: '20px', padding: '2.5rem', width: '400px', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '56px', height: '56px', background: '#f0fdf4', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 1.5rem' }}>🔒</div>
            <h3 style={{ fontWeight: '800', fontSize: '20px', marginBottom: '8px' }}>Client Portal Access</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' }}>Enter your access password to open the CRM.</p>
            <input
              type="password"
              placeholder="Enter your password"
              value={pw}
              onChange={e => { setPw(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && unlock()}
              style={{ width: '100%', padding: '14px', borderRadius: '10px', border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`, fontSize: '15px', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', marginBottom: '8px', textAlign: 'center' }}
            />
            {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '8px' }}>{error}</p>}
            <button onClick={unlock} style={{ width: '100%', background: G, color: '#fff', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', fontFamily: 'Inter, sans-serif', marginBottom: '10px' }}>Unlock CRM</button>
            <button onClick={() => { setShowModal(false); setError(''); setPw('') }} style={{ background: 'none', border: 'none', color: '#9ca3af', fontSize: '14px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
