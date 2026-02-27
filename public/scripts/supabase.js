// Supabase Configuration
const SUPABASE_URL = 'https://gkwbloqfhkpdtctsqqwk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrd2Jsb3FmaGtwZHRjdHNxcXdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1ODQ0NzEsImV4cCI6MjA4NjE2MDQ3MX0.K3sybXVSDvQ8pYcbcR7f9Bej5OlVtTnNBD0wpJ3Hwc8';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchSiteContent() {
    try {
        const { data, error } = await supabaseClient.from('site_content').select('*').order('display_order', { ascending: true });
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching site content:', error);
        return [];
    }
}

function loadPageContent(contentData) {
    const contentMap = {};
    contentData.forEach(item => { contentMap[item.content_key] = item.content; });

    document.querySelectorAll('[data-content]').forEach(element => {
        const key = element.getAttribute('data-content');
        if (contentMap[key]) {
            if (element.tagName === 'A' && key.includes('email')) {
                element.href = 'mailto:' + contentMap[key];
                element.textContent = contentMap[key];
            } else if (element.tagName === 'TITLE') {
                element.textContent = contentMap[key];
                document.title = contentMap[key];
            } else {
                element.textContent = contentMap[key];
            }
        }
    });

    document.querySelectorAll('[data-src]').forEach(element => {
        const key = element.getAttribute('data-src');
        if (contentMap[key]) {
            element.src = contentMap[key];
            const nameKey = key.replace('_photo', '_name');
            if (contentMap[nameKey]) element.alt = contentMap[nameKey];
        }
    });

    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (contentMap[key]) element.placeholder = contentMap[key];
    });
}

// Initialize on every page
document.addEventListener('DOMContentLoaded', async () => {
    const siteContent = await fetchSiteContent();
    loadPageContent(siteContent);
});
