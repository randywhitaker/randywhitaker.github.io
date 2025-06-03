// Get a reference to each of the pages
const mainpg = document.getElementById('main-container');
const signin = document.getElementById('signin-form');
const signup = document.getElementById('signup-form');
const forgot = document.getElementById('forgotpwd-form');

// Add event listener for a link
function changePage(pagename) {

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
    
    if (pagename == 'signup') {
        signup.style.display = "block";
    } else {
        signup.style.display = "none";
    }
    
    if (pagename == 'forgotpwd') {
        forgot.style.display = "block";
    } else {
        forgot.style.display = "none";
    }
}
