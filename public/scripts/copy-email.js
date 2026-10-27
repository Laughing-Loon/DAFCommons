// Click handler for "copy DAFCommons@gmail.com to clipboard" links.
// Targets any anchor with class `copy-email-link`. On click, prevents the
// default mailto: navigation, writes the email to the clipboard, and swaps
// the link text to a brief "Copied!" confirmation.
(function () {
    const EMAIL = 'DAFCommons@gmail.com';
    const CONFIRM_MS = 1800;

    function copy(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            return navigator.clipboard.writeText(text);
        }
        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            try {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.setAttribute('readonly', '');
                ta.style.position = 'absolute';
                ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    document.addEventListener('click', (e) => {
        const link = e.target.closest('a.copy-email-link');
        if (!link) return;
        e.preventDefault();
        const original = link.textContent;
        copy(EMAIL)
            .then(() => {
                link.textContent = 'Copied ✓ ' + EMAIL;
                link.classList.add('copied');
            })
            .catch(() => {
                // If clipboard fails, fall back to mailto
                window.location.href = link.getAttribute('href') || ('mailto:' + EMAIL);
            })
            .finally(() => {
                setTimeout(() => {
                    link.textContent = original;
                    link.classList.remove('copied');
                }, CONFIRM_MS);
            });
    });
})();
