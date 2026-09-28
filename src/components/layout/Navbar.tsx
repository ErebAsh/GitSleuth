'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const isTracker = pathname === '/tracker';

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (isTracker) return;

    const handleScroll = () => {
      const scrollY = window.pageYOffset + 120;
      const sectionIds = ['home', 'features', 'tracker', 'privacy', 'support'];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isTracker]);

  return (
    <nav className="navbar glass-nav">
      <div className="nav-container">
        <Link href="/" className="nav-brand" onClick={closeMenu}>
          <span className="brand-name">GitSleuth</span>
          <span className="brand-badge">GitHub API</span>
        </Link>

        <div className={`nav-links ${mobileMenuOpen ? 'active' : ''}`} id="nav-links">
          {isTracker ? (
            <Link href="/#home" className="nav-link" onClick={closeMenu}>
              Home
            </Link>
          ) : (
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Home
            </a>
          )}

          {isTracker ? (
            <Link href="/#features" className="nav-link" onClick={closeMenu}>
              Features
            </Link>
          ) : (
            <a
              href="#features"
              className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Features
            </a>
          )}

          {isTracker ? (
            <Link href="/#tracker" className="nav-link" onClick={closeMenu}>
              Tracker
            </Link>
          ) : (
            <a
              href="#tracker"
              className={`nav-link ${activeSection === 'tracker' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Tracker
            </a>
          )}

          {isTracker ? (
            <Link href="/#privacy" className="nav-link" onClick={closeMenu}>
              Privacy &amp; API
            </Link>
          ) : (
            <a
              href="#privacy"
              className={`nav-link ${activeSection === 'privacy' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Privacy &amp; API
            </a>
          )}

          {isTracker ? (
            <Link href="/#support" className="nav-link" onClick={closeMenu}>
              Support
            </Link>
          ) : (
            <a
              href="#support"
              className={`nav-link ${activeSection === 'support' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              Support
            </a>
          )}

          {!isTracker && (
            <div className="mobile-drawer-cta">
              <Link
                href="/tracker"
                className="cta-primary-btn"
                onClick={closeMenu}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  padding: '0.85rem 1.25rem',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                }}
              >
                <span>Launch Tracker ↗</span>
              </Link>
            </div>
          )}
        </div>

        <div className="nav-actions">
          {isTracker ? (
            <>
              <div
                className="api-status-badge"
                title="Official GitHub REST API v3 Direct Connection"
              >
                <span className="status-pulse" />
                <span>GitHub API v3</span>
              </div>
              <Link href="/" className="github-btn" title="Return to Home Overview">
                <span>← Back to Home</span>
              </Link>
            </>
          ) : (
            <Link
              href="/tracker"
              className="cta-primary-btn desktop-only-cta"
              style={{
                padding: '0.45rem 1.1rem',
                fontSize: '0.85rem',
                borderRadius: '20px',
              }}
            >
              <span>Launch Tracker ↗</span>
            </Link>
          )}

          <button
            className="nav-toggle"
            id="nav-toggle"
            aria-label="Toggle navigation"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
