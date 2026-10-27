import { useState, useEffect } from 'react';
import { useReveal, useDataCountCounters } from '../../hooks/useScrollEffects';
import { campusService } from '../../admin/services';
import './CampusInfo.css';

function FeeTable({ title, icon, color, rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="card" style={{ marginBottom: '32px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '12px' }}>
        <i className={`fas ${icon}`} style={{ color, marginRight: '8px' }}></i> {title}
      </h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Programme</th>
              <th>Cr Hrs</th>
              <th>Registration</th>
              <th>Admission</th>
              <th>Per Cr Hr</th>
              <th>Total</th>
              <th>Yearly Avg</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row._id || i}>
                <td>{row.programName || row.programme || '—'}</td>
                <td>{row.creditHours ?? '—'}</td>
                <td>{row.registration != null ? `PKR ${row.registration.toLocaleString()}` : '—'}</td>
                <td>{row.admission != null ? `PKR ${row.admission.toLocaleString()}` : '—'}</td>
                <td>{row.perCredit != null ? `PKR ${row.perCredit.toLocaleString()}` : '—'}</td>
                <td>{row.total != null ? `PKR ${row.total.toLocaleString()}` : '—'}</td>
                <td>{row.yearlyAvg != null ? `PKR ${row.yearlyAvg.toLocaleString()}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>* All amounts in PKR.</p>
    </div>
  );
}

function ScholarshipTable({ scholarships }) {
  if (!scholarships || scholarships.length === 0) return null;
  return (
    <div className="card" style={{ marginBottom: '32px' }}>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Scholarship</th>
              <th>Program</th>
              <th>Eligibility</th>
              <th>Discount</th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((s, i) => (
              <tr key={s._id || i}>
                <td>{s.title}</td>
                <td>{s.program || s.type || '—'}</td>
                <td>{s.eligibility || s.description || '—'}</td>
                <td><span className="badge">{s.percentage}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CampusInfo() {
  useReveal();
  useDataCountCounters();

  const [campusData, setCampusData] = useState({
    hero: {},
    statistics: [],
    admissionPolicy: {},
    degreePrograms: { adp: [], bs: [], postAdp: [] },
    feeStructures: { bs: [], adp: [], post_adp: [] },
    scholarships: [],
    features: [],
    clubs: [],
    campuses: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampusData = async () => {
      try {
        const response = await campusService.getCampusInformation();
        const data = response.data || {};

        setCampusData({
          hero: data.hero || {},
          statistics: Array.isArray(data.stats) ? data.stats : [],
          admissionPolicy: data.admissionPolicy || {},
          degreePrograms: {
            adp: Array.isArray(data.degreePrograms) ? data.degreePrograms.filter(p => p.type === 'ADP') : [],
            bs: Array.isArray(data.degreePrograms) ? data.degreePrograms.filter(p => p.type === 'BS') : [],
            postAdp: Array.isArray(data.degreePrograms) ? data.degreePrograms.filter(p => p.type === 'Post-ADP') : [],
          },
          feeStructures: {
            bs: Array.isArray(data.feeStructures) ? data.feeStructures.filter(f => f.programType === 'BS') : [],
            adp: Array.isArray(data.feeStructures) ? data.feeStructures.filter(f => f.programType === 'ADP') : [],
            post_adp: Array.isArray(data.feeStructures) ? data.feeStructures.filter(f => f.programType === 'Post-ADP') : [],
          },
          scholarships: Array.isArray(data.scholarships) ? data.scholarships : [],
          features: Array.isArray(data.features) ? data.features : [],
          clubs: Array.isArray(data.clubs) ? data.clubs : [],
          campuses: data.campusDetails ? [data.campusDetails] : [],
        });
      } catch (error) {
        console.error("Failed to fetch campus info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCampusData();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--blue-accent)' }}></i>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Loading campus information...</p>
        </div>
      </div>
    );
  }

  const { hero, statistics, admissionPolicy, degreePrograms, feeStructures, features, scholarships, clubs, campuses } = campusData;

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">
            <i className="fas fa-university"></i> {hero?.badgeText || 'Campus Info'}
          </div>
          <h1 className="hero-title">
            {hero?.title || 'Your Gateway to Academic Excellence'}
          </h1>
          <p className="hero-desc">
            {hero?.description || 'Explore our programs, fee structure, scholarships, and vibrant campus life.'}
          </p>
          <div className="hero-badge">
            <i className="fas fa-calendar-alt"></i> Academic Year <strong>{hero?.academicYear || '2026'}</strong>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      {statistics.length > 0 && (
        <section className="section" style={{ paddingTop: '20px' }}>
          <div className="grid-6 stagger-grid">
            {statistics.map((s, idx) => (
              <div key={idx} className="stat-highlight" style={{ '--i': idx }}>
                <span className="icon"><i className={`fas ${s.icon}`}></i></span>
                <span className="number" data-count={s.count}>{s.count}</span>
                <span className="label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ADMISSION POLICY */}
      <section className="section">
        <div className="grid-2">
          <div className="card">
            <span className="icon-large"><i className="fas fa-landmark"></i></span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--dark)', marginBottom: '16px' }}>
              A Constituent College of <span className="highlight">UCP</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.95rem' }}>
              {admissionPolicy?.description || 'Constituent Colleges are maintained and administrated by the university itself. They offer HEC-recognized degree programs with access to all UCP resources and facilities.'}
            </p>
          </div>
          <div className="card" style={{ transitionDelay: '0.1s' }}>
            <span className="icon-large"><i className="fas fa-clipboard-list"></i></span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '12px' }}>Admission Policy</h3>
            <p><strong>Minimum Eligibility:</strong> {admissionPolicy?.minEligibility || '45% marks'}</p>
            <p style={{ marginTop: '12px' }}><strong>Admission Criteria:</strong></p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '6px' }}>
              <li style={{ padding: '4px 0' }}>• {admissionPolicy?.bscsCriteria || 'BSCS requires 50% or above.'}</li>
              <li style={{ padding: '4px 0' }}>• {admissionPolicy?.otherCriteria || 'All other BS programs require 45% or above.'}</li>
            </ul>
            {admissionPolicy?.registrationPolicy && (
              <>
                <hr style={{ margin: '16px 0' }} />
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <strong>Registration:</strong> {admissionPolicy.registrationPolicy}
                </p>
              </>
            )}
            {admissionPolicy?.attendancePolicy && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                <strong>Attendance:</strong> {admissionPolicy.attendancePolicy}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* DEGREE PROGRAMS */}
      <section className="section accent-bg">
        <div className="section-label">
          <div className="eyebrow"><i className="fas fa-book-open"></i> Programs</div>
          <h2>Explore Our <span className="highlight">Degree Programs</span></h2>
        </div>
        <div className="grid-2" style={{ marginTop: '20px' }}>
          {degreePrograms.adp.length > 0 && (
            <div className="card">
              <span className="icon-large"><i className="fas fa-user-graduate"></i></span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '16px' }}>
                Associate Degree Programs <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>(2 Years)</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {degreePrograms.adp.map((p, i) => (
                  <span key={p._id || i} className="pill">{p.name}</span>
                ))}
              </div>
            </div>
          )}
          {degreePrograms.bs.length > 0 && (
            <div className="card" style={{ transitionDelay: '0.1s' }}>
              <span className="icon-large"><i className="fas fa-university"></i></span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '16px' }}>
                Bachelors Programs <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>(4 Years)</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {degreePrograms.bs.map((p, i) => (
                  <span key={p._id || i} className="pill">{p.name}</span>
                ))}
              </div>
            </div>
          )}
          {degreePrograms.postAdp.length > 0 && (
            <div className="card" style={{ transitionDelay: '0.2s' }}>
              <span className="icon-large"><i className="fas fa-arrow-right"></i></span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '16px' }}>
                Post-ADP Programs <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>(2 Years)</span>
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {degreePrograms.postAdp.map((p, i) => (
                  <span key={p._id || i} className="pill">{p.name}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* FEE STRUCTURE */}
      <section className="section">
        <div className="section-label">
          <div className="eyebrow"><i className="fas fa-coins"></i> Fee Structure</div>
          <h2>2024–2026 <span className="highlight">Tuition Fees</span></h2>
        </div>
        <FeeTable title="BS Programs" icon="fa-graduation-cap" color="var(--blue-accent)" rows={feeStructures.bs} />
        <FeeTable title="ADP Programs" icon="fa-layer-group" color="var(--purple)" rows={feeStructures.adp} />
        <FeeTable title="Post-ADP Programs" icon="fa-arrow-right" color="var(--gold)" rows={feeStructures.post_adp} />
      </section>

      {/* SCHOLARSHIPS */}
      {scholarships.length > 0 && (
        <section className="section accent-bg">
          <div className="section-label">
            <div className="eyebrow"><i className="fas fa-award"></i> Scholarships</div>
            <h2>Financial <span className="highlight">Assistance</span></h2>
          </div>
          <ScholarshipTable scholarships={scholarships} />
        </section>
      )}

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="section">
          <div className="section-label">
            <div className="eyebrow"><i className="fas fa-star"></i> Why UCP</div>
            <h2>Key <span className="highlight">Features</span></h2>
          </div>
          <div className="card">
            <ul className="feature-list">
              {features.map((f, i) => (
                <li key={f._id || i}>
                  <i className="fas fa-check-circle"></i>
                  {typeof f === 'string' ? f : (f.text || f.title || '')}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CLUBS */}
      {clubs.length > 0 && (
        <section className="section accent-bg">
          <div className="section-label">
            <div className="eyebrow"><i className="fas fa-users"></i> Campus Life</div>
            <h2>Student <span className="highlight">Clubs & Societies</span></h2>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {clubs.map((club, i) => (
              <span key={club._id || i} className="club-tag">
                <i className={`fas ${club.icon || 'fa-circle'}`} style={{ marginRight: '8px', color: 'var(--blue-accent)' }}></i>
                {club.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* CAMPUS LOCATION */}
      {campuses.length > 0 && campuses[0]?.address && (
        <section className="section">
          <div className="section-label">
            <div className="eyebrow"><i className="fas fa-map-marker-alt"></i> Location</div>
            <h2>Find <span className="highlight">Our Campus</span></h2>
          </div>
          <div className="grid-2" style={{ marginTop: '20px' }}>
            {campuses.map((campus, i) => (
              <div key={i} className="campus-card">
                <h3><i className="fas fa-building" style={{ color: 'var(--blue-accent)', marginRight: '8px' }}></i>{campus.name}</h3>
                {campus.address && <p><i className="fas fa-map-pin" style={{ marginRight: '6px' }}></i>{campus.address}</p>}
                {campus.phone && <p className="phone"><i className="fas fa-phone" style={{ marginRight: '6px' }}></i>{campus.phone}</p>}
                {campus.email && <p><i className="fas fa-envelope" style={{ marginRight: '6px' }}></i>{campus.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}