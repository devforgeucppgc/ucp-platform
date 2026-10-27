import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useReveal } from '../../hooks/useScrollEffects';
import { societiesService, galleryService } from '../../admin/services';
import styles from './Societies.module.css';

const AVATAR_COLORS = ['#7C3AED', '#E63946', '#D4A017', '#1A3C6E', '#0EA5E9', '#8B5CF6', '#EF4444', '#F59E0B', '#10B981'];

function initialsOf(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Societies() {
  const { societyKey } = useParams();
  const [allSocieties, setAllSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [galleryView, setGalleryView] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryError, setGalleryError] = useState('');
  useReveal([selectedId]);

  const loadData = async () => {
    setLoading(true);
    try {
      // getAllSocieties() response shape from the backend:
      // { success, message, data: { societies: [...], pagination: {...} } }
      // response.data was previously (incorrectly) treated as the array itself.
      const response = await societiesService.getAllSocieties({ limit: 100 });      const data = Array.isArray(response?.data?.societies) ? response.data.societies : [];
      setAllSocieties(data);

      if (societyKey) {
        const found = data.find((s) => s._id === societyKey || s.id === societyKey || s.slug === societyKey);
        if (found) {
          setSelectedId(found._id || found.id || found.slug);
          setError(null);
        } else {
          setSelectedId(null);
          setError('Society Not Found');
        }
      } else {
        setSelectedId(null);
        setError(null);
      }
    } catch (err) {
      console.error('Load error:', err);
      setError('Failed to load societies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [societyKey]);

  const openDetail = (id) => {
    setSelectedId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closeDetail = () => {
    setSelectedId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const openGallery = async (society) => {
    const societyId = society._id || society.id;

    setGalleryView(society);
    setGalleryItems([]);
    setGalleryError('');
    setGalleryLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

  try {
    const response = await galleryService.getAllGallery({
      society: societyId,
      limit: 50,
    });

    const data = response?.data?.data ?? response?.data ?? response;

    setGalleryItems(
      Array.isArray(data?.images) ? data.images : []
    );
  } catch (error) {
    console.error('Public gallery loading error:', error);
    setGalleryError('Gallery load nahi ho saki. Dobara try karein.');
  } finally {
    setGalleryLoading(false);
  }
};

  const closeGallery = () => {
    setGalleryView(null);
    setGalleryItems([]);
    setGalleryError('');
};


  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.hero} style={{ padding: '4rem 1rem' }}>
          <div className={styles['hero-inner']}>
            <div className={styles.eyebrow}>Loading societies…</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #ccc', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.hero} style={{ padding: '4rem 1rem', backgroundColor: '#fee2e2' }}>
          <h1 style={{ color: '#b91c1c' }}>Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  const selected = (allSocieties || []).find((s) => (s._id || s.id || s.slug) === selectedId);
  
if (galleryView) {
  return (
    <div
      className={styles.container}
      style={{ minHeight: '80vh', padding: '40px 24px' }}
    >
      <button
        onClick={closeGallery}
        className={`${styles['btn-sm']} ${styles['btn-sm-primary']}`}
        style={{ marginBottom: '24px' }}
      >
        ← Back to Societies
      </button>

      <h1 style={{ marginBottom: '8px' }}>
        {galleryView.name} — Gallery
      </h1>

      <p style={{ marginBottom: '28px', color: '#6b7280' }}>
        Photos and events from {galleryView.name}
      </p>

      {galleryLoading && <p>Loading gallery...</p>}

      {galleryError && <p>{galleryError}</p>}

      {!galleryLoading &&
        !galleryError &&
        galleryItems.length === 0 && (
          <p>No gallery images available for this society yet.</p>
        )}

      {!galleryLoading && galleryItems.length > 0 && (
        <div className={styles['gallery-grid']}>
          {galleryItems.map((item) => (
            <div
              key={item._id || item.id}
              className={styles['gallery-item']}
            >
              <img
                src={item.imageUrl}
                alt={item.title || `${galleryView.name} gallery`}
                loading="lazy"
              />

              <div style={{ padding: '10px' }}>
                <h3>{item.title}</h3>

                {item.description && (
                  <p>{item.description}</p>
                )}

                {item.eventDate && (
                  <small>
                    {new Date(item.eventDate).toLocaleDateString()}
                  </small>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

  if (selected) {
    return (
      <div className={`${styles['detail-view']} ${styles.active}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', background: 'white', zIndex: 9999, padding: '20px 40px 60px' }}>
        <button onClick={closeDetail} style={{ position: 'fixed', top: '20px', left: '24px', background: 'rgba(255,255,255,0.95)', border: '1px solid #ddd', borderRadius: '30px', padding: '8px 18px', fontSize: '13px', fontWeight: '600', color: '#2563EB', cursor: 'pointer', zIndex: 10000, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          ← Back
        </button>

        <div style={{ marginTop: '70px' }}>
          <div className={styles['detail-header']}>
            <div className={styles['detail-icon']} style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', background: '#f3f4f6' }}>
              {selected.logo ? <img src={selected.logo} alt={selected.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <i className={`fas ${selected.icon || 'fa-users'}`} style={{ fontSize: '50px', color: '#7C3AED' }}></i>}
            </div>
            <div className={styles['detail-header-info']}>
              <h1>{selected.name}</h1>
              <div className={styles['detail-tagline']}>{selected.tagline}</div>
              <span className={styles['detail-tag']}>{selected.tag}</span>
            </div>
          </div>

          <div className={styles['detail-description']}>{selected.description}</div>

          {selected.mission && <div className={styles['detail-mission']}><h2>Mission</h2><p>{selected.mission}</p></div>}
          {selected.objectives?.length > 0 && <div className={styles['detail-objectives']}><h2>Objectives</h2><ul>{selected.objectives.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>}
          {selected.activities?.length > 0 && <div className={styles['detail-activities']}><h2>Activities</h2><ul>{selected.activities.map((item, idx) => <li key={idx}>{item}</li>)}</ul></div>}
          {selected.vision && <div className={styles['detail-vision']}><h2>Vision</h2><p>{selected.vision}</p></div>}
          {selected.contact && <div className={styles['detail-contact']}><h2>Contact Information</h2>{selected.contact.email && <p><i className="fas fa-envelope"></i> {selected.contact.email}</p>}{selected.contact.phone && <p><i className="fas fa-phone"></i> {selected.contact.phone}</p>}{selected.contact.office && <p><i className="fas fa-map-marker-alt"></i> {selected.contact.office}</p>}</div>}
          {selected.motto && <div className={styles['detail-motto']}><h2>Club Motto</h2><blockquote>{selected.motto}</blockquote></div>}

          {/* ── GALLERY SECTION ── */}
          {selected.gallery?.length > 0 && (
            <div className={styles['gallery-section']}>
              <div className={styles['team-heading-wrapper']}>
                <div className={styles['team-heading']}>
                  <i className="fas fa-images"></i>
                  <span>Photo Gallery</span>
                </div>
              </div>
              <div className={styles['gallery-grid']}>
                {selected.gallery.map((imgUrl, idx) => (
                  <div key={idx} className={styles['gallery-item']}>
                    <img
                      src={imgUrl}
                      alt={`${selected.name} gallery ${idx + 1}`}
                      loading="lazy"
                      onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {selected.headOfSociety && selected.headOfSociety.name && (
            <div className={styles['team-section']}>
              <div className={styles['team-heading-wrapper']}>
                <div className={styles['team-heading']}><i className="fas fa-user-tie"></i><span>Head of Society</span></div>
              </div>
              <div className={styles['team-grid']} style={{ display: 'flex', justifyContent: 'center' }}>
                <div className={styles['team-member']} style={{ '--member-color': AVATAR_COLORS[0] }}>
                  <div className={styles['avatar-wrap']}>
                    <div className={styles.avatar} style={{ background: `${AVATAR_COLORS[0]}15`, color: AVATAR_COLORS[0], borderColor: `${AVATAR_COLORS[0]}30` }}>
                      <img src={selected.headOfSociety.image} alt={selected.headOfSociety.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                      <span className={styles['avatar-fallback']} style={{ display: 'none' }}>{initialsOf(selected.headOfSociety.name)}</span>
                    </div>
                  </div>
                  <div className={styles['member-name']}>{selected.headOfSociety.name}</div>
                  <div className={styles['member-designation']}>{selected.headOfSociety.designation}</div>
                  {selected.headOfSociety.phone && <div className={styles['member-skills']}><span>{selected.headOfSociety.phone}</span></div>}
                </div>
              </div>
            </div>
          )}

          {(selected.team?.length > 0 || selected.teamMembers?.length > 0) && (
            <div className={styles['team-section']}>
              <div className={styles['team-heading-wrapper']}>
                <div className={styles['team-heading']}><i className="fas fa-users"></i><span>Team</span></div>
              </div>
              <div className={styles['team-grid']}>
                {(selected.team?.length > 0 ? selected.team : selected.teamMembers).map((member, idx) => {
                  const color = AVATAR_COLORS[idx % AVATAR_COLORS.length];
                  return (
                    <div key={member.id || idx} className={styles['team-member']} style={{ '--member-color': color }}>
                      <div className={styles['avatar-wrap']}>
                        <div className={styles.avatar} style={{ background: `${color}15`, color, borderColor: `${color}30` }}>
                          {member.image ? (
                            <>
                              <img src={member.image} alt={member.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                              <span className={styles['avatar-fallback']} style={{ display: 'none' }}>{initialsOf(member.name)}</span>
                            </>
                          ) : (
                            <span className={styles['avatar-fallback']}>{initialsOf(member.name)}</span>
                          )}
                        </div>
                      </div>
                      <div className={styles['member-name']}>{member.name}</div>
                      <div className={styles['member-designation']}>{member.designation}</div>
                      {member.skills?.length > 0 && (
                        <div className={styles['member-skills']}>
                          {member.skills.map((s, i) => <span key={i}>{s}</span>)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <section className={styles.hero}>
        <div className={styles['hero-inner']}>
          <div className={styles.eyebrow}><i className="fas fa-users"></i> Student Life</div>
          <h1 className={styles['hero-title']}>Clubs &amp; <span className={styles['gradient-text']}>Societies</span></h1>
          <p className={styles['hero-desc']}>Clubs and societies play a significant role in BS and ADP programs...</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles['section-label']} reveal reveal-up`}>
          <div className={styles.eyebrow}><i className="fas fa-star"></i> Our Community</div>
          <h2>Explore <span className={styles.highlight}>All Societies</span></h2>
        </div>

        {(allSocieties || []).length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#6b7280' }}>
            <p>No societies available yet. Check back later!</p>
          </div>
        ) : (
          <div className={styles['societies-grid']}>
            {(allSocieties || []).map((s, idx) => {
              const shortDesc = s.description?.length > 100 ? s.description.slice(0, 100) + '…' : s.description || '';
              return (
                <div key={s._id || s.id || s.slug} className={`${styles['society-card']} reveal`} style={{ animationDelay: `${idx * 0.05}s` }} onClick={() => openDetail(s._id || s.id || s.slug)}>
                  <div className={styles['icon-wrap']}>
                    {s.logo ? <img src={s.logo} alt={s.name} className={styles['society-logo']} /> : <i className={`fas ${s.icon || 'fa-users'}`}></i>}
                  </div>
                  <h3>{s.name}</h3>
                  <div className={styles.tagline}>{s.tagline}</div>
                  <span className={styles.tag}>{s.tag}</span>
                  <p className={styles.desc}>{shortDesc}</p>
                  <div className={styles['card-actions']}>
                    <button className={`${styles['btn-sm']} ${styles['btn-sm-primary']}`} onClick={(e) => { e.stopPropagation(); openDetail(s._id || s.id || s.slug); }}>
                      <i className="fas fa-eye"></i> View Details
                    </button>
                    <button
                      className={`${styles['btn-sm']} ${styles['btn-sm-primary']}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        openGallery(s);
                      }}
                    >
                      <i className="fas fa-images"></i> Gallery
                    </button>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}