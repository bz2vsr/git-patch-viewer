/**
 * Theme Manager
 * Handles theme switching, dark/light mode toggle, and localStorage persistence
 */

const ThemeManager = (() => {
  // Available themes from tweakcn.com
  const THEMES = [
    { id: 'cosmic-night', name: 'Cosmic Night', color: '#a48fff', category: 'Popular' },
    { id: 'catppuccin', name: 'Catppuccin', color: '#cba6f7', category: 'Popular' },
    { id: 'bubblegum', name: 'Bubblegum', color: '#ff6bdc', category: 'Popular' },
    { id: 'pastel-dreams', name: 'Pastel Dreams', color: '#b4a0ff', category: 'Popular' },
    { id: 'cyberpunk', name: 'Cyberpunk', color: '#ff0080', category: 'Vibrant' },
    { id: 'quantum-rose', name: 'Quantum Rose', color: '#ff4da6', category: 'Vibrant' },
    { id: 'neon-nights', name: 'Neon Nights', color: '#00ffff', category: 'Vibrant' },
    { id: 'nord', name: 'Nord', color: '#88c0d0', category: 'Cool' },
    { id: 'dracula', name: 'Dracula', color: '#bd93f9', category: 'Popular' },
    { id: 'tokyo-night', name: 'Tokyo Night', color: '#7aa2f7', category: 'Cool' },
    { id: 'gruvbox', name: 'Gruvbox', color: '#fe8019', category: 'Warm' },
    { id: 'monokai', name: 'Monokai', color: '#f92672', category: 'Popular' },
    { id: 'solarized', name: 'Solarized', color: '#268bd2', category: 'Classic' },
    { id: 'slate', name: 'Slate', color: '#38bdf8', category: 'Neutral' },
    { id: 'zinc', name: 'Zinc', color: '#a1a1aa', category: 'Neutral' },
    { id: 'rose', name: 'Rose Pine', color: '#ebbcba', category: 'Warm' },
    { id: 'amethyst-haze', name: 'Amethyst Haze', color: '#9966ff', category: 'Cool' },
    { id: 'midnight', name: 'Midnight', color: '#6080d0', category: 'Dark' },
    { id: 'ocean', name: 'Ocean', color: '#4da6ff', category: 'Cool' },
    { id: 'forest', name: 'Forest', color: '#4da66f', category: 'Natural' },
    { id: 'sunset', name: 'Sunset', color: '#ff7043', category: 'Warm' },
    { id: 'cherry-blossom', name: 'Cherry Blossom', color: '#ff99cc', category: 'Soft' },
  ];

  const DEFAULT_THEME = 'cosmic-night';
  const DEFAULT_MODE = 'dark';
  const STORAGE_KEYS = {
    THEME: 'git-patch-viewer-theme',
    MODE: 'git-patch-viewer-mode',
  };

  let currentTheme = DEFAULT_THEME;
  let currentMode = DEFAULT_MODE;

  /**
   * Initialize theme manager
   */
  function init() {
    // Load saved preferences
    loadPreferences();
    
    // Apply theme and mode
    applyTheme();
    
    // Populate theme list
    populateThemeList();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('✨ ThemeManager initialized');
  }

  /**
   * Load theme and mode preferences from localStorage
   */
  function loadPreferences() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const savedMode = localStorage.getItem(STORAGE_KEYS.MODE);
    
    if (savedTheme && THEMES.find(t => t.id === savedTheme)) {
      currentTheme = savedTheme;
    }
    
    if (savedMode && (savedMode === 'dark' || savedMode === 'light')) {
      currentMode = savedMode;
    }
  }

  /**
   * Save preferences to localStorage
   */
  function savePreferences() {
    localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
    localStorage.setItem(STORAGE_KEYS.MODE, currentMode);
  }

  /**
   * Apply current theme and mode to HTML element
   */
  function applyTheme() {
    const html = document.documentElement;
    
    // Remove all theme and mode classes
    html.className = '';
    
    // Add current theme and mode classes
    html.classList.add(`theme-${currentTheme}`);
    html.classList.add(currentMode);
    
    // Update UI
    updateThemeButton();
    updateModeButton();
  }

  /**
   * Update theme button display
   */
  function updateThemeButton() {
    const themeBtn = document.getElementById('theme-button');
    if (!themeBtn) return;
    
    const theme = THEMES.find(t => t.id === currentTheme) || THEMES[0];
    const preview = themeBtn.querySelector('.theme-preview');
    const name = themeBtn.querySelector('.theme-name');
    
    if (preview) preview.style.background = theme.color;
    if (name) name.textContent = theme.name;
  }

  /**
   * Update mode toggle button
   */
  function updateModeButton() {
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = document.getElementById('mode-icon');
    if (!modeIcon) return;
    
    if (currentMode === 'dark') {
      // Show moon icon
      modeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
      modeToggle.title = 'Switch to light mode';
    } else {
      // Show sun icon
      modeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
      modeToggle.title = 'Switch to dark mode';
    }
  }

  /**
   * Populate theme dropdown list
   */
  function populateThemeList() {
    const themeList = document.getElementById('theme-list');
    if (!themeList) return;
    
    // Group themes by category
    const categories = {};
    THEMES.forEach(theme => {
      if (!categories[theme.category]) {
        categories[theme.category] = [];
      }
      categories[theme.category].push(theme);
    });
    
    // Build HTML
    let html = '';
    for (const [category, themes] of Object.entries(categories)) {
      html += `<div class="theme-category" data-category="${category}">`;
      themes.forEach(theme => {
        const isActive = theme.id === currentTheme ? 'active' : '';
        html += `
          <div class="theme-item ${isActive}" data-theme="${theme.id}">
            <div class="theme-item-color" style="background-color: ${theme.color}"></div>
            <span class="theme-item-name">${theme.name}</span>
          </div>
        `;
      });
      html += `</div>`;
    }
    
    themeList.innerHTML = html;
    
    // Add click handlers
    themeList.querySelectorAll('.theme-item').forEach(item => {
      item.addEventListener('click', () => {
        const themeId = item.dataset.theme;
        setTheme(themeId);
        closeThemeDropdown();
      });
    });
  }

  /**
   * Set theme
   */
  function setTheme(themeId) {
    if (!THEMES.find(t => t.id === themeId)) return;
    
    currentTheme = themeId;
    savePreferences();
    applyTheme();
    
    // Update active state in dropdown
    document.querySelectorAll('.theme-item').forEach(item => {
      item.classList.toggle('active', item.dataset.theme === themeId);
    });
  }

  /**
   * Toggle dark/light mode
   */
  function toggleMode() {
    currentMode = currentMode === 'dark' ? 'light' : 'dark';
    savePreferences();
    applyTheme();
    
    // Re-render diff with new color scheme if patch is loaded
    if (typeof Viewer !== 'undefined' && Viewer.reRenderDiff) {
      Viewer.reRenderDiff();
    }
  }

  /**
   * Open theme dropdown
   */
  function openThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    if (!dropdown) return;
    
    dropdown.classList.remove('hidden');
    document.getElementById('theme-search')?.focus();
  }

  /**
   * Close theme dropdown
   */
  function closeThemeDropdown() {
    const dropdown = document.getElementById('theme-dropdown');
    if (!dropdown) return;
    
    dropdown.classList.add('hidden');
    document.getElementById('theme-search').value = '';
    // Reset search filter
    document.querySelectorAll('.theme-item').forEach(item => {
      item.style.display = '';
    });
  }

  /**
   * Filter themes by search query
   */
  function filterThemes(query) {
    const lowerQuery = query.toLowerCase();
    const items = document.querySelectorAll('.theme-item');
    
    items.forEach(item => {
      const name = item.querySelector('.theme-item-name').textContent.toLowerCase();
      const matches = name.includes(lowerQuery);
      item.style.display = matches ? '' : 'none';
    });
  }

  /**
   * Set up event listeners
   */
  function setupEventListeners() {
    // Theme button click
    const themeBtn = document.getElementById('theme-button');
    if (themeBtn) {
      themeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = document.getElementById('theme-dropdown');
        if (dropdown.classList.contains('hidden')) {
          openThemeDropdown();
        } else {
          closeThemeDropdown();
        }
      });
    }
    
    // Mode toggle click
    const modeToggle = document.getElementById('mode-toggle');
    if (modeToggle) {
      modeToggle.addEventListener('click', toggleMode);
    }
    
    // Theme search
    const themeSearch = document.getElementById('theme-search');
    if (themeSearch) {
      themeSearch.addEventListener('input', (e) => {
        filterThemes(e.target.value);
      });
      
      themeSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeThemeDropdown();
        }
      });
    }
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('theme-dropdown');
      const themeSelector = document.querySelector('.theme-selector');
      
      if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!themeSelector?.contains(e.target)) {
          closeThemeDropdown();
        }
      }
    });
    
    // Keyboard shortcut: 't' to open theme selector
    document.addEventListener('keydown', (e) => {
      // Only if not in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        openThemeDropdown();
      }
    });
  }

  /**
   * Get current theme ID
   */
  function getCurrentTheme() {
    return currentTheme;
  }

  /**
   * Get current mode
   */
  function getCurrentMode() {
    return currentMode;
  }

  /**
   * Get all available themes
   */
  function getThemes() {
    return THEMES;
  }

  /**
   * Set theme from URL parameter
   */
  function setThemeFromURL(themeId) {
    if (THEMES.find(t => t.id === themeId)) {
      setTheme(themeId);
    }
  }

  // Public API
  return {
    init,
    setTheme,
    toggleMode,
    getCurrentTheme,
    getCurrentMode,
    getThemes,
    setThemeFromURL,
  };
})();

