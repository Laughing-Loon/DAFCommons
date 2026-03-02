const RESOURCES_FALLBACK = [
    { type: 'guide', title: 'Getting Started with DAF Impact Investing', description: 'A comprehensive introduction to deploying your donor-advised fund for impact investments, covering basics, strategies, and first steps.', tags: ['Beginner', 'Guide'], keywords: 'impact investing beginner start DAF basics introduction', url: '' },
    { type: 'guide', title: 'Switching DAF Sponsors: A Step-by-Step Guide', description: 'Learn how to evaluate and transition between DAF sponsors, including what to look for and how to minimize disruption.', tags: ['How-To', 'Guide'], keywords: 'sponsor switch transition evaluate move', url: '' },
    { type: 'template', title: 'Investment Policy Statement Template', description: 'Downloadable template for creating your DAF investment policy statement, with guidance on key decision points and customization.', tags: ['Template', 'Advanced'], keywords: 'IPS policy statement investment template document', url: '' },
    { type: 'template', title: 'Due Diligence Checklist for Impact Investments', description: 'Comprehensive checklist covering financial, impact, and operational due diligence for evaluating investment opportunities.', tags: ['Template', 'Due Diligence'], keywords: 'due diligence checklist evaluation assessment', url: '' },
    { type: 'tool', title: 'DAF Sponsor Selection Tool', description: 'Interactive tool to help you identify the right DAF sponsor based on your priorities, investment interests, and fee preferences.', tags: ['Tool', 'Beginner'], keywords: 'sponsor selection choose tool interactive', url: '' },
    { type: 'tool', title: 'Values Alignment Survey', description: 'Clarify your philanthropic values and priorities to guide your impact investing strategy and portfolio construction.', tags: ['Tool', 'Planning'], keywords: 'values alignment survey priorities mission', url: '' },
    { type: 'case-study', title: 'CCJF: Pooling DAF Capital for Climate Justice', description: 'Case study on the Collective Climate Justice Fund model for multi-donor DAF collaboration and impact measurement.', tags: ['Case Study', 'Climate'], keywords: 'CCJF climate justice pooling multi-donor collaborative', url: '' },
    { type: 'case-study', title: 'Sea Forward Fund: Ocean Conservation Through DAFs', description: 'How philanthropic capital is being deployed to ocean health through a multi-donor fund structure.', tags: ['Case Study', 'Environment'], keywords: 'ocean conservation sea forward environment marine', url: '' },
    { type: 'guide', title: 'Understanding Recoverable Grants', description: 'Explore how to use DAF capital for program-related investments and recoverable grants to maximize impact.', tags: ['Guide', 'Advanced'], keywords: 'recoverable grants PRI program-related investment', url: '' },
    { type: 'template', title: 'Gift Acceptance Policy Template', description: 'Sample policies for accepting complex assets into your DAF, including real estate, cryptocurrency, and private equity.', tags: ['Template', 'Complex Assets'], keywords: 'gift acceptance policy crypto real estate assets', url: '' },
    { type: 'guide', title: 'Impact Measurement for DAF Investments', description: 'Frameworks and approaches for measuring social and environmental outcomes from your impact investments.', tags: ['Guide', 'Impact Measurement'], keywords: 'impact measurement outcomes metrics evaluation assessment', url: '' },
    { type: 'tool', title: 'Impact Pledge Framework', description: 'Make and track your commitment to allocate a percentage of DAF capital to impact investments, with accountability tools.', tags: ['Tool', 'Commitment'], keywords: 'pledge commitment accountability tracking goals', url: '' }
];

let RESOURCES = [];
let currentResourceFilter = 'all';
let educationSearchQuery = '';

async function fetchEducationResources() {
    try {
        const { data, error } = await supabaseClient.from('education_resources').select('*').order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching education resources:', error);
        return RESOURCES_FALLBACK;
    }
}

function renderResources() {
    const filtered = RESOURCES.filter(r => {
        const matchesFilter = currentResourceFilter === 'all' || r.type === currentResourceFilter;
        const matchesSearch = educationSearchQuery === '' ||
            r.title.toLowerCase().includes(educationSearchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(educationSearchQuery.toLowerCase()) ||
            r.keywords.toLowerCase().includes(educationSearchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const noResults = document.getElementById('educationNoResults');
    const listContainer = document.getElementById('resourcesList');

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        listContainer.innerHTML = '';
        return;
    } else {
        noResults.style.display = 'none';
    }

    listContainer.innerHTML = filtered.map(resource =>
        '<div class="resource-card scroll-animate">' +
        '<h3 class="resource-title">' + resource.title + '</h3>' +
        '<p class="resource-description">' + resource.description + '</p>' +
        (resource.url ? '<a href="' + resource.url + '" target="_blank" rel="noopener" class="org-link" style="margin-top: auto; padding-top: 16px;">Read More <span class="arrow">→</span></a>' : '') +
        '</div>'
    ).join('');

    if (typeof initScrollAnimations === 'function') initScrollAnimations();
}

function filterResources(type) {
    currentResourceFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderResources();
}

function searchEducation() {
    educationSearchQuery = document.getElementById('educationSearchInput').value;
    renderResources();
}

document.addEventListener('DOMContentLoaded', async () => {
    RESOURCES = await fetchEducationResources();
    renderResources();
});
