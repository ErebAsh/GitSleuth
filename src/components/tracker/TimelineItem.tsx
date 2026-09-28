'use client';

import React from 'react';
import { GitHubActivityItem } from '@/types/github';
import { formatTimestamp, extractRepoName, getLabelTextColor } from '@/lib/date-utils';

interface TimelineItemProps {
  item: GitHubActivityItem;
}

export default function TimelineItem({ item }: TimelineItemProps) {
  const isPR = Boolean(item.pull_request);
  const itemTypeStr = isPR ? 'Pull Request' : 'Issue';
  const cssClass = isPR ? 'type-pr' : 'type-issue';
  const repoName = extractRepoName(item.repository_url);

  const { readable: readableCreatedDate, iso: isoCreatedDate } = formatTimestamp(
    item.created_at
  );

  let displayState = item.state;
  if (isPR && item.state === 'closed' && item.pull_request?.merged_at) {
    displayState = 'merged';
  }
  const capitalizedState = displayState.charAt(0).toUpperCase() + displayState.slice(1);

  // Closed / Merged timestamp
  let closedTimeInfo: {
    icon: string;
    verb: string;
    readable: string;
    iso: string;
  } | null = null;

  if (item.state === 'closed' && item.closed_at) {
    let actionVerb = 'Closed';
    let icon = '🔴';
    let closedAtStr = item.closed_at;

    if (isPR && item.pull_request?.merged_at) {
      actionVerb = 'Merged';
      icon = '🔀';
      closedAtStr = item.pull_request.merged_at;
    }

    const { readable, iso } = formatTimestamp(closedAtStr);
    closedTimeInfo = {
      icon,
      verb: actionVerb,
      readable,
      iso,
    };
  }

  return (
    <div className={`timeline-item ${cssClass}`}>
      <div className="item-header">
        <a
          href={item.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="item-title"
        >
          {item.title}{' '}
          <span style={{ opacity: 0.65, fontWeight: 'normal' }}>#{item.number}</span>
        </a>
        <span className="item-type">{itemTypeStr}</span>
      </div>

      <div className="item-meta">
        <span className="repo">
          <svg
            aria-hidden="true"
            height="15"
            viewBox="0 0 16 16"
            width="15"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"
            />
          </svg>
          <span className="repo-name">{repoName}</span>
        </span>
        <span className={`state state-${displayState}`}>
          State: <strong>{capitalizedState}</strong>
        </span>
      </div>

      {item.labels && item.labels.length > 0 && (
        <div className="labels-container">
          {item.labels.map((label) => {
            const bgColor = `#${label.color}`;
            const textColor = getLabelTextColor(label.color);
            return (
              <span
                key={label.id || label.name}
                className="issue-label"
                style={{ backgroundColor: bgColor, color: textColor }}
                title={label.description || ''}
              >
                {label.name}
              </span>
            );
          })}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          alignItems: 'center',
          marginTop: '0.25rem',
        }}
      >
        <div className="exact-time" title={`ISO: ${isoCreatedDate}`}>
          ⏱️ {isPR ? 'Opened' : 'Created'}: <strong>{readableCreatedDate}</strong>
        </div>
        {closedTimeInfo && (
          <div className="exact-time" title={`ISO: ${closedTimeInfo.iso}`}>
            {closedTimeInfo.icon} {closedTimeInfo.verb}:{' '}
            <strong>{closedTimeInfo.readable}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
