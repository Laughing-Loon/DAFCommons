const ORGANIZATIONS_FALLBACK = [
    { name: "Movement Strategy Center", description: "Community organizing fiscal sponsor focused on activating donor capital through an ecosystem approach, backing change agents and capital innovators.", website: "https://movementstrategy.org/donor-advised-fund", type: "Capital Deployment" },
    { name: "Silicon Valley Community Foundation", description: "Community-foundation DAF sponsor with bespoke philanthropic services.", website: "https://www.svcf.org", type: "DAF Sponsor" },
    { name: "The Chicago Community Trust", description: "A place-based community foundation providing residents of Chicago with opportunities to address regional goals across housing, food and jobs.", website: "https://www.cct.org/", type: "DAF Sponsor" },
    { name: "The New York Community Trust", description: "A place-based community foundation uniting donors in support of nonprofits in NY, Long Island, and Westchester. One of the oldest community foundations in the US.", website: "https://thenytrust.org/", type: "DAF Sponsor" },
    { name: "Fidelity Charitable", description: "Fidelity's giving branch. Nation's largest commercial DAF.", website: "https://www.fidelitycharitable.org", type: "DAF Sponsor" },
    { name: "DAF Giving 360", description: "Schwab's donor-advised fund platform (DAFgiving360) for retail and HNW donors.", website: "https://www.schwab.com/donor-advised-fund", type: "DAF Sponsor" },
    { name: "Vanguard Charitable", description: "Low-fee commercial DAF emphasizing index-based investment pools.", website: "https://www.vanguardcharitable.org", type: "DAF Sponsor" },
    { name: "National Philanthropic Trust (NPT)", description: "Independent public charity; among the largest DAF sponsors.", website: "https://www.nptrust.org", type: "DAF Sponsor" },
    { name: "Renaissance Charitable Foundation (Ren)", description: "Specialized DAF sponsor for complex assets including hedge fund interests. Sponsor arm of Ren technology provider.", website: "https://www.rencf.org", type: "DAF Sponsor" },
    { name: "CAF America", description: "International giving specialist; validates global charities for U.S. donors.", website: "https://cafamerica.org", type: "DAF Sponsor" },
    { name: "American Endowment Foundation (AEF)", description: "Large independent sponsor focused on DAF administration.", website: "https://www.aefonline.org/", type: "DAF Sponsor" },
    { name: "Earthshare", description: "National DAF sponsor focused on accelerating philanthropic capital toward environmental nonprofits and initiatives. Also serves as fiscal sponsor, and workplace giving partner.", website: "https://www.earthshare.org/", type: "DAF Sponsor" },
    { name: "Legacy Global", description: "Boutique sponsor providing custom DAFs and charitable-trust solutions. Focus on supporting impact investment opportunities.", website: "https://www.legacyglobal.org", type: "DAF Sponsor" },
    { name: "Daffy", description: "Modern mobile-first DAF with APIs for fintech integration, supporting cash, stock, and crypto contributions. Designed to make DAFs accessible with no minimums.", website: "https://www.daffy.org", type: "DAF Sponsor" },
    { name: "Charityvest", description: "Zero-fee, mobile-first DAF aimed at everyday givers; accepts cash, stock, crypto.", website: "https://www.charityvest.org", type: "DAF Sponsor" },
    { name: "Endaoment", description: "Blockchain-native 501(c)(3) foundation & sponsor enabling crypto DAFs & grants.", website: "https://endaoment.org", type: "DAF Sponsor" },
    { name: "Impact Assets", description: "Impact-oriented DAF platform with curated investment marketplace (IA 50).", website: "https://impactassets.org", type: "DAF Sponsor" },
    { name: "NETA Foundation", description: "GrantVestments™ DAF platform supports donors in deploying DAF dollars as catalytic, VC-style investments in breakthrough science & other thematics. Can serve as both DAF sponsor and investment manager.", website: "https://www.netafoundation.org", type: "DAF Sponsor" },
    { name: "Abundance Capital", description: "DAF Sponsor, and nonprofit venture philanthropy platform empowering donors to make high-impact investments.", website: "https://www.abundancecap.org/", type: "DAF Sponsor" },
    { name: "Tides Foundation", description: "Long-running progressive DAF & fiscal-sponsor platform for social-justice causes.", website: "https://www.tides.org", type: "DAF Sponsor" },
    { name: "National Christian Charitable Foundation", description: "One of Nation's largest DAF sponsors providing charitable support for Christian donors.", website: "https://www.ncfgiving.com", type: "DAF Sponsor" },
    { name: "Jewish Communal Fund", description: "The largest Jewish donor-advised fund in the U.S., serving as a community foundation, and faciliating Jewish philanthropy.", website: "https://jcfny.org/", type: "DAF Sponsor" },
    { name: "Dechomai", description: "National DAF sponsor focused on supporting non-profits through non-cash donations via DAFs.", website: "https://dechomai.org/", type: "DAF Sponsor" },
    { name: "Ren", description: "White-labeled DAF technology provider", website: "https://www.reninc.com/", type: "Technology Platform" },
    { name: "Chariot", description: "API-first platform enabling financial advisors and wealth managers to integrate charitable giving and DAF services into their client offerings.", website: "https://www.givechariot.com/", type: "Technology Platform" },
    { name: "Freewill", description: "DAFpay software for DAF administration.", website: "https://www.nonprofits.freewill.com/products/donor-advised-funds", type: "Technology Platform" },
    { name: "CharityVest", description: "Technology platform that provides tech-enabled donor-advised funds (DAFs) for individuals, financial advisors, and workplaces", website: "https://www.charityvest.org/", type: "Technology Platform" },
    { name: "GivingTech", description: "Technology platform serving nonprofits with tech-enabled tools to support fundraising, and donor grant-making.", website: "https://givingtech.org", type: "Technology Platform" },
    { name: "Prime Coalition", description: "Catalytic funding organization facilitating climate impact investments through DAFs.", website: "https://primecoalition.org", type: "Impact Investment Advisor" },
    { name: "Social Finance", description: "Impact investment advisory firm with DAF impact investing solutions", website: "https://socialfinance.org", type: "Impact Investment Advisor" },
    { name: "Root Capital", description: "Non-profit investment fund accepting DAF grants for impact lending. Focus on agriculture.", website: "https://rootcapital.org", type: "Investment Vehicle" },
    { name: "Realize Impact", description: "Facilitates Philanthropic Investment Grants from any DAF into impact deals.", website: "https://realizeimpact.org", type: "Investment Intermediary" },
    { name: "CataCap", description: "Catalytic capital intermediary enabling DAF holders to make impact investments through donor accounts at ImpactAssets. Focus on collective giving strategies.", website: "https://www.catacap.org/", type: "Investment Intermediary" },
    { name: "MissionPoint Partners", description: "Impact investment manager and advisor focused on environmental issues.", website: "http://mppgrp.com/portfolio/", type: "Impact Investment Advisor" },
    { name: "Impact Charitable", description: "Diligencing, and term structuring platform for impact investments.", website: "https://impactcharitable.org/", type: "Impact Investment Advisor" },
    { name: "CapShift", description: "Sourcing and diligence platform for impact funds and recoverable grants for donors and advisors.", website: "https://capshift.com", type: "Investment Intermediary" },
    { name: "Upstart Co-Lab", description: "A multi-donor fund deploying philanthropic and investment capital to the creative-economy to drive social impact.", website: "https://upstartco-lab.org", type: "Investment Vehicle" },
    { name: "Solve Innovation Future", description: "MIT's DAF-structured investment vehicle deploying venture philanthropy through debt and equity investments", website: "https://solve.mit.edu/partner/sif", type: "Investment Vehicle" },
    { name: "Bioregional Facilities", description: "Bioregional Financing Facilities are increasingly using the DAF structure to support multi-stakeholder donors, and flexible giving and investment across bioregions.", website: "https://www.biofi.earth/", type: "Investment Vehicle" },
    { name: "Capital Access Lab", description: "Kauffman-funded pilot fund-of-funds initiative to find & fund underserved entrepreneurs.", website: "https://www.kauffman.org/capital-access-lab/", type: "Investment Vehicle" },
    { name: "Unlock Ownership Fund", description: "A fund focused on deploying DAF capital (as both investments and grants) towards the development of equitable asset ownership.", website: "https://unlockownership.org", type: "Investment Vehicle" },
    { name: "Collective Climate Justice Fund", description: "The Collective Climate Justice Fund (CCJF) unlocks donor advised fund capital to invest in a just energy transition. A community of learning and practice, they pool resources via a donor advised fund (DAF) to invest in impact-first renewable energy and climate justice companies, funds, and initiatives.", website: "https://www.ccjfund.net/", type: "Investment Vehicle" },
    { name: "Sea Forward Fund", description: "A multi-donor fund using philanthropic capital to invest in companies, funds and nonprofits supporting ocean health.", website: "https://www.seaforwardfund.org/", type: "Investment Vehicle" },
    { name: "Social Finance Impact First Fund", description: "A multi-donor fund engaging DAF capital in catalytic investments in early-stage funds, and enterprises.", website: "https://socialfinance.org/product/social-finance-impact-first-fund/", type: "Investment Vehicle" },
    { name: "Tertiary", description: "A loan guarantees platform to de-risk private investment in Sustainable Infrastructure Development projects.", website: "https://www.renaissancephilanthropy.org/tertiary-impact-capital", type: "Investment Vehicle" }
];

let ORGANIZATIONS = [];
let currentDirectoryFilter = 'all';
let searchQuery = '';

async function fetchOrganizations() {
    try {
        const { data, error } = await supabaseClient.from('organizations').select('*').order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return ORGANIZATIONS_FALLBACK;
    }
}

function renderDirectory() {
    const filtered = ORGANIZATIONS.filter(org => {
        const matchesFilter = currentDirectoryFilter === 'all' || org.type === currentDirectoryFilter;
        const matchesSearch = searchQuery === '' ||
            org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            org.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    document.getElementById('resultsCount').textContent = filtered.length + ' ' + (filtered.length === 1 ? 'organization' : 'organizations');

    const noResults = document.getElementById('noResults');
    const grid = document.getElementById('directoryGrid');

    if (filtered.length === 0) {
        noResults.style.display = 'block';
        grid.style.display = 'none';
        return;
    } else {
        noResults.style.display = 'none';
        grid.style.display = 'grid';
    }

    grid.innerHTML = '';
    filtered.forEach(org => {
        const card = document.createElement('div');
        card.className = 'org-card scroll-animate';

        const type = document.createElement('div');
        type.className = 'org-type';
        type.textContent = org.type;

        const name = document.createElement('h3');
        name.className = 'org-name';
        name.textContent = org.name;

        const desc = document.createElement('p');
        desc.className = 'org-description';
        desc.textContent = org.description;

        const link = document.createElement('a');
        link.className = 'org-link';
        link.href = org.website;
        link.target = '_blank';
        link.rel = 'noopener';
        link.textContent = 'Visit Website ';
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '→';
        link.appendChild(arrow);

        card.appendChild(type);
        card.appendChild(name);
        card.appendChild(desc);
        card.appendChild(link);
        grid.appendChild(card);
    });

    if (typeof initScrollAnimations === 'function') initScrollAnimations();
}

function filterDirectory(type) {
    currentDirectoryFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderDirectory();
}

function searchDirectory() {
    searchQuery = document.getElementById('searchInput').value;
    renderDirectory();
}

document.addEventListener('DOMContentLoaded', async () => {
    ORGANIZATIONS = await fetchOrganizations();
    renderDirectory();
});
