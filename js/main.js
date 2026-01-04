// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// Carousel Functionality
// ============================================
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.track = element.querySelector('.carousel-track');
        this.prevBtn = element.querySelector('.carousel-arrow-prev');
        this.nextBtn = element.querySelector('.carousel-arrow-next');

        if (!this.track) return;

        this.isDragging = false;
        this.startX = 0;
        this.scrollLeft = 0;

        this.init();
    }

    init() {
        // Arrow button handlers
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.scroll('prev'));
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.scroll('next'));
        }

        // Drag functionality
        this.track.addEventListener('mousedown', (e) => this.startDrag(e));
        this.track.addEventListener('mousemove', (e) => this.drag(e));
        this.track.addEventListener('mouseup', () => this.endDrag());
        this.track.addEventListener('mouseleave', () => this.endDrag());

        // Touch functionality
        this.track.addEventListener('touchstart', (e) => this.startDrag(e), { passive: true });
        this.track.addEventListener('touchmove', (e) => this.drag(e), { passive: true });
        this.track.addEventListener('touchend', () => this.endDrag());

        // Update button states on scroll
        this.track.addEventListener('scroll', () => this.updateButtons());

        // Initial button state
        this.updateButtons();
    }

    getCardWidth() {
        const firstCard = this.track.firstElementChild;
        if (!firstCard) return 320;
        const style = getComputedStyle(this.track);
        const gap = parseFloat(style.gap) || 16;
        return firstCard.offsetWidth + gap;
    }

    scroll(direction) {
        const cardWidth = this.getCardWidth();
        const scrollAmount = direction === 'next' ? cardWidth : -cardWidth;
        this.track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    startDrag(e) {
        this.isDragging = true;
        this.track.classList.add('dragging');
        this.startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        this.scrollLeft = this.track.scrollLeft;
    }

    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const walk = (this.startX - x) * 1.5;
        this.track.scrollLeft = this.scrollLeft + walk;
    }

    endDrag() {
        this.isDragging = false;
        this.track.classList.remove('dragging');
    }

    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.disabled = this.track.scrollLeft <= 0;
        }
        if (this.nextBtn) {
            const maxScroll = this.track.scrollWidth - this.track.clientWidth;
            this.nextBtn.disabled = this.track.scrollLeft >= maxScroll - 1;
        }
    }
}

// Initialize all carousels
document.querySelectorAll('.carousel').forEach(carousel => {
    new Carousel(carousel);
});

// ============================================
// Case Study Filter Functionality
// ============================================
class CaseStudyFilter {
    constructor() {
        this.filterContainer = document.querySelector('.filter-pills');
        this.carouselTrack = document.querySelector('#case-studies-carousel .carousel-track');

        if (!this.filterContainer || !this.carouselTrack) return;

        this.cards = this.carouselTrack.querySelectorAll('.case-study-card');
        this.activeFilters = new Set();

        this.init();
    }

    init() {
        this.filterContainer.querySelectorAll('.filter-pill').forEach(pill => {
            pill.addEventListener('click', () => this.toggleFilter(pill));
        });
    }

    toggleFilter(pill) {
        const tag = pill.dataset.tag;

        // Handle "All" pill
        if (tag === 'all') {
            this.activeFilters.clear();
            this.filterContainer.querySelectorAll('.filter-pill').forEach(p => {
                p.classList.remove('active');
            });
            pill.classList.add('active');
        } else {
            // Remove "All" active state
            const allPill = this.filterContainer.querySelector('[data-tag="all"]');
            if (allPill) allPill.classList.remove('active');

            // Toggle this filter
            if (this.activeFilters.has(tag)) {
                this.activeFilters.delete(tag);
                pill.classList.remove('active');
            } else {
                this.activeFilters.add(tag);
                pill.classList.add('active');
            }

            // If no filters active, activate "All"
            if (this.activeFilters.size === 0 && allPill) {
                allPill.classList.add('active');
            }
        }

        this.filterCards();
    }

    filterCards() {
        this.cards.forEach(card => {
            const cardTags = card.dataset.tags ? card.dataset.tags.split(',').map(t => t.trim()) : [];

            if (this.activeFilters.size === 0) {
                // Show all if no filters active
                card.classList.remove('hidden');
            } else {
                // Show if card has any of the active filters
                const hasMatch = cardTags.some(tag => this.activeFilters.has(tag));
                card.classList.toggle('hidden', !hasMatch);
            }
        });
    }
}

// Initialize filter
new CaseStudyFilter();
