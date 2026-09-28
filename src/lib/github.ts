import { GitHubSearchResponse } from '@/types/github';

export interface FetchActivityParams {
  username: string;
  type?: 'all' | 'pr' | 'issue';
  startDate?: string;
  endDate?: string;
  token?: string;
  page?: number;
}

export async function fetchGitHubActivity({
  username,
  type = 'all',
  startDate,
  endDate,
  token,
  page = 1,
}: FetchActivityParams): Promise<GitHubSearchResponse> {
  let query = `author:${username}`;
  if (type === 'pr') {
    query += ' type:pr';
  } else if (type === 'issue') {
    query += ' type:issue';
  }

  if (startDate && endDate) {
    query += ` created:${startDate}..${endDate}`;
  } else if (startDate) {
    query += ` created:>=${startDate}`;
  } else if (endDate) {
    query += ` created:<=${endDate}`;
  }

  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(
    query
  )}&sort=created&order=desc&per_page=100&page=${page}`;

  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token && token.trim()) {
    const cleanToken = token.trim();
    const authHeader =
      cleanToken.startsWith('Bearer ') || cleanToken.startsWith('token ')
        ? cleanToken
        : `Bearer ${cleanToken}`;
    headers['Authorization'] = authHeader;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    let errorDetails = '';
    try {
      const errJson = await response.json();
      if (errJson?.message) {
        errorDetails = `: ${errJson.message}`;
      }
    } catch {
      // ignore json parse error
    }

    if (response.status === 401) {
      throw new Error(
        `GitHub API Error 401: Invalid or expired Personal Access Token (Bad credentials). Please verify your token, or leave the optional token field blank to search public activity.`
      );
    }

    if (response.status === 403) {
      const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
      if (rateLimitRemaining === '0') {
        throw new Error(
          'GitHub API rate limit exceeded. Provide a valid Personal Access Token in the optional field to get 5,000 requests/hr.'
        );
      }
    }

    if (response.status === 422) {
      throw new Error(
        `Validation failed. Make sure the username is formatted correctly${errorDetails}.`
      );
    }

    throw new Error(
      `GitHub API Error ${response.status}${errorDetails || ` ${response.statusText}`.trim()}`
    );
  }

  return response.json();
}
