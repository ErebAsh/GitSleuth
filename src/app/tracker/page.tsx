'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SearchForm, { SearchParams } from '@/components/tracker/SearchForm';
import TimelineItem from '@/components/tracker/TimelineItem';
import { fetchGitHubActivity } from '@/lib/github';
import { GitHubActivityItem } from '@/types/github';

export default function TrackerPage() {
  const [items, setItems] = useState<GitHubActivityItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentParams, setCurrentParams] = useState<SearchParams | null>(null);
  const [page, setPage] = useState<number>(1);

  const resultsRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Search Workspace — GitHub Contributor Activity | GitSleuth';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Search any GitHub username to inspect exact creation, merge, and closing timestamps with millisecond precision directly from official GitHub REST v3 API.'
      );
    }
  }, []);

  const handleSearch = async (params: SearchParams) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    setCurrentParams(params);
    setPage(1);

    document.title = `Activity for @${params.username} — GitSleuth`;

    try {
      const data = await fetchGitHubActivity({
        username: params.username,
        type: params.type,
        startDate: params.startDate,
        endDate: params.endDate,
        token: params.token,
        page: 1,
      });

      if (!data.items || data.items.length === 0) {
        setItems([]);
        setTotalCount(0);
        setError(
          `No GitHub activity found for user "@${params.username}" matching the current filters.`
        );
      } else {
        setItems(data.items);
        setTotalCount(data.total_count);
        // Scroll smoothly to results
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while querying GitHub.';
      setError(message);
      setItems([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = useCallback(async () => {
    if (!currentParams || isLoadingMore || isLoading) return;

    const nextPage = page + 1;
    setIsLoadingMore(true);

    try {
      const data = await fetchGitHubActivity({
        username: currentParams.username,
        type: currentParams.type,
        startDate: currentParams.startDate,
        endDate: currentParams.endDate,
        token: currentParams.token,
        page: nextPage,
      });

      if (data.items && data.items.length > 0) {
        setItems((prev) => [...prev, ...data.items]);
        setPage(nextPage);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to load older activity.';
      setError(message);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentParams, isLoadingMore, isLoading, page]);

  const hasMore = items.length < totalCount && items.length < 1000;

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoadingMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    const currentElem = loadMoreRef.current;
    if (currentElem) observer.observe(currentElem);

    return () => {
      if (currentElem) observer.unobserve(currentElem);
    };
  }, [hasMore, isLoadingMore, isLoading, handleLoadMore]);

  return (
    <>
      <Navbar />

      <main className="app-layout">
        <section className="tracker-section" style={{ paddingTop: '2rem' }}>
          <div className="section-header">
            <span className="section-tag">Dedicated Workspace</span>
            <h1 className="section-title">Query Contributor Telemetry</h1>
            <p className="section-subtitle">
              Search any GitHub username to inspect exact creation, merge, and closing
              timestamps with millisecond precision.
            </p>
          </div>

          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {error && (
            <div id="error-message" className="error-message">
              {error}
            </div>
          )}

          <div
            ref={resultsRef}
            className={`results-container ${hasSearched && items.length > 0 ? '' : 'hidden'}`}
            id="results-container"
          >
            <div className="results-header">
              <h2 id="results-title">Activity for @{currentParams?.username}</h2>
              <span id="results-count" className="badge">
                {totalCount} total item{totalCount !== 1 ? 's' : ''} (Showing{' '}
                {items.length})
              </span>
            </div>

            <div className="timeline" id="timeline">
              {items.map((item) => (
                <TimelineItem key={`${item.id}-${item.number}`} item={item} />
              ))}

              {items.length >= 1000 && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                  }}
                >
                  Note: GitHub Search API limits results to the most recent 1,000 items.
                </div>
              )}
            </div>

            {hasMore && (
              <div
                ref={loadMoreRef}
                className="load-more-container"
                id="load-more-container"
              >
                <button
                  id="load-more-btn"
                  className="primary-btn load-more-btn"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                >
                  <span className={isLoadingMore ? 'hidden' : ''}>
                    Load Older Activity
                  </span>
                  <div className={`loader ${isLoadingMore ? '' : 'hidden'}`} />
                </button>
              </div>
            )}
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
