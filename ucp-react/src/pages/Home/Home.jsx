import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useReveal, useCounters } from '../../hooks/useScrollEffects';
import { homeService } from '../../admin/services';
import styles from './Home.module.css';

const QUICK_LINKS = [
  { to: '/societies', icon: '🎭', label: 'Clubs & Societies', desc: 'Join vibrant student communities' },
  { to: '/notice-board', icon: '📢', label: 'Notice Board', desc: 'Stay updated with announcements' },
  { to: '/e-magazine', icon: '📰', label: 'E-Magazine', desc: 'Read our student publications' },
  { to: '/projects', icon: '🚀', label: 'Projects', desc: 'Explore student innovations' },
  { to: '/campus-info', icon: '🏛️', label: 'Campus Info', desc: 'Programs, fees & facilities' },
  { to: '/contact', icon: '✉️', label: 'Contact Us', desc: 'Get in touch with us' },
];

const FEATURES = [
  { icon: '🎓', title: 'Quality Education', desc: 'NCRC-affiliated programs with internationally recognized curricula and expert faculty.' },
  { icon: '🌍', title: 'Global Exposure', desc: 'Collaborations with international universities and exchange programs.' },
  { icon: '🏅', title: 'Award-Winning', desc: 'Recognized for academic excellence and student development initiatives.' },
  { icon: '💡', title: 'Innovation Hub', desc: 'State-of-the-art labs and research centers driving innovation.' },
];

export default function Home() {
  useReveal();
  useCounters();

  const [homeData, setHomeData] = useState({ hero: {}, about: {}, stats: {}, video: {} });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [heroRes, aboutRes, statsRes, videoRes] = await Promise.all([
          homeService.getHero(),
          homeService.getAbout(),
          homeService.getStats(),
          homeService.getVideo(),
        ]);
        setHomeData({
          hero: heroRes.data || {},
          about: aboutRes.data || {},
          stats: statsRes.data || {},
          video: videoRes.data || {},
        });
      } catch (error) {
        console.error("Failed to fetch home page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  // ✅ HELPER 1: Detect which platform the URL is from
  const getVideoType = (url) => {
    if (!url) return 'none';
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
    if (url.includes('instagram.com')) return 'instagram';
    return 'direct'; // .mp4, Cloudinary, etc.
  };

  // ✅ HELPER 2: Generate the exact embed URL needed for that specific platform
  const getEmbedUrl = (url, type) => {
    if (type === 'youtube') {
      let embedUrl = url;
      if (url.includes('watch?v=')) {
        embedUrl = url.replace('watch?v=', 'embed/').split('&')[0];
      } else if (url.includes('youtu.be/')) {
        embedUrl = url.replace('youtu.be/', 'youtube.com/embed/').split('?')[0];
      }
      return embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1&mute=1';
    }
    
    if (type === 'facebook') {
      // Facebook requires the URL to be specially encoded for their video plugin
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1&mute=1`;
    }
    
    if (type === 'instagram') {
      // Instagram just needs /embed added to the end (stripping any tracking ?igshid= tags)
      const cleanUrl = url.split('?')[0].replace(/\/$/, '');
      return `${cleanUrl}/embed`;
    }

    return url;
  };

  if (loading) {
    return (
      <div className={styles['loading-screen']}>
        <div className={styles['loading-spinner']}></div>
        <p className={styles['loading-text']}>Loading UCP...</p>
      </div>
    );
  }

  const { hero, about, stats, video } = homeData;
  
  const videoUrl = video?.videoUrl || "";
  const videoType = getVideoType(videoUrl);

  return (
    <>
      <section className={styles.hero} id="home">
        {/* ... (Hero section remains exactly the same) ... */}
        <div className={styles['hero-bg-circles']}>
          <div className={`${styles.circle} ${styles.c1}`}></div>
          <div className={`${styles.circle} ${styles.c2}`}></div>
        </div>
        <div className={styles['hero-inner']}>
          <div className={styles['hero-content']}>
            <div className={styles['hero-badge']}>
              <div className={styles.dot}></div>
              {hero.badge || 'Admissions Open'}
            </div>
            <h1 className={styles['hero-title']}>
              {hero.title || 'Welcome to UCP'}
            </h1>
            <p className={styles['hero-desc']}>
              {hero.description || 'Constituent Colleges are educational institutions that are maintained and administrated by the university itself.'}
            </p>
            <div className={styles['hero-ctas']}>
              <Link to="/campus-info" className={styles['btn-primary']}>🎓 Explore Programs →</Link>
              <Link to="/contact" className={styles['btn-secondary']}>✏️ Apply Now</Link>
            </div>
            <div className={styles['hero-social-proof']}>
              <div className={styles['avatar-stack']}>
                <img src="/images/team/ali-imge.jpeg" alt="Student" onError={(e) => { e.target.style.background = '#CBD5E1'; }} />
                <img src="/images/team/arsal-image.jpeg" alt="Student" onError={(e) => { e.target.style.background = '#BAC8FF'; }} />
                <img src="/images/team/laraib.jpeg" alt="Student" onError={(e) => { e.target.style.background = '#FCA5A5'; }} />
                <div className={styles['avatar-count']}>{hero.studentsJoined || '900'}+</div>
              </div>
              <span className={styles['social-text']}>Joining a community of <strong>{hero.studentsJoined || '820'}+ students</strong></span>
              <div className={styles['divider-v']}></div>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={styles.star} style={{ opacity: i < (hero.rating || 4.9) ? 1 : 0.5 }}>★</span>
                ))}
                <span className={styles['rating-text']}><strong>{hero.rating || 4.9}</strong> / 5 from QS World Rankings</span>
              </div>
            </div>
          </div>
          <div className={styles['hero-image-wrap']}>
            <div className={styles['hero-img-card']}>
              <img
                src={hero.heroImage || "/images/team/campus-image.jfif"}
                alt="UCP Rawalpindi Campus Building"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles['about-section']} id="about">
        <div className={styles['about-inner']}>
          <div className={`${styles['about-img-wrap']} reveal-left`}>
            <img
              src={about.image || "/images/team/campus-front.jfif"}
              alt="UCP Campus"
            />
          </div>
          <div className={`${styles['about-content']} reveal-right`}>
            <div className={styles.eyebrow}>🏛 About UCP</div>
            <h2>{about.title || 'A legacy of excellence since 2002'}</h2>
            <p>{about.paragraphOne || 'First paragraph about UCP.'}</p>
            <p>{about.paragraphTwo || 'Second paragraph about UCP.'}</p>
            <Link to="/about" className={styles['learn-more']}>Learn more about UCP <span className={styles.arrow}>→</span></Link>
          </div>
        </div>
      </section>

      <section className={styles['stats-section']}>
        <div className={styles['stats-inner']}>
          <div className={`${styles['stat-item']} reveal`}>
            <div className={styles['stat-icon']}>👥</div>
            <div className={styles['stat-num']}><span className="count" data-target={stats.students || 1000}>{stats.students || 1000}</span><span className={styles.accent}>+</span></div>
            <div className={styles['stat-label']}>Total Students</div>
          </div>
          <div className={`${styles['stat-item']} reveal`} style={{ transitionDelay: '0.1s' }}>
            <div className={styles['stat-icon']}>📚</div>
            <div className={styles['stat-num']}><span className="count" data-target={stats.programs || 20}>{stats.programs || 20}</span><span className={styles.accent}>+</span></div>
            <div className={styles['stat-label']}>Programs Offered</div>
          </div>
          <div className={`${styles['stat-item']} reveal`} style={{ transitionDelay: '0.2s' }}>
            <div className={styles['stat-icon']}>🎓</div>
            <div className={styles['stat-num']}><span className="count" data-target={stats.faculty || 50}>{stats.faculty || 50}</span><span className={styles.accent}>+</span></div>
            <div className={styles['stat-label']}>Faculty Members</div>
          </div>
        </div>
      </section>

      <section className={styles['ad-section']}>
        <div className={styles['ad-inner']}>
          <div className={`${styles['ad-card']} reveal`}>
            
            {!videoUrl && (
              <div className={styles['upload-hint']}>
                <div className={styles['ad-icon']}>🎬</div>
                <h3>Welcome to UCP</h3>
                <p>Explore our campus life and promotional videos.</p>
              </div>
            )}

            {videoUrl && (
              <div className={`${styles['video-wrapper']} ${styles.show}`}>
                
                {/* Check if it is a Social Media Link OR a direct video */}
                {videoType !== 'direct' ? (
                  <iframe 
                    src={getEmbedUrl(videoUrl, videoType)} 
                    title="Promotional Video"
                    frameBorder="0" 
                    scrolling="no"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      minHeight: videoType === 'instagram' ? '550px' : '400px',
                      borderRadius: '12px',
                      border: 'none',
                      overflow: 'hidden'
                    }}
                  ></iframe>
                ) : (
                  <video controls playsInline autoPlay muted loop src={videoUrl} style={{ width: '100%', borderRadius: '12px' }}>
                    Your browser does not support the video tag.
                  </video>
                )}
                
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
}