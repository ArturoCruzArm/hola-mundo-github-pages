/**
 * Búsqueda local con Lunr.js
 */

// Variables globales
let searchIndex = null;
let searchData = [];
const searchModal = document.getElementById('searchModal');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchToggle = document.getElementById('searchToggle');
const searchClose = document.getElementById('searchClose');
const searchOverlay = document.getElementById('searchOverlay');

// Cargar índice de búsqueda
async function loadSearchIndex() {
    try {
        const response = await fetch('/search.json');
        searchData = await response.json();

        searchIndex = lunr(function() {
            this.ref('url');
            this.field('title', { boost: 10 });
            this.field('content');
            this.field('categories', { boost: 5 });
            this.field('tags', { boost: 5 });

            searchData.forEach(doc => {
                this.add(doc);
            });
        });

        console.log('🔍 Índice de búsqueda cargado');
    } catch (error) {
        console.error('Error cargando índice de búsqueda:', error);
    }
}

// Realizar búsqueda
function performSearch(query) {
    if (!searchIndex || query.length < 2) {
        showEmptyState();
        return;
    }

    try {
        // Buscar con wildcards para mejor UX
        const results = searchIndex.search(query + '*');

        if (results.length === 0) {
            showNoResults(query);
            return;
        }

        displayResults(results, query);
    } catch (error) {
        // Si falla la búsqueda avanzada, intentar búsqueda simple
        const simpleResults = searchIndex.search(query);
        if (simpleResults.length > 0) {
            displayResults(simpleResults, query);
        } else {
            showNoResults(query);
        }
    }
}

// Mostrar resultados
function displayResults(results, query) {
    const html = results.slice(0, 10).map((result, index) => {
        const doc = searchData.find(d => d.url === result.ref);
        if (!doc) return '';

        const title = highlightText(doc.title, query);
        const excerpt = getExcerpt(doc.content, query);

        return `
            <a href="${doc.url}" class="search-result ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="result-title">${title}</div>
                <div class="result-excerpt">${excerpt}</div>
                <div class="result-meta">
                    ${doc.date ? `<span>${doc.date}</span>` : ''}
                    ${doc.categories ? `<span class="result-category">${doc.categories}</span>` : ''}
                </div>
            </a>
        `;
    }).join('');

    searchResults.innerHTML = html || showNoResults(query);
}

// Resaltar texto coincidente
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Obtener extracto con contexto
function getExcerpt(content, query) {
    if (!content) return '';

    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);

    if (index === -1) {
        return content.substring(0, 150) + '...';
    }

    const start = Math.max(0, index - 50);
    const end = Math.min(content.length, index + query.length + 100);
    let excerpt = content.substring(start, end);

    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return highlightText(excerpt, query);
}

// Escapar caracteres especiales de regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Estados de UI
function showEmptyState() {
    searchResults.innerHTML = `
        <div class="search-empty">
            <p>Escribe para buscar...</p>
            <div class="search-suggestions">
                <span>Sugerencias:</span>
                <button class="suggestion" data-query="javascript">JavaScript</button>
                <button class="suggestion" data-query="css">CSS</button>
                <button class="suggestion" data-query="github">GitHub</button>
            </div>
        </div>
    `;

    // Event listeners para sugerencias
    document.querySelectorAll('.suggestion').forEach(btn => {
        btn.addEventListener('click', () => {
            searchInput.value = btn.dataset.query;
            performSearch(btn.dataset.query);
        });
    });
}

function showNoResults(query) {
    searchResults.innerHTML = `
        <div class="search-no-results">
            <p>😕 No se encontraron resultados para "<strong>${query}</strong>"</p>
            <p class="suggestion-text">Intenta con otros términos</p>
        </div>
    `;
}

// Abrir modal
function openSearch() {
    searchModal.setAttribute('aria-hidden', 'false');
    searchModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    searchInput.focus();

    if (!searchIndex) {
        loadSearchIndex();
    }
}

// Cerrar modal
function closeSearch() {
    searchModal.setAttribute('aria-hidden', 'true');
    searchModal.classList.remove('open');
    document.body.style.overflow = '';
    searchInput.value = '';
    showEmptyState();
}

// Navegación por teclado
let activeIndex = 0;

function navigateResults(direction) {
    const results = document.querySelectorAll('.search-result');
    if (results.length === 0) return;

    results[activeIndex]?.classList.remove('active');

    if (direction === 'down') {
        activeIndex = (activeIndex + 1) % results.length;
    } else {
        activeIndex = (activeIndex - 1 + results.length) % results.length;
    }

    results[activeIndex]?.classList.add('active');
    results[activeIndex]?.scrollIntoView({ block: 'nearest' });
}

function selectResult() {
    const activeResult = document.querySelector('.search-result.active');
    if (activeResult) {
        window.location.href = activeResult.href;
    }
}

// Event Listeners
if (searchToggle) {
    searchToggle.addEventListener('click', openSearch);
}

if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
}

if (searchOverlay) {
    searchOverlay.addEventListener('click', closeSearch);
}

if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        activeIndex = 0;
        performSearch(e.target.value.trim());
    });
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K para abrir búsqueda
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (searchModal.classList.contains('open')) {
            closeSearch();
        } else {
            openSearch();
        }
    }

    // ESC para cerrar
    if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        closeSearch();
    }

    // Navegación en modal abierto
    if (searchModal.classList.contains('open')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            navigateResults('down');
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            navigateResults('up');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            selectResult();
        }
    }
});

// Inicializar estado vacío
if (searchResults) {
    showEmptyState();
}
