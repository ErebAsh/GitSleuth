// Initialize Flatpickr and App logic when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. Mobile Navbar Toggle & Smooth Active State
    // ----------------------------------------------------
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Update active navbar link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset + 120;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinkItems.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // ----------------------------------------------------
    // 2. 3D Tubes Interactive Background Integration
    // ----------------------------------------------------
    const canvas = document.getElementById('tubes-canvas');
    const randomizeNeonBtn = document.getElementById('randomize-neon-btn');
    let tubesApp = null;

    // Palette generators for vibrant glowing neon combinations
    const neonPalettes = [
        {
            tubes: ["#38bdf8", "#a855f7", "#22c55e"],
            lights: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
        },
        {
            tubes: ["#f43f5e", "#fb923c", "#38bdf8"],
            lights: ["#f43f5e", "#06b6d4", "#a855f7", "#3b82f6"]
        },
        {
            tubes: ["#00f2fe", "#4facfe", "#000"],
            lights: ["#00f2fe", "#4facfe", "#ff0844", "#ffb199"]
        },
        {
            tubes: ["#f967fb", "#53bc28", "#6958d5"],
            lights: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"]
        }
    ];

    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    const randomColors = (count) => Array.from({ length: count }, () => randomHex());

    async function initTubes() {
        if (!canvas) return;

        try {
            // Dynamic import of threejs-components TubesCursor
            const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
            const TubesCursor = module.default;

            // Initialize with cyber/developer neon colors
            tubesApp = TubesCursor(canvas, {
                tubes: {
                    colors: neonPalettes[0].tubes,
                    lights: {
                        intensity: 220,
                        colors: neonPalettes[0].lights
                    }
                }
            });

            console.log("3D Interactive Tubes Background initialized.");
        } catch (error) {
            console.warn("3D Tubes WebGL could not load (falling back to ambient CSS glow):", error);
        }
    }

    function randomizeColors() {
        if (!tubesApp || !tubesApp.tubes) return;
        
        const tubesCols = randomColors(3);
        const lightsCols = randomColors(4);
        
        tubesApp.tubes.setColors(tubesCols);
        tubesApp.tubes.setLightsColors(lightsCols);

        // Flash sparkle button
        if (randomizeNeonBtn) {
            randomizeNeonBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                randomizeNeonBtn.style.transform = '';
            }, 150);
        }
    }

    // Trigger randomization via button
    if (randomizeNeonBtn) {
        randomizeNeonBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            randomizeColors();
        });
    }

    // Trigger randomization when clicking anywhere on background/hero
    document.addEventListener('click', (e) => {
        // Avoid intercepting inputs, buttons, links, or results cards
        if (!e.target.closest('input, select, button, a, form, .timeline-item, .glass-panel, .nav-links')) {
            randomizeColors();
        }
    });

    initTubes();

    // ----------------------------------------------------
    // 3. Search & Activity Tracker Logic (runs on tracker page)
    // ----------------------------------------------------
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        const usernameInput = document.getElementById('username');
        const typeFilter = document.getElementById('type-filter');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const tokenInput = document.getElementById('token');
        const searchBtn = document.getElementById('search-btn');
        const btnText = searchBtn.querySelector('span');
        const loader = searchBtn.querySelector('.loader');
        
        const resultsContainer = document.getElementById('results-container');
        const timeline = document.getElementById('timeline');
        const resultsTitle = document.getElementById('results-title');
        const resultsCount = document.getElementById('results-count');
        const errorMessage = document.getElementById('error-message');
        const loadMoreContainer = document.getElementById('load-more-container');
        const loadMoreBtn = document.getElementById('load-more-btn');
        const loadMoreText = loadMoreBtn.querySelector('span');
        const loadMoreLoader = loadMoreBtn.querySelector('.loader');

        // Initialize Flatpickr calendars if library loaded
        if (window.flatpickr) {
            flatpickr(startDateInput, {
                dateFormat: "Y-m-d",
                allowInput: true,
                placeholder: "Select start date..."
            });
            
            flatpickr(endDateInput, {
                dateFormat: "Y-m-d",
                allowInput: true,
                placeholder: "Select end date..."
            });
        }

        let currentPage = 1;
        let currentUsername = '';
        let currentType = '';
        let currentStartDate = '';
        let currentEndDate = '';
        let currentToken = '';
        let totalItemsFound = 0;
        let loadedItemsCount = 0;

        searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        currentUsername = usernameInput.value.trim();
        currentType = typeFilter.value;
        currentStartDate = startDateInput.value;
        currentEndDate = endDateInput.value;
        currentToken = tokenInput.value.trim();

        if (!currentUsername) return;

        // Reset UI & State
        currentPage = 1;
        loadedItemsCount = 0;
        setLoading(true, searchBtn, btnText, loader);
        hideError();
        resultsContainer.classList.add('hidden');
        loadMoreContainer.classList.add('hidden');
        timeline.innerHTML = '';

        try {
            const data = await fetchGitHubActivity(currentUsername, currentType, currentStartDate, currentEndDate, currentToken, currentPage);
            totalItemsFound = data.total_count;
            displayResults(data.items, currentUsername, false);
            
            // Smoothly scroll down to results if needed
            resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            showError(error.message);
        } finally {
            setLoading(false, searchBtn, btnText, loader);
        }
    });

    let isFetching = false;
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetching && !loadMoreContainer.classList.contains('hidden')) {
            loadMoreData();
        }
    }, { rootMargin: '200px' });

    observer.observe(loadMoreContainer);

    async function loadMoreData() {
        if (isFetching) return;
        isFetching = true;
        currentPage++;
        setLoading(true, loadMoreBtn, loadMoreText, loadMoreLoader);
        hideError();
        
        try {
            const data = await fetchGitHubActivity(currentUsername, currentType, currentStartDate, currentEndDate, currentToken, currentPage);
            displayResults(data.items, currentUsername, true);
        } catch (error) {
            showError(error.message);
            currentPage--; // revert page if failed
        } finally {
            setLoading(false, loadMoreBtn, loadMoreText, loadMoreLoader);
            isFetching = false;
        }
    }

    loadMoreBtn.addEventListener('click', () => {
        if (!isFetching) loadMoreData();
    });

    function setLoading(isLoading, btnObj, textObj, loaderObj) {
        btnObj.disabled = isLoading;
        if (isLoading) {
            textObj.classList.add('hidden');
            loaderObj.classList.remove('hidden');
        } else {
            textObj.classList.remove('hidden');
            loaderObj.classList.add('hidden');
        }
    }

    function showError(msg) {
        errorMessage.textContent = msg;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }

    async function fetchGitHubActivity(username, type, startDate, endDate, token, page) {
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
        
        const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=created&order=desc&per_page=100&page=${page}`;

        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };

        if (token) {
            headers['Authorization'] = `token ${token}`;
        }

        const response = await fetch(url, { headers });

        if (!response.ok) {
            if (response.status === 403) {
                const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
                if (rateLimitRemaining === '0') {
                    throw new Error('GitHub API rate limit exceeded. Provide a Personal Access Token in the optional field to get 5,000 requests/hr.');
                }
            }
            if (response.status === 422) {
                throw new Error('Validation failed. Make sure the username is formatted correctly.');
            }
            throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    function displayResults(items, username, isAppend) {
        if (!isAppend && (!items || items.length === 0)) {
            showError(`No GitHub activity found for user "@${username}" matching the current filters.`);
            return;
        }

        loadedItemsCount += items.length;

        resultsTitle.textContent = `Activity for @${username}`;
        resultsCount.textContent = `${totalItemsFound} total item${totalItemsFound !== 1 ? 's' : ''} (Showing ${loadedItemsCount})`;
        
        const fragment = document.createDocumentFragment();

        items.forEach(item => {
            const isPR = !!item.pull_request;
            const itemTypeStr = isPR ? 'Pull Request' : 'Issue';
            const cssClass = isPR ? 'type-pr' : 'type-issue';
            
            // Extract repo name from repository_url
            const repoUrlParts = item.repository_url.split('/');
            const repoName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

            const dateObj = new Date(item.created_at);
            const options = { 
                weekday: 'short', 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                timeZoneName: 'short'
            };
            const readableDate = dateObj.toLocaleString(undefined, options);
            const isoString = dateObj.toISOString();

            let displayState = item.state;
            if (isPR && item.state === 'closed' && item.pull_request && item.pull_request.merged_at) {
                displayState = 'merged';
            }
            const capitalizedState = displayState.charAt(0).toUpperCase() + displayState.slice(1);

            const card = document.createElement('div');
            card.className = `timeline-item ${cssClass}`;
            
            card.innerHTML = `
                <div class="item-header">
                    <a href="${item.html_url}" target="_blank" rel="noopener noreferrer" class="item-title">
                        ${escapeHTML(item.title)} <span style="opacity: 0.65; font-weight: normal;">#${item.number}</span>
                    </a>
                    <span class="item-type">${itemTypeStr}</span>
                </div>
                
                <div class="item-meta">
                    <span class="repo">
                        <svg aria-hidden="true" height="15" viewBox="0 0 16 16" width="15" fill="currentColor">
                            <path fill-rule="evenodd" d="M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 00-.25-.25h-3.5a.25.25 0 00-.25.25z"></path>
                        </svg>
                        <span class="repo-name">${escapeHTML(repoName)}</span>
                    </span>
                    <span class="state state-${displayState}">
                        State: <strong>${escapeHTML(capitalizedState)}</strong>
                    </span>
                </div>
                
                ${(() => {
                    if (item.labels && item.labels.length > 0) {
                        let html = '<div class="labels-container">';
                        item.labels.forEach(label => {
                            const bgColor = `#${label.color}`;
                            const r = parseInt(label.color.substring(0, 2), 16);
                            const g = parseInt(label.color.substring(2, 4), 16);
                            const b = parseInt(label.color.substring(4, 6), 16);
                            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                            const textColor = (yiq >= 128) ? '#000000' : '#ffffff';
                            
                            html += `<span class="issue-label" style="background-color: ${bgColor}; color: ${textColor};" title="${escapeHTML(label.description || '')}">${escapeHTML(label.name)}</span>`;
                        });
                        html += '</div>';
                        return html;
                    }
                    return '';
                })()}
                
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin-top: 0.25rem;">
                    <div class="exact-time" title="ISO: ${isoString}">
                        ⏱️ ${isPR ? 'Opened' : 'Created'}: <strong>${readableDate}</strong>
                    </div>
                    ${(() => {
                        if (item.state === 'closed' && item.closed_at) {
                            let actionVerb = 'Closed';
                            let icon = '🔴';
                            let closedAtStr = item.closed_at;
                            
                            if (isPR && item.pull_request && item.pull_request.merged_at) {
                                actionVerb = 'Merged';
                                icon = '🔀';
                                closedAtStr = item.pull_request.merged_at;
                            }
                            
                            const closedDateObj = new Date(closedAtStr);
                            const closedReadableDate = closedDateObj.toLocaleString(undefined, options);
                            return `
                            <div class="exact-time" title="ISO: ${closedDateObj.toISOString()}">
                                ${icon} ${actionVerb}: <strong>${closedReadableDate}</strong>
                            </div>
                            `;
                        }
                        return '';
                    })()}
                </div>
            `;
            
            fragment.appendChild(card);
        });

        timeline.appendChild(fragment);
        resultsContainer.classList.remove('hidden');

        // Show/hide load more button based on GitHub's hard 1000 search result limit
        if (loadedItemsCount < totalItemsFound && loadedItemsCount < 1000) {
            loadMoreContainer.classList.remove('hidden');
        } else {
            loadMoreContainer.classList.add('hidden');
            if (loadedItemsCount >= 1000) {
                const limitNote = document.createElement('div');
                limitNote.style.textAlign = 'center';
                limitNote.style.marginTop = '1.5rem';
                limitNote.style.color = 'var(--text-muted)';
                limitNote.style.fontSize = '0.9rem';
                limitNote.textContent = 'Note: GitHub Search API limits results to the most recent 1,000 items.';
                timeline.appendChild(limitNote);
            }
        }
    }

    // XSS sanitizer
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
    } // end if (searchForm)
});
