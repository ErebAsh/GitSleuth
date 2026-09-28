'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { updatePageSEO, updateUrlHash } from '@/lib/seo';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const lastActiveSectionRef = useRef<string>('home');

  const isTracker = pathname === '/tracker';

  const closeMenu = () => setMobileMenuOpen(false);

  const handleNavClick = (sectionId: string) => {
    closeMenu();
    lastActiveSectionRef.current = sectionId;
    setActiveSection(sectionId);
    updateUrlHash(sectionId);
    updatePageSEO(sectionId);
  };

  useEffect(() => {
    if (isTracker) return;

    const sectionIds = ['home', 'features', 'tracker', 'privacy', 'support'];
    let ticking = false;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const isNearBottom =
        window.innerHeight + scrollY >= document.documentElement.scrollHeight - 70;

      let current = 'home';

      if (isNearBottom) {
        current = 'support';
      } else if (scrollY < 120) {
        current = 'home';
      } else {
        const activationPoint = scrollY + 180;
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el) {
            const top = el.getBoundingClientRect().top + scrollY;
            const height = el.offsetHeight;
            if (activationPoint >= top && activationPoint < top + height) {
              current = id;
              break;
            }
          }
        }
      }

      if (current !== lastActiveSectionRef.current) {
        lastActiveSectionRef.current = current;
        setActiveSection(current);
        updateUrlHash(current);
        updatePageSEO(current);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', onScroll);
  }, [isTracker]);

  // Handle direct deep-linking on initial mount (e.g. /#features, /#privacy)
  useEffect(() => {
    if (isTracker) return;

    const hash = window.location.hash.replace('#', '');
    const sectionIds = ['home', 'features', 'tracker', 'privacy', 'support'];

    if (hash && sectionIds.includes(hash)) {
      lastActiveSectionRef.current = hash;
      setActiveSection(hash);
      updatePageSEO(hash);

      const targetEl = document.getElementById(hash);
      if (targetEl) {
        setTimeout(() => {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      }
    }
  }, [isTracker]);

  // Handle browser Back / Forward buttons (hashchange event)
  useEffect(() => {
    if (isTracker) return;

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      const sectionIds = ['home', 'features', 'tracker', 'privacy', 'support'];
      if (sectionIds.includes(hash)) {
        lastActiveSectionRef.current = hash;
        setActiveSection(hash);
        updatePageSEO(hash);
        const targetEl = document.getElementById(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
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
              onClick={() => handleNavClick('home')}
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
              onClick={() => handleNavClick('features')}
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
              onClick={() => handleNavClick('tracker')}
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
              onClick={() => handleNavClick('privacy')}
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
              onClick={() => handleNavClick('support')}
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
