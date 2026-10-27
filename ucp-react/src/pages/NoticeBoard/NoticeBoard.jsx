import { useReveal } from '../../hooks/useScrollEffects';
import { useEffect, useState } from 'react';
import { noticesService } from '../../admin/services';

// import './NoticeBoard.css'; // Kept commented out

export default function NoticeBoard() {
  useReveal();

  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🎨 UPDATED DESIGN: Soft Light Blue-White background for cards
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .announcement-card {
        background-color: #f0f7ff !important; /* Soft, light blue-white */
        color: #1e293b !important;
        opacity: 1 !important;
        visibility: visible !important;
        display: flex !important;
        border: none !important;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.05) !important;
        border-radius: 16px !important;
        padding: 20px !important;
        transition: all 0.2s ease-in-out !important;
      }
      .announcement-card:hover {
        box-shadow: 0 10px 25px rgba(59, 130, 246, 0.1) !important;
        transform: translateY(-2px) !important;
      }
      .announcement-card .ann-title {
        color: #0f172a !important;
        display: block !important;
      }
      .announcement-card .ann-desc {
        color: #475569 !important;
        display: block !important;
      }
      .announcement-card .ann-tag {
        background-color: #ffffff !important;
        color: #2563eb !important;
        border: 1px solid #bfdbfe !important;
        display: inline-block !important;
      }
      .announcement-card .date-badge {
        background: linear-gradient(to bottom right, #3b82f6, #2563eb) !important;
        color: #ffffff !important;
        display: flex !important;
        box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3) !important;
      }
      .events-card {
        background: white !important;
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, evRes] = await Promise.all([
          noticesService.getAllNotices(),
          noticesService.getAllEvents()
        ]);

        let annData = [];
        if (annRes?.data?.announcements && Array.isArray(annRes.data.announcements)) {
          annData = annRes.data.announcements;
        } else if (Array.isArray(annRes?.data)) {
          annData = annRes.data;
        } else if (annRes?.data?.data && Array.isArray(annRes.data.data)) {
          annData = annRes.data.data;
        }

        let evData = [];
        if (evRes?.data?.events && Array.isArray(evRes.data.events)) {
          evData = evRes.data.events;
        } else if (Array.isArray(evRes?.data)) {
          evData = evRes.data;
        } else if (evRes?.data?.data && Array.isArray(evRes.data.data)) {
          evData = evRes.data.data;
        }

        setAnnouncements(annData);
        setEvents(evData);
      } catch (error) {
        console.error('Failed to fetch notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh] text-slate-500 font-medium">Loading announcements...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HERO SECTION */}
      <section className="hero relative bg-white pt-16 pb-12 border-b border-slate-100">
        <div className="hero-inner max-w-6xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-4 border border-blue-100">
            <span className="text-lg">📋</span> Stay Informed
          </div>
          <h1 className="hero-title text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Notice Board
          </h1>
          <p className="hero-desc text-slate-500 text-lg max-w-2xl mx-auto">
            Announcements, academic updates, events and news from across campus.
          </p>
        </div>
      </section>

      {/* MAIN GRID: Announcements (Left 2/3) - Events (Right 1/3) */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* LEFT COLUMN: ANNOUNCEMENTS */}
        <div className="announcements-col lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">Latest Announcements</h2>
            <span className="text-sm text-slate-400 font-medium bg-slate-100 px-3 py-1 rounded-full">
              {announcements.length} Updates
            </span>
          </div>

          <div className="announcement-list space-y-5">
            {announcements.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-100">
                <span className="text-5xl mb-4 block">📭</span>
                <p className="text-slate-500 font-medium text-lg">No announcements published yet.</p>
              </div>
            ) : (
              announcements.map((a, idx) => (
                <div
                  key={a._id || a.id || idx}
                  className="announcement-card"
                  style={{ transitionDelay: `${idx * 0.06}s` }}
                >
                  {/* Date Badge */}
                  <div className="date-badge rounded-2xl p-3 flex flex-col items-center justify-center min-w-[70px] h-[70px] shrink-0 mr-5">
                    <div className="day text-2xl font-bold leading-none">{a.day || '--'}</div>
                    <div className="month text-[10px] font-bold uppercase mt-0.5 opacity-90">{a.month?.substring(0,3) || '---'}</div>
                  </div>
                  
                  <div className="ann-body flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="ann-tag text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {a.tag || 'General'}
                      </span>
                    </div>
                    <div className="ann-title text-[18px] font-bold leading-snug mb-1">{a.title}</div>
                    <div className="ann-desc text-[14px] leading-relaxed">{a.description || a.desc || ''}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: EVENTS SIDEBAR */}
        <div className="sidebar lg:col-span-1">
          <div className="events-card rounded-2xl shadow-xl overflow-hidden sticky top-8 border border-slate-100">
            <div className="bg-[#1e3a8a] px-6 py-5 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg text-white text-lg">📅</div>
              <h3 className="text-[17px] font-bold text-white">Upcoming Events</h3>
            </div>
            
            <div className="p-6 events-list space-y-5">
              {events.length === 0 ? (
                <p className="text-center text-slate-500 font-medium py-4 text-sm">
                  No events scheduled.
                </p>
              ) : (
                events.map((e) => (
                  <div key={e._id || e.id} className="event-item flex gap-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="event-date-box text-white rounded-xl w-12 h-12 flex flex-col items-center justify-center shrink-0 shadow-sm" style={{ background: e.color || '#3B82F6' }}>
                      <div className="e-day text-[14px] font-bold">{e.day || '--'}</div>
                      <div className="e-month text-[9px] font-bold uppercase">{e.month?.substring(0,3) || '---'}</div>
                    </div>
                    <div className="event-info flex-1">
                      <div className="e-title font-bold text-slate-800 text-[14px] leading-tight">{e.title}</div>
                      <div className="e-time text-[12px] text-slate-500 flex flex-wrap gap-x-3 mt-1">
                        {e.time && <span className="flex items-center gap-1">🕒 {e.time}</span>} 
                        {e.location && <span className="flex items-center gap-1">📍 {e.location}</span>}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 