// Get a reference to each of the pages
const mainpg = document.getElementById('main-container');
const signin = document.getElementById('signin-form');
const forgot = document.getElementById('forgotpwd-form');
const user_name = document.getElementById("user_name");

function isAuth() {

    try {
        const username = document.getElementById('user_name');
        const userstatus = document.getElementById('user_status');
        const token = window.localStorage.getItem("userToken");

        if (token != null) {
            username.textContent = window.localStorage.getItem("username");
            username.style.display = 'block';
            userstatus.textContent = "Sign Off"
            userstatus.onclick = changePage('signoff');
        } else {
            username.textContent = "";
            username.style.display = 'none';
            userstatus.textContent = "Sign On"
            userstatus.onclick = changePage('signon');
        }

    }
    catch (ex) {
        console.log(ex);
    }
}

// Add event listener for a link
function changePage(pagename) {
    this.event.preventDefault();
    console.log("Page Name: ", pagename);

    if (pagename == 'signon') {
        pagename = 'signin';

        try {
            window.localStorage.setItem("userToken", "20250603-XXX");
        }
        catch (ex) {
            console.log(ex);
        }
    }

    if (pagename == 'signoff') {
        pagename = 'signin';

        try {
            window.localStorage.removeItem("userToken");
            window.localStorage.removeItem("username");
        }
        catch (ex) {
            console.log(ex);
        }
    }

    if (pagename == 'home') {
        mainpg.style.display = "block";
    } else {
        mainpg.style.display = "none";
    }

    if (pagename == 'signin') {
        signin.style.display = "block";
    } else {
        signin.style.display = "none";
    }
    
    toggleSignUp(pagename);
    
    if (pagename == 'forgotpwd') {
        forgot.style.display = "block";
    } else {
        forgot.style.display = "none";
    }
}

function toggleSignUp(name) {
    const signup = document.getElementById('signup-form');
    console.log("Executing toggle method");

    if (name == 'signup') {

        signup.style.display = "block";
        let signupForm = document.forms['signup'];
        const token = window.localStorage.getItem("userToken");
        signupForm['token'].value = token;
        signupForm.addEventListener('submit', signOnHandler, true);

    } else {

        let signupForm = document.forms['signup'];
        signupForm.removeEventListener('submit', signOnHandler, true);
        signup.style.display = "none";
    }

}

function signOnHandler(event) {
    console.log("Excuting handler method");
    // Prevent the default form submission behavior
    event.preventDefault();
    const frm = this;
    let password = "";
    let confirmPassword = "";

    if (frm != null && frm.elements != null) {
        console.log(`Listing fields: ${frm.elements.length}`);

        for (let i=0; i < frm.elements.length-1; i++) {
            const field = frm.elements[i];
            if (field != null && field.name != null) {
                console.log(i, field.name, field.value);
                if (field.name == 'password') {
                    password = field.value;
                }
                if (field.name == 'confirm-password') {
                    confirmPassword = field.value;
                }
            }
        }
    }

    console.log(`Password: ${password} Confirm Password: ${confirmPassword}`);
    
    // Basic validation
    if (password !== confirmPassword) {
        const txt = document.getElementById('reg-confirm-password');
        txt.addEventListener('blur', () => { txt.setCustomValidity(""); });
        txt.setCustomValidity("Does NOT match Password.");
        txt.reportValidity();
    } else {
        changePage('signin');
    }
}