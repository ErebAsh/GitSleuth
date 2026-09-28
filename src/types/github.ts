export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
  description?: string | null;
}

export interface GitHubPullRequestInfo {
  url: string;
  html_url: string;
  diff_url?: string;
  patch_url?: string;
  merged_at?: string | null;
}

export interface GitHubActivityItem {
  id: number;
  number: number;
  title: string;
  state: 'open' | 'closed' | string;
  html_url: string;
  repository_url: string;
  created_at: string;
  closed_at?: string | null;
  pull_request?: GitHubPullRequestInfo;
  labels?: GitHubLabel[];
}

export interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubActivityItem[];
}

export type ActivityType = 'all' | 'pr' | 'issue';
