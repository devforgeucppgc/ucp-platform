import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/societies', label: 'Societies' },
  { to: '/campus-info', label: 'Campus Info' },
  { to: '/notice-board', label: 'Notice Board' },
  { to: '/e-magazine', label: 'E-Magazine' },
  { to: '/projects', label: 'Projects' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar({ scrolled }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="nav-inner">
          <div className="nav-left">
            <NavLink to="/" className="logo-link">
              
              <img
                src="/images/team/logo-1.png"
                alt="UCP Logo"
                onError={(e) => {
                  // e.target.style.background = '#e8eaee';
                  e.target.style.width = '44px';
                  e.target.style.height = '44px';
                  e.target.style.borderRadius = '50%';
                }}
              />
            </NavLink>
            <div className="nav-divider" />
            <NavLink to="/" className="logo-link">
              
              <img
                src="/images/team/logo-2.jpeg"
                alt="Punjab College Logo"
                onError={(e) => {
                  e.target.style.background = '#2563EB';
                  e.target.style.width = '44px';
                  e.target.style.height = '44px';
                  e.target.style.borderRadius = '50%';
                }}
              />
            </NavLink>
          </div>

          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <a href="tel:0514421672" className="nav-phone">📞 (051) 4421672</a>

          <div
            className="hamburger"
            id="hamburger"
            aria-label="Toggle menu"
            ref={hamburgerRef}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => !o);
            }}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${open ? ' open' : ''}`} id="mobileMenu" ref={menuRef}>
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
        <a href="tel:0514421672" className="mobile-phone">📞 (051) 4421672</a>
      </div>
    </>
  );
}
