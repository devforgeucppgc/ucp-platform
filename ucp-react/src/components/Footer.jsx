import { Link } from 'react-router-dom';
import { NAV_LINKS } from './Navbar';
import './Footer.css';

export default function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
         
          <div className="footer-logos">
            <img
              src="/images/team/logo-1.png"
              alt="UCP Logo"
              onError={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            />
            <div className="footer-logo-divider" />
            <img
              src="/images/team/logo-2.jpeg"
              alt="Punjab College Logo"
              onError={(e) => { e.target.style.background = 'rgba(255,255,255,0.1)'; }}
            />
          </div>
          <div className="brand-name">Punjab College</div>
          <div className="brand-sub">UCP Campus Rawalpindi</div>
          <p>
            A premier institution shaping bright minds for tomorrow's challenges through
            world-class education, research, and a vibrant campus community.
          </p>
          <div className="social-links">
            <a href="https://www.facebook.com/PunjabCollegeUCPCampus" className="social-link" title="Facebook">f</a>
            <a href="#" className="social-link" title="Instagram">📷</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul className="footer-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Information</h4>
          <ul className="contact-list">
            <li><span className="icon">📍</span> UCP Rawalpindi, 6th Road, 46000</li>
            <li><span className="icon">📞</span> (051) 4421672</li>
            <li><span className="icon">✉️</span> Principal.rawalpindi@ucp.edu.pk</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Stay Connected</h4>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '16px' }}>
            Get the latest announcements, scholarship news, and campus stories right in your inbox.
          </p>
          <div className="newsletter-form">
            <input type="email" placeholder="Your email" />
            <button type="button">Subscribe</button>
          </div>
          <div className="footer-sub">No spam, unsubscribe anytime.</div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Punjab College UCP Campus Rawalpindi. All Rights Reserved.</span>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Use</a>
          <a href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}