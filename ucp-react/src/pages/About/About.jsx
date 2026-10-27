


import { useState, useEffect } from 'react';
import { aboutService } from '../../admin/services';
import './about.css';

export default function About() {
  const [aboutData, setAboutData] = useState({
    hero: {},
    introduction: {},
    statistics: [],
    timeline: [],
    leaders: [],
    values: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await aboutService.getAbout();
        setAboutData(response.data || {});
      } catch (error) {
        console.error("Failed to fetch about page data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  
  const { 
    hero = {}, 
    introduction = {}, 
    statistics = [], 
    timeline = [], 
    leaders = [], 
    values = [] 
  } = aboutData;

  return (
    <>
      <section className="about-hero">
        <div className="about-hero-inner">
          <div className="about-eyebrow">
            <span>{hero?.badge || 'explore'}</span>
          </div>
          <h1 className="about-hero-title">
            {hero?.title || 'Crafting Digital Excellence Since 2002'}
          </h1>
          <p className="about-hero-desc">
            {hero?.description || "We're a team of passionate innovators dedicated to building solutions that empower businesses and transform industries."}
          </p>
        </div>
      </section>

      <section className="about-intro">
        <div className="about-intro-text">
          <h2>
            {introduction?.title || 'A legacy of excellence and innovation'}
          </h2>
          <p>
            {introduction?.paragraphOne || 'For over two decades, we have been at the forefront of digital transformation.'}
          </p>
          <p>
            {introduction?.paragraphTwo || 'Today, we work with over 2,500 teams across 50+ cities, delivering solutions that make a real difference.'}
          </p>

          <div className="about-stats-row">
            {(statistics || []).map(stat => (
              <div key={stat._id} className="about-stat">
                <span className="stat-num">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about-intro-photo">
          <img
            src={introduction?.image || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"}
            alt="Our team collaborating"
          />
        </div>
      </section>

      <section className="about-journey">
        <div className="about-section">
          <div className="about-section-label">
            <div className="about-eyebrow">Our Journey</div>
            <h2>Salient <span className="highlight">Features</span></h2>
          </div>

          <div className="about-timeline">
            {(timeline || []).map((item, index) => (
              <div key={item._id} className={`tl-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                {index % 2 === 0 ? (
                  <>
                    <div className="tl-card">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                    <div className="tl-center">
                      <span className="tl-year">{item.year}</span>
                    </div>
                    <div className="tl-empty"></div>
                  </>
                ) : (
                  <>
                    <div className="tl-empty"></div>
                    <div className="tl-center">
                      <span className="tl-year">{item.year}</span>
                    </div>
                    <div className="tl-card">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-leadership">
        <div className="about-section-label">
          <div className="about-eyebrow">Leadership</div>
          <h2>Meet the <span className="highlight">visionaries</span></h2>
        </div>

        <div className="leaders-grid">
          {(leaders || []).map(leader => (
            <div key={leader._id} className="leader-card">
              <img
                src={leader.image || "/images/leaders/default.png"}
                alt={leader.name}
                className="leader-banner"
              />
              <div className="leader-info">
                <div className="leader-role">{leader.role}</div>
                <div className="leader-name">{leader.name}</div>
                <div className="leader-org">Since {leader.joiningYear}</div>
              </div>
              <div className="leader-body">
                <div className="leader-quote">
                  "{leader.quote}"
                </div>
                <p className="leader-bio">
                  {leader.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-values">
        <h2>Our <span className="highlight">Core Values</span></h2>
        <p className="values-subtitle">
          The principles that guide everything we do
        </p>

        <div className="values-grid">
          {(values || []).map(value => (
            <div key={value._id} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <span className="value-icon">{value.frontIcon}</span>
                  <h3>{value.title}</h3>
                  <p>{value.shortDescription}</p>
                </div>
                <div className="flip-card-back">
                  <span className="back-icon">{value.backIcon}</span>
                  <h3>{value.title}</h3>
                  <p>{value.detailedDescription}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}