'use client';

import React, { useState, useEffect, useRef } from 'react';
import flatpickr from 'flatpickr';
import { ActivityType } from '@/types/github';

export interface SearchParams {
  username: string;
  type: ActivityType;
  startDate: string;
  endDate: string;
  token: string;
}

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  isLoading: boolean;
}

const formatAutoDate = (inputVal: string, previousVal: string): string => {
  // If user is deleting characters
  if (inputVal.length < previousVal.length) {
    if (inputVal.endsWith('-')) {
      return inputVal.slice(0, -1);
    }
    return inputVal;
  }

  // Extract digits only, up to 8 digits (DDMMYYYY)
  const digits = inputVal.replace(/\D/g, '').slice(0, 8);
  if (!digits) return '';

  if (digits.length <= 2) {
    // 2-digit Day -> append '-'
    return digits.length === 2 ? `${digits}-` : digits;
  }
  if (digits.length <= 4) {
    // Day (2) + Month (1 or 2)
    const day = digits.slice(0, 2);
    const month = digits.slice(2);
    return month.length === 2 ? `${day}-${month}-` : `${day}-${month}`;
  }
  // Day (2) + Month (2) + Year (up to 4)
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${day}-${month}-${year}`;
};

const toIsoDate = (dmyStr: string): string => {
  const parts = dmyStr.trim().split('-');
  if (parts.length === 3 && parts[0].length === 2 && parts[2].length === 4) {
    // Convert DD-MM-YYYY to YYYY-MM-DD for GitHub REST API query
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dmyStr.trim();
};

export default function SearchForm({ onSearch, isLoading }: SearchFormProps) {
  const [username, setUsername] = useState('');
  const [typeFilter, setTypeFilter] = useState<'both' | 'pr' | 'issue'>('both');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [token, setToken] = useState('');

  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const endButtonRef = useRef<HTMLButtonElement>(null);

  const startPickerRef = useRef<flatpickr.Instance | null>(null);
  const endPickerRef = useRef<flatpickr.Instance | null>(null);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAutoDate(e.target.value, startDate);
    setStartDate(formatted);
    if (formatted.length === 10) {
      startPickerRef.current?.setDate(formatted, false, 'd-m-Y');
    } else if (!formatted) {
      startPickerRef.current?.clear(false);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAutoDate(e.target.value, endDate);
    setEndDate(formatted);
    if (formatted.length === 10) {
      endPickerRef.current?.setDate(formatted, false, 'd-m-Y');
    } else if (!formatted) {
      endPickerRef.current?.clear(false);
    }
  };

  useEffect(() => {
    if (startDateRef.current) {
      try {
        startPickerRef.current = flatpickr(startDateRef.current, {
          dateFormat: 'd-m-Y',
          allowInput: true,
          clickOpens: false, // Allows keyboard typing by default without popup
          disableMobile: true,
          positionElement: startButtonRef.current ?? undefined,
          position: 'auto right',
          monthSelectorType: 'static',
          onChange: (_, dateStr) => setStartDate(dateStr),
        });
      } catch {
        // Fallback
      }
    }

    if (endDateRef.current) {
      try {
        endPickerRef.current = flatpickr(endDateRef.current, {
          dateFormat: 'd-m-Y',
          allowInput: true,
          clickOpens: false, // Allows keyboard typing by default without popup
          disableMobile: true,
          positionElement: endButtonRef.current ?? undefined,
          position: 'auto right',
          monthSelectorType: 'static',
          onChange: (_, dateStr) => setEndDate(dateStr),
        });
      } catch {
        // Fallback
      }
    }

    return () => {
      startPickerRef.current?.destroy();
      endPickerRef.current?.destroy();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) return;

    onSearch({
      username: cleanUsername,
      type: typeFilter === 'both' ? 'all' : typeFilter,
      startDate: toIsoDate(startDate),
      endDate: toIsoDate(endDate),
      token: token.trim(),
    });
  };

  return (
    <div className="search-card glass-panel">
      <form id="search-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="username">
              GitHub Username <span className="required">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-icon">@</span>
              <input
                type="text"
                id="username"
                placeholder="e.g., torvalds, gaearon, antfu"
                required
                autoComplete="off"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="type-filter">Activity Filter</label>
            <select
              id="type-filter"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'both' | 'pr' | 'issue')}
            >
              <option value="both">Both (PRs &amp; Issues)</option>
              <option value="pr">Pull Requests Only</option>
              <option value="issue">Issues Only</option>
            </select>
          </div>
        </div>

        <div className="form-grid date-grid">
          <div className="input-group">
            <label htmlFor="start-date">Start Date (Optional)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={startDateRef}
                type="text"
                id="start-date"
                placeholder="DD-MM-YYYY"
                autoComplete="off"
                maxLength={10}
                value={startDate}
                onChange={handleStartDateChange}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                ref={startButtonRef}
                type="button"
                onClick={() => {
                  if (startPickerRef.current) {
                    if (startPickerRef.current.isOpen) {
                      startPickerRef.current.close();
                    } else {
                      startPickerRef.current.open(
                        undefined,
                        startButtonRef.current ?? undefined
                      );
                    }
                  }
                }}
                aria-label="Open Start Date Calendar"
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="end-date">End Date (Optional)</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                ref={endDateRef}
                type="text"
                id="end-date"
                placeholder="DD-MM-YYYY"
                autoComplete="off"
                maxLength={10}
                value={endDate}
                onChange={handleEndDateChange}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                ref={endButtonRef}
                type="button"
                onClick={() => {
                  if (endPickerRef.current) {
                    if (endPickerRef.current.isOpen) {
                      endPickerRef.current.close();
                    } else {
                      endPickerRef.current.open(
                        undefined,
                        endButtonRef.current ?? undefined
                      );
                    }
                  }
                }}
                aria-label="Open End Date Calendar"
                style={{
                  position: 'absolute',
                  right: '0.65rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  transition: 'color 0.2s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--accent)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="input-group token-group">
          <div className="label-with-hint">
            <label htmlFor="token">
              Personal Access Token <span className="optional-tag">Optional</span>
            </label>
            <span className="hint-badge">5,000 req/hr rate limit</span>
          </div>
          <input
            type="password"
            id="token"
            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (leaves zero trace)"
            autoComplete="new-password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <div className="token-helper-box">
            <span className="helper-icon">💡</span>
            <div className="helper-content">
              <span>
                Unauthenticated requests are limited to 60/hr. Supplying a token increases
                your limit to 5,000/hr. <strong>Tip:</strong> Provide a token with{' '}
                <code>repo</code> scope to query private repositories as well as public.
                Your token stays in-memory in your browser.
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          id="search-btn"
          className="primary-btn"
          disabled={isLoading}
        >
          <span className={isLoading ? 'hidden' : ''}>Search Contributor Activity</span>
          <div className={`loader ${isLoading ? '' : 'hidden'}`} />
        </button>
      </form>
    </div>
  );
}
