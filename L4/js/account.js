const serviceUrl = 'https://script.google.com/macros/s/AKfycbwWRwbbb8J0jj1JevTNiO7OtDP2gRpxDkQ48oUdRzbt/dev';
const testToken = 'rnyOnmSASYmKrqivhdj96JvbUzLSFtEL';

function getData() {

    fetch(serviceUrl)
        .then(response => {
            if (response.ok) {
                return response.text();
            }
        })
        .then(data => {
            setToken(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function setToken(token) {
    // Get a reference to the signup form
    const msg = document.getElementById('messageBox');
    const hdn = document.getElementById('token');

    if (msg != null) {
        msg.innerHTML = `Token: ${token}`;
    }
    if (hdn != null) {
        hdn.value = token;
    }
}

// Call the function to fetch data
setToken(testToken);
console.log(testToken);
//getData();


///////////////////////////////////

// Get a reference to the signup form
const signinForm = document.getElementById('signinForm');
const messageBox = document.getElementById('messageBox');

/**
 * Displays a message box with the given message and type.
 * @param {string} message - The message to display.
 * @param {'success'|'error'} type - The type of message ('success' or 'error').
 */
function showMessageBox(message, type) {
    messageBox.textContent = message;
    messageBox.className = 'l4-message-box'; // Reset classes
    messageBox.classList.add(type);
    messageBox.style.display = 'block';

    // Hide the message box after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 60000);
}

let deferredPrompt;
const a2hsPrompt = document.getElementById('a2hs-prompt');
const a2hsButton = document.getElementById('a2hs-button');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Show the custom A2HS prompt
    a2hsPrompt.classList.remove('hidden');
});

// Add click listener to the custom A2HS button
a2hsButton.addEventListener('click', async () => {
    // Hide the custom A2HS prompt
    a2hsPrompt.classList.add('hidden');
    // Show the browser's install prompt
    if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // Log the outcome (e.g., 'accepted' or 'dismissed')
        console.log(`User response to the install prompt: ${outcome}`);
        // Clear the deferredPrompt variable as it can only be used once
        deferredPrompt = null;
    }
});

// Optional: Listen for appinstalled event
window.addEventListener('appinstalled', () => {
    console.log('PWA was installed!');
    // You might want to hide the prompt permanently or show a success message
    a2hsPrompt.classList.add('hidden');
});

// Add event listener for form submission
signinForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get input values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        showMessageBox('Account created successfully! User data saved in cookie.', 'success');

        // Optionally, clear the form after successful submission
        signinForm.reset();

    } catch (error) {
        console.error('Error during signin:', error);
        showMessageBox('An error occurred during sign in. Please try again.', 'error');
    }
});

/////////////////////////////////////
// Get a reference to the signup form
const signupForm = document.getElementById('signupForm');

/**
 * Hashes a string using SHA-256.
 * @param {string} message - The string to hash.
 * @returns {Promise<string>} - A promise that resolves with the hexadecimal hash.
 */
async function hashString(message) {
    const textEncoder = new TextEncoder();
    const data = textEncoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hexHash;
}

// Add event listener for form submission
signupForm.addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Basic validation
    if (password !== confirmPassword) {
        showMessageBox('Passwords do not match.', 'error');
        return;
    }

    // Hash the password
    // IMPORTANT: Storing password hashes directly in client-side cookies is generally
    // NOT recommended for production environments due to security risks.
    // In a real application, password hashing and user authentication should be
    // handled securely on the server-side. This is for demonstration purposes only.
    try {
        const hashedPassword = await hashString(password);

        // Create a user object
        const userData = {
            name: name,
            email: email,
            passwordHash: hashedPassword // Store the hash, not the plain password
        };

        // Convert user data to a JSON string
        const userDataJson = JSON.stringify(userData);

        // Set a cookie with user information
        // For demonstration, setting a cookie that expires in 7 days.
        // In a real scenario, you'd send this data to a server for registration.
        const d = new Date();
        d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days
        let expires = "expires=" + d.toUTCString();
        document.cookie = `user_data=${encodeURIComponent(userDataJson)}; ${expires}; path=/; Secure; SameSite=Lax`;

        showMessageBox('Account created successfully! User data saved in cookie.', 'success');

        // Optionally, clear the form after successful submission
        signupForm.reset();

    } catch (error) {
        console.error('Error during signup:', error);
        showMessageBox('An error occurred during sign up. Please try again.', 'error');
    }
});
