async function loadOrganizersPhotos() {
    try {
        const response = await fetch('static/team.json');
        const data = await response.json();
        
        const photosContainer = document.getElementById('organizers-photos');
        if (!photosContainer || !data.organizers) return;
        
        const affiliationMap = {};
        if (data.affiliations) {
            data.affiliations.forEach(aff => {
                affiliationMap[aff.number] = aff.website || '#';
            });
        }
        
        const photosHTML = data.organizers.map(org => {
            let superscripts = '';
            if (org.affiliationNumbers && org.affiliationNumbers.length > 0) {
                superscripts = org.affiliationNumbers.map(num => {
                    const affUrl = affiliationMap[num] || '#';
                    return `<sup><a href="${affUrl}" class="affiliation-link" target="_blank" rel="noopener noreferrer">${num}</a></sup>`;
                }).join(',');
            }
            return `
                <div class="organizer-item">
                    <img src="${org.image}" alt="${org.name}">
                    <div class="organizer-name-with-sup">
                        <a href="${org.website}" class="organizer-name-link" target="_blank" rel="noopener noreferrer">${org.name}</a>${superscripts}
                    </div>
                </div>
            `;
        }).join('');
        
        let affiliationsHTML = '';
        if (data.affiliations) {
            affiliationsHTML = '<div class="affiliations">' + 
                data.affiliations.map(aff => {
                    const affUrl = aff.website || '#';
                    return `<span class="affiliation"><sup>${aff.number}</sup><a href="${affUrl}" class="affiliation-name-link" target="_blank" rel="noopener noreferrer">${aff.name}</a></span>`;
                }).join(' ') + 
                '</div>';
        }
        
        photosContainer.innerHTML = `<div class="organizers-grid">${photosHTML}</div>${affiliationsHTML}`;
    } catch (error) {
        console.error('Error loading organizer photos:', error);
    }
}

async function loadSchedule() {
    try {
        const response = await fetch('static/schedule.json');
        const data = await response.json();
        
        const scheduleContent = document.getElementById('scheduleContent');
        if (!scheduleContent || !data.days) return;
        
        let html = '';
        if (data.tutorialInfo) {
            html += `
                <div class="tutorial-info">
                    <p><strong>Date:</strong> ${data.tutorialInfo.date}</p>
                    <p><strong>Time:</strong> ${data.tutorialInfo.time}</p>
                    <p><strong>Location:</strong> ${data.tutorialInfo.location}</p>
                </div>
            `;
        }
        
        data.days.forEach(day => {
            if (data.days.length > 1) {
                html += `
                    <div class="day-header">
                        <h3>${day.dayTitle}</h3>
                        <p class="day-date">${day.date}</p>
                    </div>
                `;
            }
            
            // Generate schedule table
            html += `
                <div class="schedule-table-wrapper">
                    <table class="schedule-table">
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>Section</th>
                                <th>Topics</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            day.sessions.forEach(session => {
                const rowClass = session.isBreak ? ' class="break-row"' : '';
                if (session.isBreak) {
                    html += `
                        <tr${rowClass}>
                            <td>${session.time}</td>
                            <td colspan="2">${session.title}</td>
                        </tr>
                    `;
                } else {
                    const topicsList = session.topics.map(topic => `• ${topic}`).join('<br>');
                    html += `
                        <tr${rowClass}>
                            <td>${session.time}</td>
                            <td>${session.title}</td>
                            <td>${topicsList}</td>
                        </tr>
                    `;
                }
            });
            
            html += `
                        </tbody>
                    </table>
                </div>
            `;
        });
        
        scheduleContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading schedule data:', error);
    }
}

async function loadReadingList() {
    try {
        const response = await fetch('static/reading-list.json');
        const data = await response.json();
        
        const readingSection = document.querySelector('.reading-list');
        if (!readingSection || !data.papers) return;
        
        const papersList = data.papers.map(paper => `
            <li>
                <a href="${paper.link}" target="_blank" rel="noopener noreferrer">${paper.title}</a>
            </li>
        `).join('');
        
        const existingContent = readingSection.innerHTML;
        readingSection.innerHTML = existingContent + `<ul class="papers-list">${papersList}</ul>`;
    } catch (error) {
        console.error('Error loading reading list data:', error);
    }
}

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            const spans = navToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        }
    });
}

function initBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (!backToTopButton) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

function initCopyBibtex() {
    const copyBtn = document.getElementById('copyBibtexBtn');
    const bibtexCode = document.getElementById('bibtexCode');
    
    if (!copyBtn || !bibtexCode) return;
    
    copyBtn.addEventListener('click', async () => {
        try {
            const text = bibtexCode.textContent;
            await navigator.clipboard.writeText(text);
            
            const originalHTML = copyBtn.innerHTML;
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <span>Copied!</span>
            `;
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.innerHTML = originalHTML;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text:', err);
            const textArea = document.createElement('textarea');
            textArea.value = bibtexCode.textContent;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                copyBtn.innerHTML = '<span>Copied!</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            } catch (err) {
                console.error('Fallback copy failed:', err);
            }
            document.body.removeChild(textArea);
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initBackToTop();
    initScrollAnimations();
    initCopyBibtex();
    loadOrganizersPhotos();
    loadSchedule();
    loadReadingList();
});
