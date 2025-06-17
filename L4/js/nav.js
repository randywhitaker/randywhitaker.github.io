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

    if (pagename == 'dropdownmenu') {
        const menu = document.getElementById("menu-dropdown-content");
        if (menu != null && menu.style != null) {
            let currentState = menu.style.display;

            if (currentState == '') {
                menu.style.display = "block";
            } else if (currentState == 'none') {
                menu.style.display = "block";
            } else {
                menu.style.display = "none";
            }
        }
    }
}

function toggleReport(name) {
    const panel = document.getElementById(name);
    const menu = document.getElementById("menu-dropdown-content");
    if (menu != null && menu.style != null) {
        menu.style.display = "none";
    }

    switch (name) {
        case 'listing_form':
            document.title = "Listing Info";
            break;
        case 'offer_form':
            document.title = "Offer Info";
            break;
        case 'gt_rural_form':
            document.title = "Rural Acreage";
            break;
        default:
            document.title = "Property App";
    }

    if (panel != null && panel.style != null) {
        let currentState = panel.style.display;
        let panelForm = document.forms[name];
        //console.log(`Name: ${name} Display Value: '${panel.style.display}' Panel Form:`, panelForm);

        if (currentState == '') {
            resetReports();
            panel.style.display = "block";
            panelForm.addEventListener('submit', (event) => { formDataHandler(event, panelForm) } , true);
        } else if (currentState == 'none') {
            resetReports();
            panel.style.display = "block";
            panelForm.addEventListener('submit', (event) => { formDataHandler(event, panelForm) } , true);
        } else {
            panelForm.removeEventListener('submit', (event) => { formDataHandler(event, panelForm) } , true);
            document.getElementById('main-container').style.display = "block";
            panel.style.display = "none";
        }
    }
}

function resetReports() {
    document.getElementById("menu-dropdown-content").style.display = "none";
    document.getElementById("listing_form").style.display = "none";
    document.getElementById("offer_form").style.display = "none";
    document.getElementById("gt_rural_form").style.display = "none";
    document.getElementById("gt_residential_form").style.display = "none";
    document.getElementById("gt_multifamily_form").style.display = "none";
    document.getElementById("gt_lots_form").style.display = "none";
    document.getElementById("gt_farm_form").style.display = "none";
    document.getElementById("gt_commercial_form").style.display = "none";
    document.getElementById("lv_farm_form").style.display = "none";
    document.getElementById("lv_land_form").style.display = "none";
    document.getElementById("lv_commercial_form").style.display = "none";
    document.getElementById("lv_multifamily_form").style.display = "none";
    document.getElementById("lv_residential_form").style.display = "none";
}
function toggleMenuItems() {
    try {
        const status = window.localStorage.getItem("name_active");
        const btnSignOff = document.getElementById('btnSignOff');
        const btnSignOn = document.getElementById('btnSignOn');
        const signOnName = document.getElementById('signon_name');
        const btnMenu = document.getElementById('btnMenu');

        if (status == 'true') {     
            btnSignOn.style.display = 'none';
            btnSignOff.style.display = 'block';
            signOnName.style.display = 'block';
            btnMenu.style.display = 'block';
            signOnName.textContent = window.localStorage.getItem("name");
            
        } else {
            btnSignOn.style.display = 'block';
            btnSignOff.style.display = 'none';
            signOnName.textContent = "";
            signOnName.style.display = 'none';
            btnMenu.style.display = 'none'
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
                window.localStorage.setItem("appToken", "L4-beta-20250608");
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

        const btnMenu = document.getElementById('btnMenu');
        btnMenu.style.display = 'none'

        changePage('home');
    }
    catch (ex) {
        console.log('Error signing off:', ex);
    }
}


function requiredCheckbox(form_name) {
    let frm = document.forms[form_name];
    let validationStatus = true;
 
    const groups = frm.querySelectorAll('div.require-checkbox');
    if (groups != null && groups.length > 0) {

        for (let i=0; i < groups.length-1; i++) {
            const item = groups[i];

            let req_name = "Unknown";
            let lbls = item.querySelectorAll('label > span.red_asterisk');
            if (lbls != null && lbls.length > 0) {
                req_name = lbls[0].parentElement.textContent;
                //console.log(`element: ${req_name}`);
            }

            const chks = item.querySelectorAll('input[type="checkbox"]');
            if (chks != null && chks.length > 0) {

                let hasOneChecked = false;
                chks.forEach((chk) => {
                    if (chk.checked == true) {
                        hasOneChecked = true;
                    }
                    //console.log(`input: ${chk.name}`, chk.checked);
                })

                if (hasOneChecked == true) {
                    //console.log("*** Valid ***");
                    continue;
                } else {
                    let p = document.createElement("p");
                    p.style.color = "red";
                    p.style.padding = '15px';
                    p.style.border = '1px solid red';
                    p.id='requireMessage';
                    p.innerHTML = `Atleaset one item must be checked on *${req_name}** before saving data`;
                    item.addEventListener('click', () => {
                        const p_msg = document.getElementById('requireMessage');
                        p_msg.remove();
                    }, { once: true });
                    item.append(p);
                    item.focus();
                    item.scrollIntoView({ behavior: 'smooth', block: 'center'});
                    validationStatus = false;
                    break;
                }
            }

        }
    }

    return validationStatus;
}

function formDataHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (requiredCheckbox(frm.name) == true) {

        if (frm != null && frm.elements != null) {
            let formData = [];
            const submittedDate = Date(Date.UTC());
            const user_name = window.localStorage.getItem("name");

            for (let i=0; i < frm.elements.length-1; i++) {
                const field = frm.elements[i];

                if (field != null && field.name != null) {
                    formData.push({ "submitted": submittedDate, "owner": user_name, "form_name": frm.name, "field_order": i, "field_name": field.name, "field_value": field.value });
                }
            }
            // Optionally, clear the form after successful submission
            //frm.reset();

            storeReportData(formData);

            let print_address = "";
            let print_title = "Missing";

            if (frm.name == 'listing_form') {
                print_title = "Listing Info";

                const lst_address = document.getElementById("listing_property_address");
                if (lst_address != null) {
                    console.log(`${print_title} ${lst_address.value}`);
                    print_address = lst_address.value;
                }
                document.title = `${print_title} ${print_address}`;
                window.print();

            } else if (frm.name == 'offer_form') {
                print_title = "Offer Info";

                const lst_address = document.getElementById("offer_property_address");
                if (lst_address != null) {
                    console.log(`${print_title} ${lst_address.value}`);
                    print_address = lst_address.value;
                }
                document.title = `${print_title} ${print_address}`;
                window.print();

            } else if (frm.name == 'gt_rural_form') {
                print_title = "Rural Acreage";

                const lst_address = document.getElementById("gt_rural_address");
                if (lst_address != null) {
                    console.log(`${print_title} ${lst_address.value}`);
                    print_address = lst_address.value;
                }
                document.title = `${print_title} ${print_address}`;
                window.print();

            } else {
                document.title = "Property App";
            }

            toggleMessagePanel('msgpanel', `Updated page title: ${print_title} ${print_address}`);
            //console.log("DB Storeage", formData);
        }

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

let db;
let activeIndex;
const OBJECT_STORE_NAME = "propertylistings";
openDb();

function openDb() {
    console.log("Opening database...");
    const dbreq = window.indexedDB.open("L4PropertiesListing", 1);

    dbreq.onsuccess = function (event) {
        db = dbreq.result;
        console.log("Database is opened!");
    }

    dbreq.onerror = function (event) {
        console.error("openDb", event.target.errorCode);
    }

    dbreq.onupgradeneeded = function (event) {
        //console.log("openDb.onupgradeneeded...");
        const dbx = event.currentTarget.result;

        let store = dbx.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });
        //store.createIndex("owner", { unique: false });
        //store.createIndex("form_name", "form_name", { unique: false });
        //store.createIndex("submitted", { unique: false });
    }
}

/**
 * @param (string) store_name
 * @param (string) mode either "readonly" or "readwrite"
 */
function getObjectStore(store_name, mode) {
    let tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function storeReportData(formData) {

    try {
        
        //console.log("fetching object store now...");

        if (db != null && db.transaction != null) {
            let tx = db.transaction(OBJECT_STORE_NAME, "readwrite");
            //console.log("We have a database transaction now!");

            let propObjectStore = tx.objectStore(OBJECT_STORE_NAME);
            propObjectStore.add(formData);
        }
    }
    catch (ex) {
        console.log('Error saving form data into database:', ex);
    }

    //toggleMessagePanel('msgpanel', JSON.stringify(formData));
    toggleMessagePanel('msgpanel', "All data saved!");
}