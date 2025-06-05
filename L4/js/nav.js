toggleMenuItems();

// Handle page changes
function changePage(pagename) {
    // Prevent the default behavior
    if (this.event != null) {
        this.event.preventDefault();
    }

    toggleMenuItems();
    toggleMainPanel(pagename);
    toggleSignOn(pagename);
    toggleSignUp(pagename);
    toggleForgotPassword(pagename);
    toggleMessagePanel(pagename);

    if (pagename == 'signoff') {
        signOffHandler();
    }

    if (pagename.includes('_form')) {
        toggleReport(pagename);
    }
}

function toggleReport(name) {
    const panel = document.getElementById(name);

    if (panel != null && panel.style != null) {
        let currentState = panel.style.display;
        console.log(`${name}: current display value "${panel.style.display}"`);

        if (currentState == '') {
            panel.style.display = "block";
        } else if (currentState == 'none') {
            panel.style.display = "block";
        } else {
            panel.style.display = "none";
        }
    }
}

function toggleMenuItems() {
    try {
        const status = window.localStorage.getItem("name_active");
        const btnSignOff = document.getElementById('btnSignOff');
        const btnSignOn = document.getElementById('btnSignOn');
        const signOnName = document.getElementById('signon_name');

        if (status == 'true') {     
            btnSignOn.style.display = 'none';
            btnSignOff.style.display = 'block';
            signOnName.style.display = 'block';
            signOnName.textContent = window.localStorage.getItem("name");
            
        } else {
            btnSignOn.style.display = 'block';
            btnSignOff.style.display = 'none';
            signOnName.textContent = "";
            signOnName.style.display = 'none';
        }
    }
    catch (ex) {
        console.log(`Error when setting menus: ${ex.message}`);
    }
}

function toggleMessagePanel(name, message) {
    const msgpanel = document.getElementById('message-panel');

    if (name == 'msgpanel' && message != null) {
        msgpanel.style.display = "block";
        msgpanel.innerHTML = message;
    } else {
        msgpanel.innerHTML = "";
        msgpanel.style.display = "none";
    }

}
function toggleMainPanel(name) {
    const mainpanel = document.getElementById('main-container');

    if (name == 'home') {
        mainpanel.style.display = "block";
    } else {
        mainpanel.style.display = "none";
    }

}

function toggleForgotPassword(name) {
    const forgotpwd = document.getElementById('forgotpwd-form');

    if (name == 'forgotpwd') {
        forgotpwd.style.display = "block";
        let forgotpwdForm = document.forms['forgotpwd'];
        forgotpwdForm.addEventListener('submit', (event) => { forgotpwdHandler(event, forgotpwdForm) } , true);

    } else {

        let forgotpwdForm = document.forms['forgotpwd'];
        forgotpwdForm.removeEventListener('submit', (event) => { forgotpwdHandler(event, forgotpwdForm) } , true);
        forgotpwd.style.display = "none";
    }

}

function toggleSignOn(name) {
    const signon = document.getElementById('signon-form');

    if (name == 'signon') {
        signon.style.display = "block";
        let signonForm = document.forms['signon'];
        signonForm.addEventListener('submit', async (event) => { await signOnHandler(event, signonForm) } , true);

    } else {

        let signonForm = document.forms['signon'];
        signonForm.removeEventListener('submit', async (event) => { await signOnHandler(event, signonForm) } , true);
        signon.style.display = "none";
    }

}

function toggleSignUp(name) {
    //console.log("Executing SignUp toggle method");
    const signup = document.getElementById('signup-form');

    if (name == 'signup') {
        signup.style.display = "block";
        let signupForm = document.forms['signup'];
        signupForm.addEventListener('submit', async (event) => { await signUpHandler(event, signupForm) } , true);

    } else {

        let signupForm = document.forms['signup'];
        signupForm.removeEventListener('submit', async (event) => { await signUpHandler(event, signupForm) } , true);
        signup.style.display = "none";
    }

}

async function signOnHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (frm != null && frm.elements != null) {
        let validemail = false;
        let validhash = false;

        for (let i=0; i < frm.elements.length-1; i++) {
            const field = frm.elements[i];

            if (field != null && field.name != null) {

                 if (field.name == 'email') {
                    const email = window.localStorage.getItem("email");
                    validemail = (field.value == email);
                 }

                 if (field.name == 'password') {
                    try {
                        let hashed = field.value;
                        hashed = await hashString(hashed);
                        const hashedcode = window.localStorage.getItem("hashedcode");
                        validhash = (hashedcode == hashed);
                    }
                    catch (ex) {
                        console.log(`Error checking: ${field.name}: ${field.value} Error Message: ${ex.message}`);
                    }
                 }
            }
        }

        // Basic validation
        if (validemail == false || validhash == false) {
            const txt = document.getElementById('sgn-password');
            txt.addEventListener('keydown', () => { txt.setCustomValidity(""); });
            txt.setCustomValidity("You have entered an invalid email or password");
            txt.reportValidity();

        } else {
            try {
                window.localStorage.setItem("name_active", 'true');
            }
            catch (ex) {
                console.log(`Error updating storage: ${ex.message}`);
            }
            
            const btnSignOn = document.getElementById('btnSignOn');
            btnSignOn.style.display = 'none';

            const signOnName = document.getElementById('signon_name');
            signOnName.textContent = window.localStorage.getItem("name");
            signOnName.style.display = 'block';

            const btnSignOff = document.getElementById('btnSignOff');
            btnSignOff.style.display = 'block';

            // Optionally, clear the form after successful submission
            frm.reset();
            changePage('home');
        }
    } 
}

async function signUpHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (frm != null && frm.elements != null) {
        let password = "";
        let confirmPassword = "";
        let hashedcode = "";

        for (let i=0; i < frm.elements.length-1; i++) {
            const field = frm.elements[i];

            if (field != null && field.name != null) {

                try {
                    if (field.name == 'password') {
                        password = field.value;
                    }

                    if (field.name == 'confirm-password') {
                        confirmPassword = field.value;
                    }

                    if (field.name == 'name') {
                        window.localStorage.setItem("name", field.value);
                    }

                    if (field.name == 'email') {
                        window.localStorage.setItem("email", field.value);
                    }

                }
                catch (ex) {
                    console.log(`Error saving: ${field.name}: ${field.value} Error Message: ${ex.message}`);
                }
            }
        }
        
        // Basic validation
        if (password !== confirmPassword) {
            const txt = document.getElementById('reg-confirm-password');
            txt.addEventListener('keydown', () => { txt.setCustomValidity(""); });
            txt.setCustomValidity("Does NOT match Password.");
            txt.reportValidity();

        } else {

            try {
                hashedcode = await hashString(password);
                window.localStorage.setItem("hashedcode", hashedcode);
            }
            catch (ex) {
                console.log(`Error saving hash: ${hashedcode} Error Message: ${ex.message}`);
            }

            // Optionally, clear the form after successful submission
            frm.reset();
            changePage('signon');
        }
    }
}

function forgotpwdHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (frm != null && frm.elements != null) {
        let validemail = false;
        const field = frm.elements[0];

        if (field != null && field.name != null) {

            if (field.name == 'email') {
                const email = window.localStorage.getItem("email");
                validemail = (field.value == email);
            }
        }

        // Basic validation
        if (validemail == false) {
            const txt = document.getElementById('fgp-email');
            txt.addEventListener('keydown', () => { txt.setCustomValidity(""); });
            txt.setCustomValidity("Email entered is not same as when registered");
            txt.reportValidity();
        } else {
            // Optionally, clear the form after successful submission
            frm.reset();
            document.getElementById('forgotpwd-form').style.display = "none";
            toggleMessagePanel('msgpanel', `<h2>Change Password Request Sent</h2><p>Please check your email: ${field.value} in order to change your password.<br>This change request is only good for the next hour</p>`);
        }
    }
}

function signOffHandler() {
    try {
        window.localStorage.setItem("name_active", 'false');

        const btnSignOn = document.getElementById('btnSignOn');
        btnSignOn.style.display = 'block';

        const signOnName = document.getElementById('signon_name');
        signOnName.textContent = "";
        signOnName.style.display = 'none';

        const btnSignOff = document.getElementById('btnSignOff');
        btnSignOff.style.display = 'none';

        changePage('home');
    }
    catch (ex) {
        console.log('Error signing off:', ex);
    }
}

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
