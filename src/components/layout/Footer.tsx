'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isTracker = pathname === '/tracker';

  if (isTracker) {
    return (
      <footer className="workspace-footer">
        <div className="workspace-footer-content">
          <div className="ws-left">
            <span className="ws-brand-title">GitSleuth</span>
            <span className="ws-divider">•</span>
            <span className="ws-desc">
              Client-side precision developer timing telemetry
            </span>
          </div>
          <div className="ws-right">
            <Link href="/" className="ws-link">
              ← Home Overview
            </Link>
            <span className="ws-divider">•</span>
            <a
              href="https://github.com/ErebAsh/GitSleuth"
              target="_blank"
              rel="noopener noreferrer"
              className="ws-link"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="brand-name">GitSleuth</span>
          <p>Interactive timing telemetry for GitHub developers &amp; teams.</p>
        </div>
        <div className="footer-links">
          <a href="#home">Home</a>
          <Link href="/tracker">Tracker</Link>
          <a href="#features">Features</a>
          <a href="#privacy">Privacy</a>
          <a
            href="https://github.com/ErebAsh/GitSleuth"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 GitSleuth. Built with GitHub REST API &amp; WebGL 3D Interactive
          Neon Tubes.
        </p>
      </div>
    </footer>
  );
}
