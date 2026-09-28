'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="app-layout">
        {/* HERO / HOME SECTION */}
        <section id="home" className="hero-section">
          <div className="hero-badge">
            <span className="pulse-dot" />
            <span>Interactive 3D GitHub Telemetry &amp; Velocity Engine</span>
          </div>

          <h1 className="hero-headline">
            Inspect GitHub Activity With <br />
            <span className="gradient-text">Sub-Second Precision</span>
          </h1>

          <p className="hero-description">
            GitSleuth tracks exact timestamps, pull request lifecycles, and issue creation
            velocity directly from GitHub&apos;s REST API. No intermediate backend,
            completely private, and rendered over a high-performance interactive 3D WebGL
            background.
          </p>

          <div className="hero-cta-group">
            <Link href="/tracker" className="cta-primary-btn">
              <span>Launch Activity Tracker</span>
              <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
            <a href="#features" className="cta-secondary-btn">
              <span>Explore Features</span>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="hero-stats-grid">
            <div className="stat-card glass-panel">
              <span className="stat-number">100%</span>
              <span className="stat-label">Client-Side Direct</span>
            </div>
            <div className="stat-card glass-panel">
              <span className="stat-number">&lt; 1 sec</span>
              <span className="stat-label">Precision Timestamps</span>
            </div>
            <div className="stat-card glass-panel">
              <span className="stat-number">5,000</span>
              <span className="stat-label">Auth API Requests/hr</span>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="features-section">
          <div className="section-header">
            <span className="section-tag">Key Capabilities</span>
            <h2 className="section-title">
              Built For Developers, Reviewers &amp; Engineering Leads
            </h2>
            <p className="section-subtitle">
              Get transparent visibility into individual contributor rhythms and commit
              histories.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon pr-icon">
                <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M7.177 3.073L9.573.677A.25.25 0 0110 .854v4.792a.25.25 0 01-.427.177L7.177 3.427a.25.25 0 010-.354zM3.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122v5.256a2.251 2.251 0 11-1.5 0V5.372A2.25 2.25 0 011.5 3.25zM11 2.5h-1V4h1a1 1 0 011 1v5.628a2.251 2.251 0 101.5 0V5A2.5 2.5 0 0011 2.5zm1 10.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0zM3.75 12a.75.75 0 100 1.5.75.75 0 000-1.5z"
                  />
                </svg>
              </div>
              <h3>PR &amp; Issue Lifecycle Tracking</h3>
              <p>
                Detect exact submission, merge, and closing timestamps with local timezone
                conversion and full ISO 8601 transparency.
              </p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon filter-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
              </div>
              <h3>Granular Date Filtering</h3>
              <p>
                Target custom date intervals using integrated datepickers to audit sprint
                cycles, hackathons, or quarter milestones.
              </p>
            </div>

            <div className="feature-card glass-panel">
              <div className="feature-icon secure-icon">
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3>Zero-Storage Privacy</h3>
              <p>
                Your Personal Access Token stays in your browser memory and is transmitted
                only to GitHub&apos;s official HTTPS API endpoints.
              </p>
            </div>
          </div>
        </section>

        {/* TRACKER WORKSPACE LAUNCH SECTION */}
        <section id="tracker" className="tracker-section">
          <div className="launch-card glass-panel">
            <span className="section-tag" style={{ marginBottom: '0.85rem' }}>
              Interactive Search Workspace
            </span>
            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 800,
                marginBottom: '1rem',
                letterSpacing: '-0.025em',
              }}
            >
              Ready to Trace Contributor Telemetry?
            </h2>
            <p
              style={{
                color: 'var(--text-muted)',
                maxWidth: '640px',
                margin: '0 auto 2.5rem auto',
                fontSize: '1.1rem',
                lineHeight: 1.7,
              }}
            >
              Launch the dedicated full-screen GitSleuth tracker to inspect exact
              creation, merge, and closing timestamps for pull requests and issues across
              any public repository or organization.
            </p>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                flexWrap: 'wrap',
                marginBottom: '3rem',
              }}
            >
              <Link
                href="/tracker"
                className="cta-primary-btn"
                style={{ padding: '1.15rem 2.8rem', fontSize: '1.1rem' }}
              >
                <span>Launch GitSleuth Tracker</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <a
                href="https://github.com/ErebAsh/GitSleuth"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary-btn"
                style={{ padding: '1.15rem 2rem' }}
              >
                <span>View Source Code</span>
              </a>
            </div>

            {/* Interactive Features Pill List */}
            <div className="feature-pills-wrap">
              <span className="feature-pill">
                <span className="pill-check">✓</span> Live GitHub Search Index
              </span>
              <span className="feature-pill">
                <span className="pill-check">✓</span> Flatpickr Calendar Windows
              </span>
              <span className="feature-pill">
                <span className="pill-check">✓</span> In-Memory PAT Support (5k req/hr)
              </span>
              <span className="feature-pill">
                <span className="pill-check">✓</span> Infinite Scroll Timeline
              </span>
            </div>
          </div>
        </section>

        {/* PRIVACY & API TRANSPARENCY SECTION */}
        <section id="privacy" className="info-section">
          <div className="section-header">
            <span className="section-tag">Security &amp; Compliance</span>
            <h2 className="section-title">Privacy &amp; API Standards</h2>
          </div>
          <div className="info-cards-grid">
            <div className="info-box glass-panel">
              <div className="info-badge">REST API v3</div>
              <h4>Official API Protocol</h4>
              <p>
                GitSleuth queries <code>api.github.com/search/issues</code> using standard
                parameters. All calls conform to GitHub&apos;s REST v3 specifications with
                rate limit header monitoring.
              </p>
            </div>
            <div className="info-box glass-panel">
              <div className="info-badge">In-Memory Security</div>
              <h4>No Persistence or Analytics</h4>
              <p>
                No telemetry, tracking pixels, or third-party databases are used. Your
                GitHub token is held in volatile memory strictly for the active session.
              </p>
            </div>
            <div className="info-box glass-panel">
              <div className="info-badge">Open Ecosystem</div>
              <h4>MIT Open Source</h4>
              <p>
                GitSleuth is completely open source and community auditable. You can
                inspect every line of code, run it locally, or fork it freely.
              </p>
            </div>
          </div>
        </section>

        {/* SUPPORT SECTION */}
        <section id="support" className="support-section">
          <div className="support-card glass-panel">
            <div className="support-content">
              <span className="section-tag">Community &amp; Support</span>
              <h2>Need Help or Have a Feature Request?</h2>
              <p>
                We actively maintain GitSleuth and welcome contributions, bug reports, and
                integration ideas. You can open an issue on GitHub or reach out to the
                project maintainers directly.
              </p>
              <div className="support-actions">
                <a
                  href="https://github.com/ErebAsh/GitSleuth/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-primary-btn"
                >
                  <span>Open an Issue</span>
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                    <path d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    <path
                      fillRule="evenodd"
                      d="M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0z"
                    />
                  </svg>
                </a>
                <a
                  href="https://github.com/ErebAsh/GitSleuth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-secondary-btn"
                >
                  <span>Repository Readme</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
