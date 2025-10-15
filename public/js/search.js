// Search-specific JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeAdvancedSearch();
    initializeSearchFilters();
    initializeSearchHistory();
});

// Advanced search functionality
function initializeAdvancedSearch() {
    const searchForm = document.querySelector('.advanced-search-form');
    const searchInput = document.getElementById('q');
    
    if (!searchForm || !searchInput) return;
    
    // Auto-focus on search input
    searchInput.focus();
    
    // Real-time search validation
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const minLength = 2;
        
        if (query.length > 0 && query.length < minLength) {
            showSearchHint(`Tapez au moins ${minLength} caractères pour rechercher`);
        } else if (query.length >= minLength) {
            hideSearchHint();
            // Optionally trigger real-time search
            debounceSearch(query);
        }
    });
    
    // Form submission
    searchForm.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        
        if (query.length < 2) {
            e.preventDefault();
            showSearchError('Veuillez saisir au moins 2 caractères pour rechercher');
            return;
        }
        
        // Add loading state
        showSearchLoading();
    });
}

// Debounced search function
const debounceSearch = debounce(function(query) {
    // This could trigger real-time search results
    // For now, we'll just log it
    console.log('Searching for:', query);
}, 500);

// Search filters functionality
function initializeSearchFilters() {
    const filterForm = document.querySelector('.filters-form');
    if (!filterForm) return;
    
    // Auto-submit on filter change
    const filterInputs = filterForm.querySelectorAll('select, input[type="text"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Add a small delay to prevent too many requests
            setTimeout(() => {
                filterForm.submit();
            }, 300);
        });
    });
    
    // Clear filters button
    const clearButton = document.querySelector('.btn-secondary');
    if (clearButton && clearButton.textContent.includes('Réinitialiser')) {
        clearButton.addEventListener('click', function(e) {
            e.preventDefault();
            clearAllFilters();
        });
    }
}

// Clear all search filters
function clearAllFilters() {
    const form = document.querySelector('.filters-form');
    if (!form) return;
    
    // Reset all form inputs
    form.querySelectorAll('input, select').forEach(input => {
        if (input.type === 'text') {
            input.value = '';
        } else if (input.type === 'select-one') {
            input.selectedIndex = 0;
        }
    });
    
    // Submit the form
    form.submit();
}

// Search history functionality
function initializeSearchHistory() {
    const searchInput = document.getElementById('q');
    if (!searchInput) return;
    
    // Load search history
    loadSearchHistory();
    
    // Save search on form submission
    const form = searchInput.closest('form');
    if (form) {
        form.addEventListener('submit', function() {
            const query = searchInput.value.trim();
            if (query.length >= 2) {
                saveSearchToHistory(query);
            }
        });
    }
}

// Load search history from localStorage
function loadSearchHistory() {
    const history = getSearchHistory();
    if (history.length === 0) return;
    
    // Create history dropdown or suggestions
    createHistoryDropdown(history);
}

// Get search history from localStorage
function getSearchHistory() {
    try {
        const history = localStorage.getItem('cgi-search-history');
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error loading search history:', error);
        return [];
    }
}

// Save search to history
function saveSearchToHistory(query) {
    try {
        let history = getSearchHistory();
        
        // Remove if already exists
        history = history.filter(item => item !== query);
        
        // Add to beginning
        history.unshift(query);
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        localStorage.setItem('cgi-search-history', JSON.stringify(history));
    } catch (error) {
        console.error('Error saving search history:', error);
    }
}

// Create history dropdown
function createHistoryDropdown(history) {
    const searchInput = document.getElementById('q');
    if (!searchInput) return;
    
    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'search-history-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        z-index: 1000;
        display: none;
        max-height: 200px;
        overflow-y: auto;
    `;
    
    // Add history items
    history.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        itemDiv.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
        `;
        itemDiv.textContent = item;
        itemDiv.addEventListener('click', function() {
            searchInput.value = item;
            searchInput.focus();
            dropdown.style.display = 'none';
        });
        itemDiv.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
        });
        itemDiv.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'white';
        });
        dropdown.appendChild(itemDiv);
    });
    
    // Add clear history option
    if (history.length > 0) {
        const clearDiv = document.createElement('div');
        clearDiv.className = 'clear-history';
        clearDiv.style.cssText = `
            padding: 8px 12px;
            cursor: pointer;
            background: #f8f9fa;
            color: #666;
            font-size: 12px;
            text-align: center;
            border-top: 1px solid #ddd;
        `;
        clearDiv.textContent = 'Effacer l\'historique';
        clearDiv.addEventListener('click', function() {
            localStorage.removeItem('cgi-search-history');
            dropdown.remove();
        });
        dropdown.appendChild(clearDiv);
    }
    
    // Insert dropdown
    searchInput.parentNode.style.position = 'relative';
    searchInput.parentNode.appendChild(dropdown);
    
    // Show/hide dropdown
    searchInput.addEventListener('focus', function() {
        if (history.length > 0) {
            dropdown.style.display = 'block';
        }
    });
    
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

// Show search hint
function showSearchHint(message) {
    hideSearchHint(); // Remove existing hint
    
    const hint = document.createElement('div');
    hint.className = 'search-hint';
    hint.textContent = message;
    hint.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff3cd;
        color: #856404;
        padding: 8px 12px;
        border: 1px solid #ffeaa7;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
    `;
    
    const searchInput = document.getElementById('q');
    if (searchInput) {
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(hint);
    }
}

// Hide search hint
function hideSearchHint() {
    const existingHint = document.querySelector('.search-hint');
    if (existingHint) {
        existingHint.remove();
    }
}

// Show search error
function showSearchError(message) {
    hideSearchError(); // Remove existing error
    
    const error = document.createElement('div');
    error.className = 'search-error';
    error.textContent = message;
    error.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #f8d7da;
        color: #721c24;
        padding: 8px 12px;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        font-size: 14px;
        z-index: 1000;
    `;
    
    const searchInput = document.getElementById('q');
    if (searchInput) {
        searchInput.parentNode.style.position = 'relative';
        searchInput.parentNode.appendChild(error);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideSearchError();
        }, 5000);
    }
}

// Hide search error
function hideSearchError() {
    const existingError = document.querySelector('.search-error');
    if (existingError) {
        existingError.remove();
    }
}

// Show search loading state
function showSearchLoading() {
    const submitButton = document.querySelector('.advanced-search-form button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
            Recherche...
        `;
        submitButton.disabled = true;
        
        // Store original text for restoration
        submitButton.dataset.originalText = originalText;
    }
}

// Hide search loading state
function hideSearchLoading() {
    const submitButton = document.querySelector('.advanced-search-form button[type="submit"]');
    if (submitButton && submitButton.dataset.originalText) {
        submitButton.innerHTML = submitButton.dataset.originalText;
        submitButton.disabled = false;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global use
window.SearchUtils = {
    showSearchHint,
    hideSearchHint,
    showSearchError,
    hideSearchError,
    showSearchLoading,
    hideSearchLoading,
    clearAllFilters,
    saveSearchToHistory,
    getSearchHistory
};