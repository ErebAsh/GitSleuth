/**
 * SEO & Dynamic Section Metadata Configuration
 * Manages dynamic document title, meta tags, and URL hash synchronization
 * during user scroll and deep-linking navigation.
 */

export interface SectionSEO {
  id: string;
  hash: string;
  title: string;
  description: string;
}

export const SECTION_SEO: Record<string, SectionSEO> = {
  home: {
    id: 'home',
    hash: '',
    title: 'GitSleuth — Precision GitHub Activity Timing & Developer Analytics',
    description:
      "GitSleuth tracks exact timestamps, pull request lifecycles, and issue creation velocity directly from GitHub's REST API. No intermediate backend, completely private, and rendered over a high-performance interactive 3D WebGL background.",
  },
  features: {
    id: 'features',
    hash: '#features',
    title: 'Features & Capabilities — Precision GitHub Telemetry | GitSleuth',
    description:
      'Explore GitSleuth capabilities: PR & issue lifecycle tracking, granular date intervals with Flatpickr, and zero-storage in-memory PAT privacy.',
  },
  tracker: {
    id: 'tracker',
    hash: '#tracker',
    title: 'Search Workspace — GitHub Contributor Activity | GitSleuth',
    description:
      'Launch the dedicated interactive GitSleuth workspace to inspect contributor activity, pull requests, and issue velocities with sub-second precision.',
  },
  privacy: {
    id: 'privacy',
    hash: '#privacy',
    title: 'Privacy & Direct REST API Standards — Security & Compliance | GitSleuth',
    description:
      'Learn about GitSleuth zero-storage architecture. Direct official GitHub REST API v3 queries, token in volatile memory, MIT open source.',
  },
  support: {
    id: 'support',
    hash: '#support',
    title: 'Developer Support & Community — Open Source Collaboration | GitSleuth',
    description:
      'Need help or have a feature request? Open an issue on GitHub, explore the repository documentation, and join the GitSleuth developer community.',
  },
};

/**
 * Updates document title, meta description, and OpenGraph/Twitter tags dynamically.
 */
export function updatePageSEO(sectionId: string): void {
  if (typeof window === 'undefined') return;

  const seo = SECTION_SEO[sectionId];
  if (!seo) return;

  // 1. Update Document Title
  if (document.title !== seo.title) {
    document.title = seo.title;
  }

  // 2. Update Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', seo.description);

  // Helper for meta tags with property attribute
  const updateMetaProperty = (property: string, content: string) => {
    let tag = document.querySelector(`meta[property="${property}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('property', property);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // Helper for meta tags with name attribute
  const updateMetaName = (name: string, content: string) => {
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute('name', name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  // 3. Update OpenGraph Tags
  updateMetaProperty('og:title', seo.title);
  updateMetaProperty('og:description', seo.description);
  updateMetaProperty('og:url', window.location.href);

  // 4. Update Twitter Tags
  updateMetaName('twitter:title', seo.title);
  updateMetaName('twitter:description', seo.description);
}

/**
 * Updates URL address bar hash silently without creating cluttered history stack.
 */
export function updateUrlHash(sectionId: string): void {
  if (typeof window === 'undefined') return;

  const targetHash = sectionId === 'home' ? '' : `#${sectionId}`;
  const currentHash = window.location.hash;

  if (currentHash !== targetHash) {
    const newUrl = targetHash
      ? `${window.location.pathname}${window.location.search}${targetHash}`
      : `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(null, '', newUrl);
  }
}
