const RESOURCES_FALLBACK = [
    { type: 'Article', title: 'Tapping the Catalytic Capital Potential of Donor Advised Funds', description: 'DAF assets represent an ideal source of catalytic capital — patient, risk-tolerant, concessionary, and flexible — to support impact-driven enterprises that lack access to capital through conventional markets.', tags: null, keywords: 'donor advised fund DAF catalytic capital impact investing patient capital CDFI', resource_url: 'https://greenmoney.com/tapping-the-catalytic-capital-potential-of-donor-advised-funds/' },
    { type: 'Article', title: 'How to Use Donor-Advised Funds to Make Impact Investments', description: 'Older but still relevant guide explaining how DAF holders can make impact investments, with practical framing around how to work with fund sponsors.', tags: null, keywords: 'donor advised fund DAF impact investing', resource_url: 'https://ssir.org/articles/entry/how_to_use_donor_advised_funds_to_make_impact_investments' },
    { type: 'Article', title: 'Using Donor Advised Funds to Invest in Early Stage Entrepreneurs', description: 'Older but still relevant article making the case for DAF holders to use their DAF capital for impact investing to fill financing gaps for early-stage social enterprises.', tags: null, keywords: 'donor advised fund DAF impact investing catalytic capital social entrepreneur', resource_url: 'https://ssir.org/articles/entry/using_donor_advised_funds_to_invest_in_early_stage_entrepreneurs#' },
    { type: 'Article', title: 'Multi-donor Funds Emerge as a Creative Architecture for Collaborative, Catalytic Capital', description: 'Makes the case for multi-donor funds (MDFs) — collaborative vehicles built atop DAFs — as a flexible, fast-moving model for collective impact investing.', tags: null, keywords: 'donor advised fund DAF catalytic capital impact investing collective action multi-donor fund', resource_url: 'https://impactalpha.com/multi-donor-funds-creative-architecture-for-collaborative-catalytic-capital/' },
    { type: 'guide', title: 'Mobilizing Donor Advised Funds For Impact Investing', description: 'Older but still relevant guide on DAFs + impact investing written specifically for DAF holders, examining different ways DAF capital can be deployed strategically for impact.', tags: null, keywords: 'donor advised fund DAF catalytic capital impact investing collective action loan guarantee pooled fund', resource_url: 'https://missioninvestors.org/sites/default/files/resources/Read%20the%20Full%20Report_1.pdf' },
    { type: 'guide', title: 'The Independent Report on DAFs', description: 'A transparent, comprehensive analysis of donor-advised funds.', tags: null, keywords: 'donor advised fund DAF sponsor payout account size research', resource_url: 'https://inequality.org/article/the-independent-report-on-dafs/' },
    { type: 'guide', title: 'The National Study on Donor Advised Funds', description: 'An independent, comprehensive study of donor advised funds.', tags: null, keywords: 'donor advised fund DAF sponsor payout account size research', resource_url: 'https://www.dafresearchcollaborative.org/national-study-dafs' },
    { type: 'tool', title: 'DAF Stakeholders Report', description: 'An interactive report on the ecosystem of DAF stakeholders, and their incentives.', tags: null, keywords: '', resource_url: 'https://starlinglouis.kumu.io/stakeholders-in-the-daf-landscape' }
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
            (r.keywords || '').toLowerCase().includes(educationSearchQuery.toLowerCase());
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

    listContainer.innerHTML = '';
    filtered.forEach(resource => {
        const card = document.createElement('div');
        card.className = 'resource-card scroll-animate';

        const title = document.createElement('h3');
        title.className = 'resource-title';
        title.textContent = resource.title;

        const desc = document.createElement('p');
        desc.className = 'resource-description';
        desc.textContent = resource.description;

        card.appendChild(title);
        card.appendChild(desc);

        if (resource.resource_url) {
            const link = document.createElement('a');
            link.className = 'org-link';
            link.href = resource.resource_url;
            link.target = '_blank';
            link.rel = 'noopener';
            link.style.marginTop = 'auto';
            link.style.paddingTop = '16px';
            link.textContent = 'Read More ';
            const arrow = document.createElement('span');
            arrow.className = 'arrow';
            arrow.textContent = '→';
            link.appendChild(arrow);
            card.appendChild(link);
        }

        listContainer.appendChild(card);
    });

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
