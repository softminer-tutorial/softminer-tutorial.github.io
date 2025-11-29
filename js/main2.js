// Main JavaScript for Tutorial Website v2

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    loadPresenters();
    loadOutline();
    loadReadingList();
    loadContact();
});

// Mobile Navigation
function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

// Load Presenters
async function loadPresenters() {
    try {
        const response = await fetch('static/team.json');
        const data = await response.json();
        
        const presentersGrid = document.getElementById('presentersGrid');
        const affiliationsList = document.getElementById('affiliationsList');
        
        if (!presentersGrid || !data.organizers) return;
        
        // Create a map of affiliation numbers to websites
        const affiliationMap = {};
        if (data.affiliations) {
            data.affiliations.forEach(aff => {
                affiliationMap[aff.number] = aff.website || '#';
            });
        }
        
        // Create presenters grid
        let presentersHTML = '';
        data.organizers.forEach(organizer => {
            // Handle both affiliationNumbers array and affiliations object array
            const affNums = organizer.affiliationNumbers || (organizer.affiliations ? organizer.affiliations.map(a => a.number) : []);
            
            const affiliationRefs = affNums.map(num => {
                const website = affiliationMap[num] || '#';
                return `<a href="${website}" class="presenter-affiliation-ref" target="_blank" rel="noopener noreferrer">${num}</a>`;
            }).join(',');
            
            const nameHTML = affiliationRefs 
                ? `${organizer.name}<sup>${affiliationRefs}</sup>`
                : organizer.name;
            
            presentersHTML += `
                <div class="presenter-card">
                    <img src="${organizer.image}" alt="${organizer.name}" class="presenter-photo" loading="lazy">
                    <div class="presenter-name">
                        ${organizer.website 
                            ? `<a href="${organizer.website}" target="_blank" rel="noopener noreferrer">${nameHTML}</a>`
                            : nameHTML
                        }
                    </div>
                </div>
            `;
        });
        
        presentersGrid.innerHTML = presentersHTML;
        
        // Create affiliations list
        if (data.affiliations && data.affiliations.length > 0) {
            let affiliationsHTML = '<h3 class="subsection-title" style="font-size: 1.1em; margin-bottom: 16px;">Affiliations</h3>';
            data.affiliations.forEach(affiliation => {
                const affiliationLink = affiliation.website 
                    ? `<a href="${affiliation.website}" target="_blank" rel="noopener noreferrer">${affiliation.name}</a>`
                    : affiliation.name;
                
                affiliationsHTML += `
                    <div class="affiliation-item">
                        <span class="affiliation-number"><sup>${affiliation.number}</sup></span>
                        ${affiliationLink}
                    </div>
                `;
            });
            
            affiliationsList.innerHTML = affiliationsHTML;
        }
    } catch (error) {
        console.error('Error loading presenters:', error);
    }
}

// Load Outline
async function loadOutline() {
    try {
        const response = await fetch('static/schedule.json');
        const data = await response.json();
        
        const outlineContent = document.getElementById('outlineContent');
        if (!outlineContent || !data.sessions) return;
        
        let html = '';
        let sessionCounter = 0;
        
        data.sessions.forEach(session => {
            if (session.isBreak) {
                html += `
                    <div class="outline-break">
                        <div class="break-label">Break</div>
                        <div class="break-title">${session.title}</div>
                        <div class="break-duration-text">${session.duration}</div>
                    </div>
                `;
            } else {
                sessionCounter++;
                html += `
                    <div class="outline-session">
                        <div class="session-number">${sessionCounter}</div>
                        <h3 class="session-header-title">${session.sessionTitle}</h3>
                        <span class="session-duration">${session.duration}</span>
                        
                        <div class="session-segments">
                `;
                
                session.segments.forEach(segment => {
                    html += `
                        <div class="segment">
                            <div class="segment-header">
                                <span class="segment-time">${segment.time}</span>
                                <div class="segment-title">${segment.title}</div>
                            </div>
                    `;
                    
                    if (segment.description) {
                        html += `<div class="segment-description">${segment.description}</div>`;
                    }
                    
                    if (segment.topics && segment.topics.length > 0) {
                        html += '<ul class="segment-topics">';
                        segment.topics.forEach(topic => {
                            html += `<li>${topic}</li>`;
                        });
                        html += '</ul>';
                    }
                    
                    if (segment.papers && segment.papers.length > 0) {
                        html += '<div class="segment-papers">';
                        segment.papers.forEach(paper => {
                            html += `
                                <div class="paper-card">
                                    <a href="${paper.url}" target="_blank" rel="noopener noreferrer">
                                        <span class="paper-title-text">${paper.title}</span>
                                        <span class="paper-authors">${paper.authors}, ${paper.venue}</span>
                                    </a>
                                </div>
                            `;
                        });
                        html += '</div>';
                    }
                    
                    html += `</div>`;
                });
                
                html += `
                        </div>
                    </div>
                `;
            }
        });
        
        outlineContent.innerHTML = html;
    } catch (error) {
        console.error('Error loading outline:', error);
    }
}

// Load Reading List
async function loadReadingList() {
    try {
        const response = await fetch('static/reading-list.json');
        const data = await response.json();
        
        const readingListContent = document.getElementById('readingListContent');
        if (!readingListContent || !data.papers) return;
        
        const papersHTML = data.papers.map(paper => `
            <li>
                <a href="${paper.link}" target="_blank" rel="noopener noreferrer">${paper.title}</a>
            </li>
        `).join('');
        
        readingListContent.innerHTML = `<ul>${papersHTML}</ul>`;
    } catch (error) {
        console.error('Error loading reading list:', error);
    }
}

// Load Contact Information
async function loadContact() {
    try {
        const response = await fetch('static/team.json');
        const data = await response.json();
        
        const contactContent = document.getElementById('contactContent');
        if (!contactContent || !data.organizers) return;
        
        // Show first organizer as primary contact
        const primaryContact = data.organizers[0];
        
        // Get first affiliation
        let affiliationHTML = '';
        if (data.affiliations && data.affiliations.length > 0) {
            const affNum = primaryContact.affiliationNumbers ? primaryContact.affiliationNumbers[0] : null;
            const affiliation = data.affiliations.find(a => a.number === affNum);
            
            if (affiliation) {
                affiliationHTML = affiliation.website
                    ? `<a href="${affiliation.website}" target="_blank" rel="noopener noreferrer">${affiliation.name}</a>`
                    : affiliation.name;
            }
        }
        
        // If no affiliation found, use the direct affiliation field
        if (!affiliationHTML && primaryContact.affiliation) {
            affiliationHTML = primaryContact.affiliation;
        }
        
        const contactHTML = `
            <div class="contact-card">
                <div class="contact-role">Primary Contact</div>
                <h3 class="contact-name">
                    ${primaryContact.website 
                        ? `<a href="${primaryContact.website}" target="_blank" rel="noopener noreferrer">${primaryContact.name}</a>`
                        : primaryContact.name
                    }
                </h3>
                ${affiliationHTML ? `<p class="contact-org">${affiliationHTML}</p>` : ''}
                <p style="margin-top: 12px; color: var(--text-body);">For inquiries about the tutorial, please contact the organizers via the email addresses provided on their personal websites.</p>
            </div>
        `;
        
        contactContent.innerHTML = contactHTML;
    } catch (error) {
        console.error('Error loading contact:', error);
    }
}

