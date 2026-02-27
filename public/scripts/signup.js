// Home page email signup
document.getElementById('emailSignupForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('input[name="name"]');
    const emailInput = form.querySelector('input[name="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('emailSignupMessage');
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    submitButton.disabled = true;
    submitButton.textContent = 'Joining...';

    try {
        const { data, error } = await supabaseClient
            .from('email_signups')
            .insert([{ name: name, email: email, source: 'home_page', status: 'active' }])
            .select();

        if (error) {
            if (error.code === '23505') {
                messageDiv.className = 'message error';
                messageDiv.textContent = 'This email is already subscribed!';
            } else throw error;
        } else {
            messageDiv.className = 'message success';
            messageDiv.textContent = "Thanks for joining! We'll be in touch soon.";
            form.reset();
        }
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    } catch (error) {
        console.error('Error saving email:', error);
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Something went wrong. Please try again.';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Join Us';
    }
});

// Footer newsletter signup
document.getElementById('footerSignupForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[name="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('footerMessage');
    const email = emailInput.value.trim();

    submitButton.disabled = true;
    submitButton.textContent = 'Subscribing...';

    try {
        const { data, error } = await supabaseClient
            .from('email_signups')
            .insert([{ name: '', email: email, source: 'footer', status: 'active' }])
            .select();

        if (error) {
            if (error.code === '23505') {
                messageDiv.className = 'error';
                messageDiv.textContent = 'Already subscribed!';
            } else throw error;
        } else {
            messageDiv.className = 'success';
            messageDiv.textContent = "Subscribed! We'll be in touch.";
            form.reset();
        }
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    } catch (error) {
        console.error('Footer signup error:', error);
        messageDiv.className = 'error';
        messageDiv.textContent = 'Something went wrong. Please try again.';
        messageDiv.style.display = 'block';
        setTimeout(() => messageDiv.style.display = 'none', 5000);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Subscribe';
    }
});
