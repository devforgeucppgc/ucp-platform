// src/pages/EMagazine.jsx
import { useEffect, useState } from 'react';
import { magazinesService } from '../../admin/services';
import './EMagazine.css';

export default function EMagazine() {
  const [magazines, setMagazines] = useState([]);
  const [selectedMag, setSelectedMag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMagazines();
  }, []);

  // ⭐ Helper to construct full image URL
  const getFullUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    if (path.startsWith('/uploads/')) {
      // Get API base URL from env or use default
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
      const baseUrl = apiBase.replace('/api/v1', '').replace('/api', '');
      return `${baseUrl}${path}`;
    }
    return path;
  };

  const fetchMagazines = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await magazinesService.getAllMagazines();
      console.log('Magazine API response:', response);
      console.log('First magazine:', response?.data?.[0]);
      console.log('Cover image value:', JSON.stringify(response?.data?.[0]?.coverImage, null, 2));      
      let magazinesData = [];
      if (Array.isArray(response?.data)) {
        magazinesData = response.data;
      } else if (Array.isArray(response?.data?.magazines)) {
        magazinesData = response.data.magazines;
      }
      
      const normalizedMagazines = magazinesData.map((m, index) => ({
        ...m,
        id: m._id || m.id || `temp-${index}`,
        date: m.publicationDate 
          ? new Date(m.publicationDate).toISOString().split('T')[0]
          : (m.date || ''),
        // ⭐ Use full URL
        coverImage: getFullUrl(m.coverImage),
        pdfUrl: getFullUrl(m.pdfUrl),
        topics: Array.isArray(m.topics) ? m.topics : [],
      }));
      
      setMagazines(normalizedMagazines);
      
      if (normalizedMagazines.length > 0) {
        setSelectedMag(normalizedMagazines[0]);
      }
    } catch (error) {
      console.error('Failed to fetch magazines:', error);
      setError(error.message || 'Failed to load magazines');
      setMagazines([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadPdf = () => {
    if (!selectedMag?.pdfUrl) return;
    const a = document.createElement('a');
    a.href = selectedMag.pdfUrl;
    a.download = selectedMag.pdfUrl.split('/').pop() || 'magazine.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const readOnline = () => {
    if (!selectedMag?.pdfUrl) return;
    window.open(selectedMag.pdfUrl, '_blank');
  };

  if (loading) {
    return <div className="loading-magazines">Loading magazines...</div>;
  }

  if (error) {
    return <div className="error-magazines">Error: {error}</div>;
  }

  if (magazines.length === 0) {
    return <div className="empty-magazines">No magazines available</div>;
  }

  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="icon">📖</span> Explore
          </div>
          <h1 className="hero-title">
            Horizon: Campus <span className="red">Edition</span>
          </h1>
          <p className="hero-desc">
            Our official university magazine — stories, research and campus life.
          </p>
        </div>
      </section>

      <section className="mag-section">
        <div className="mag-inner">
          <div className="mag-layout">
            <div className="mag-sidebar">
              <h3 className="sidebar-title">📚 All Issues</h3>
              <ul className="mag-list">
                {magazines.map((mag) => (
                  <li
                    key={mag.id}
                    className={`mag-list-item ${selectedMag?.id === mag.id ? 'active' : ''}`}
                    onClick={() => setSelectedMag(mag)}
                  >
                    <div className="mag-list-cover">
                      {mag.coverImage ? (
                        <img 
                          src={mag.coverImage} 
                          alt={mag.title}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="list-placeholder">📄</div>
                      )}
                    </div>
                    <div className="mag-list-info">
                      <div className="mag-list-title">{mag.title}</div>
                      <div className="mag-list-issue">{mag.issue}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {selectedMag && (
              <div className="mag-content">
                <div className="mag-cover-side">
                  <span className="cover-badge">E-Magazine</span>
                  <div className="cover-image-wrap">
                    {selectedMag.coverImage ? (
                      <img
                        className="cover-img"
                        src={selectedMag.coverImage}
                        alt={`${selectedMag.title} cover`}
                        onError={(e) => { 
                          console.log('❌ Image failed:', selectedMag.coverImage);
                          console.log('Image URL:', e.target.src);
                          e.target.style.display = 'none'; 
                        }}
                        onLoad={() => console.log('✅ Image loaded:', selectedMag.coverImage)}
                      />
                    ) : (
                      <div className="cover-placeholder">
                        <div className="ph-icon">🖼️</div>
                        <div className="ph-text">No cover image uploaded.</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mag-info-side">
                  <div className="issue-badge">🗓 {selectedMag.date}</div>
                  <h2 className="mag-title">{selectedMag.title}</h2>
                  <p className="mag-subtitle">{selectedMag.issue}</p>
                  
                  {selectedMag.description && (
                    <div className="editorial-block">
                      <div className="editorial-label">Editorial</div>
                      <p className="editorial-text">{selectedMag.description}</p>
                    </div>
                  )}
                  
                  {selectedMag.topics?.length > 0 && (
                    <div className="topic-pills">
                      {selectedMag.topics.map((topic, i) => (
                        <span key={i} className="topic-pill">{topic}</span>
                      ))}
                    </div>
                  )}

                  <div className="mag-actions">
                    <button
                      className="btn-download"
                      onClick={downloadPdf}
                      disabled={!selectedMag.pdfUrl}
                    >
                      ⬇ Download PDF
                    </button>
                    <button
                      className="btn-read-online"
                      onClick={readOnline}
                      disabled={!selectedMag.pdfUrl}
                    >
                      📖 Read Online
                    </button>
                  </div>
                  
                  {!selectedMag.pdfUrl && (
                    <p style={{ fontSize: '12px', color: '#E63946', marginTop: '10px' }}>
                      ⚠️ PDF not found. Please upload the file.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}