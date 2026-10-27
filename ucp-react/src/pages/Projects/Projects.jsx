
import { useState, useEffect } from 'react';
import { projectsService } from '../../admin/services';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsService.getAllProjects();
        
        // Handle various API response structures:
        // Case 1: response.data is the array
        // Case 2: response.data is an object containing the array: { data: [...] } or { projects: [...] }
        const data = response?.data;
        const projectsArray = Array.isArray(data) 
          ? data 
          : data?.projects || data?.data || [];
          
        setProjects(projectsArray);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        setError('Failed to load projects');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles['hero-inner']}>
            <div className={styles.eyebrow}>
              <span className={styles.icon}>🚀</span> Showcase
            </div>
            <h1 className={styles['hero-title']}>
              Final Year <span className={styles.highlight}>Projects</span>
            </h1>
            <p className={styles['hero-desc']}>
              Loading projects...
            </p>
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={styles['hero-inner']}>
            <h1 className={styles['hero-title']}>Error</h1>
            <p className={styles['hero-desc']}>{error}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles['hero-inner']}>
          <div className={styles.eyebrow}>
            <span className={styles.icon}>🚀</span> Showcase
          </div>
          <h1 className={styles['hero-title']}>
            Final Year <span className={styles.highlight}>Projects</span>
          </h1>
          <p className={styles['hero-desc']}>
            Discover the groundbreaking work of our final-year students across AI, robotics, blockchain, and more.
          </p>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles['grid-inner']}>
          <div className={styles['cards-grid']}>
            {Array.isArray(projects) && projects.length > 0 ? (
              projects.map((project, index) => (
                <div key={project._id || index} className={styles.card}>
                  <div className={styles['card-image-wrap']}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className={styles['card-image']}
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                        e.target.parentElement.style.background = '#e2e8f0';
                        e.target.parentElement.innerHTML = `<span style="color:#94a3b8;font-size:14px;">No image</span>`;
                      }}
                    />
                  </div>
                  <div className={styles['card-body']}>
                    <h3 className={styles['card-title']}>{project.title}</h3>
                    <p className={styles['card-desc']}>{project.description}</p>
                    <div className={styles['card-tech']}>
                      {Array.isArray(project.technologies) ? (
                        project.technologies.map(tech => (
                          <span key={tech} className={styles['tech-pill']}>{tech}</span>
                        ))
                      ) : (
                        <span className={styles['tech-pill']}>Tech stack not specified</span>
                      )}
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles['card-link']}
                    >
                      View Project →
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 1rem' }}>
                <p>No projects available.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
 