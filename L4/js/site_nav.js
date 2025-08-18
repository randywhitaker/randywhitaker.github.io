const site_nav_bar = [
    {"menu-group": "Henderson Area", "description": "Henderson Association of Relator information sheets", "items": [
        { "label": "Listing Information", "content": "l4_listing.html" },
        { "label": "Offer Information", "content": "l4_offer.html" }
    ] },
    {"menu-group": "Tyler Area", "description": "Greater Tyler Association of Relator information sheets", "items": [
        { "label": "Residential Data", "content": "gt_residential.html" },
        { "label": "Rural Acreage Data", "content": "gt_rural_acreage.html" },
        { "label": "Lots Data", "content": "gt_lots.html" },
        { "label": "Commercial Data", "content": "gt_commercial.html" },
        { "label": "Multi-Family Data", "content": "gt_multifamily.html" },
        { "label": "Farm and Ranch Data", "content": "gt_farm_ranch.html" }
    ] },
    {"menu-group": "Longview Area", "description": "Longview Area Association of Realtors information sheets", "items": [
        { "label": "Residential Data", "content": "lv_residential.html" },
        { "label": "Land Data", "content": "lv_land.html" },
        { "label": "MLS - LAAR Commercial Data", "content": "lv_commercial.html" },
        { "label": "MLS - LAAR Multi-Family Data", "content": "lv_multifamily.html" },
        { "label": "Farm and Ranch Data", "content": "lv_farm_ranch.html" }
    ] }
];

// Application Menu
class SiteMenu extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this._updateRendering();
    }

    _updateRendering() {
        let menuBar = '<nav>'
        site_nav_bar.forEach(grp => {
            menuBar += `<h4>${grp["menu-group"]}</h4><ul>`;
            grp.items.forEach(itm => {
                menuBar += `<li onclick="changePage('${itm.content}')">${itm.label}</li>`;
            })
            menuBar += '</ul>';
        });
        menuBar += '</nav>'
        this.innerHTML = menuBar;
    }
}

window.customElements.define("site-menu", SiteMenu);

// Class for handling logon status element functions
class LogOnStatus extends HTMLElement {
    static observedAttributes = ["status"];

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._activeUser = findInfo();
    }

    get collapsed() {
        return this._internals.states.has("hidden");
    }
    set collapsed(flag) {
        if (flag) {
            // Existence of identifier corresponds to "true"
            this._internals.states.add("hidden");
        } else {
            // Absence of identifier corresponds to "false"
            this._internals.states.delete("hidden");
        }
    }

    connectedCallback() {
        this._updateRendering();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "status") {
            this._activeUser = newValue;
            this._updateRendering();
        }
    }

    _updateRendering() {
        changePage("ap_landing.html");
    
        if (this._activeUser != null) {
            this.innerHTML = `<span>${this._activeUser}&nbsp;&nbsp;</span>
            <div class="dropdown-menu">
                <button class="dropbtn" onclick="showMenuPanel()"><span class="material-icons">menu</span></button>
                <div id="menu-dropdown-content" class="dropdown-content">
                    <label>Henderson Area</label>
                    <li onclick="changePage('l4_listing.html')">Listing Information</li>
                    <li onclick="changePage('l4_offer.html')">Offer Information</li>
                    <label>Tyler Area</label>
                    <li onclick="changePage('gt_residential.html')">Residential Data</li>
                    <li onclick="changePage('gt_rural_acreage.html')">Rural Acreage Data</li>
                    <li onclick="changePage('gt_lots.html')">Lots Data</li>
                    <li onclick="changePage('gt_commercial.html')">Commercial Data</li>
                    <li onclick="changePage('gt_multifamily.html')">Multi-Family Data</li>
                    <li onclick="changePage('gt_farm_ranch.html')">Farm and Ranch Data</li>
                    <label>Longview Area</label>
                    <li onclick="changePage('lv_residential.html')">Residential Data</li>
                    <li onclick="changePage('lv_land.html')">Land Data</li>
                    <li onclick="changePage('lv_commercial.html')">MLS - LAAR Commercial Data</li>
                    <li onclick="changePage('lv_multifamily.html')">MLS - LAAR Multi-Family Data</li>
                    <li onclick="changePage('lv_farm_ranch.html')">Farm and Ranch Data</li>
                </div>
            </div>
            <button onclick="signOffHandler()">Sign Off</button>`;
        } else {
            this.innerHTML = `<button onclick="changePage('ap_signon.html')">Sign On</button>`;
        }
    }
}

window.customElements.define("logon-status", LogOnStatus);

function findInfo() {
    const ls = document.querySelector('logon-status');
    let acct = window.localStorage.getItem("name_active");

    if (acct != null && acct === 'true') {
        let name = window.localStorage.getItem("name");
        
        if (ls != null) {
            ls.setAttribute("status", name);
            return name;
        }
    }

    return null;
}

// initial state and default values
function changePage(page) {
    // Prevent the default behavior
    if (this.event != null) {
        this.event.preventDefault();
    }

    const menu = document.getElementById("menu-dropdown-content");
    if (menu != null && menu.style != null) {
        menu.style.display = "none";
    }

    if (page == 'ap_signon.html') {
        window.localStorage.setItem("name_active", 'true');
    }

    if (page != null && page.substring(0, 2) === "gt") {
        let frmName = page.replace('.html','').toLowerCase();
        let frmTitle = page.replace('gt_','').replace('.html','').replace('_',' ').toUpperCase();

        document.getElementById("content").innerHTML = `<div id="${frmName}">
            <gt-header src="images/Greater_Tyler_logo.png" name="${frmTitle}"></gt-header>
            <!--<h1>${page} :: ${frmName} :: ${frmTitle}</h1>-->
            <form name="${frmName}" class="frm">
                <gt-page name="${frmName}"></gt-page>
                <div>
                    <br>
                    <!--<button type="button" onclick="requiredCheckbox('${frmName}')">Test Required checkbox</button>&nbsp;&nbsp;&nbsp;-->
                    <button type="submit">
                        Save/Print
                    </button>
                </div>
            </form>
        </div>`;
        let frm = document.forms[frmName];
        frm.addEventListener('submit', (event) => { formDataHandler(event, frm) } , true);


    } else if (page != null && page.substring(0, 2) === "lv") {
        let frmName = page.replace('.html','').toLowerCase();
        let frmTitle = page.replace('lv_','').replace('.html','').replace('_',' ').toUpperCase();

        document.getElementById("content").innerHTML = `<div id="${frmName}">
            <lv-header src="images/longview_logo.png" name="${frmTitle}"></lv-header>
            <!--<h1>${page} :: ${frmName} :: ${frmTitle}</h1>-->
            <form name="${frmName}" class="frm">
                <lv-page name="${frmName}"></lv-page>
                <div>
                    <br>
                    <!--<button type="button" onclick="requiredCheckbox('${frmName}')">Test Required checkbox</button>&nbsp;&nbsp;&nbsp;-->
                    <button type="submit">
                        Save/Print
                    </button>
                </div>
            </form>
        </div>`;
        let frm = document.forms[frmName];
        frm.addEventListener('submit', (event) => { formDataHandler(event, frm) } , true);

    } else {
        // If not cached, fetch the page
        fetch('../' + page)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById("content").innerHTML = html;
            addSubmitHandler(page);
        })
        .catch(error => {
            document.getElementById("content").innerHTML = "<p>Sorry, the page could not be loaded.</p>";
            console.log(error);
        });
    }
}

/* Handle dropdown menu request */ 
function showMenuPanel() {
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

function addSubmitHandler(page) {

    try {

        if (page == 'ap_signup.html') {
            let frm = document.forms['signup'];
            frm.addEventListener('submit', async (event) => { await signUpHandler(event, frm) } , true);
        } else if (page == 'ap_forgotpwd.html') {
            let frm = document.forms['forgotpwd'];
            frm.addEventListener('submit', async (event) => { forgotpwdHandler(event, frm) } , true);
        } else if (page == 'ap_signon.html') {
            let frm = document.forms['signon'];
            frm.addEventListener('submit', async (event) => { await signOnHandler(event, frm) } , true);
        } else if (page == 'l4_listing.html') {
            let frm = document.forms['listing_form'];
            frm.addEventListener('submit', (event) => { formDataHandler(event, frm) } , true);
        } else if (page == 'l4_offer.html') {
            let frm = document.forms['offer_form'];
            frm.addEventListener('submit', (event) => { formDataHandler(event, frm) } , true);
        }

    } catch (error) {
        const msg = document.createElement('p');
        msg.innerHTML = "Unable to setup the events on this page: '" + page + "'";
        document.getElementById("content").appendChild(msg);
        console.log(error);
    }
}

async function signUpHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    if (frm != null && frm.elements != null) {
        let fullname = "";
        let emailaddress = "";
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
                        fullname = field.value;
                    }

                    if (field.name == 'email') {
                        emailaddress = field.value;
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
                window.localStorage.setItem("name", fullname);
                window.localStorage.setItem("email", emailaddress);
                window.localStorage.setItem("appToken", "L4-beta-20250608");
            }
            catch (ex) {
                console.log(`Error saving hash: ${hashedcode} Error Message: ${ex.message}`);
            }

            // Optionally, clear the form after successful submission
            frm.reset();
            changePage('ap_signon.html')
        }
    }
}

async function signOnHandler(event, frm) {
    // Prevent the default form submission behavior
    event.preventDefault();

    const ls = document.querySelector('logon-status');
    if (ls != null && ls.hasAttribute("status")) {
        ls.removeAttribute("status");
    }

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

            if (ls != null) {
                let name = window.localStorage.getItem("name");
                ls.setAttribute("status", name);
            }

            // Optionally, clear the form after successful submission
            frm.reset();
            changePage('ap_landing.html')
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
            document.getElementById("content").innerHTML = `<h2>Change Password Request Sent</h2><p>Please check your email: ${field.value} in order to change your password.<br>This change request is only good for the next hour</p>`;
        }
    }
}

function signOffHandler() {

    try {
        window.localStorage.setItem("name_active", 'false');

        const ls = document.querySelector('logon-status');
        if (ls != null && ls.hasAttribute("status")) {
            ls.removeAttribute("status");
        }

        document.getElementById("content").innerHTML = "";
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

            //storeReportData(formData);
            setTimeout(function() { window.print(); }, 6000);
            //console.log("DB Storeage", formData);
        }

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
            }

            const chks = item.querySelectorAll('input[type="checkbox"]');
            if (chks != null && chks.length > 0) {

                let hasOneChecked = false;
                chks.forEach((chk) => {
                    if (chk.checked == true) {
                        hasOneChecked = true;
                    }
                })

                if (hasOneChecked == true) {
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

/* Longview MLS report custom elements */
class lvMlsPageHeader extends HTMLElement { 
    static observedAttributes = ["src", "name"];

    constructor() {
        super();
        this._logoUrl = null;
        this._name = null;
    }

    connectedCallback() {
        this._updateRendering();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "src") {
            this._logoUrl = newValue;
            this._updateRendering();
        } else if (name === "name") {
            this._name = newValue;
            this._updateRendering();
        }
    }

    _updateRendering() {
        this.innerHTML = `
<header class="longview-header">
    <div>
        <img src="${this._logoUrl}" width="150px" alt="report logo">
    </div>
    <div class="longview-title">
        <label>
            <strong>
            Multiple Listing Services of the <br>
            Longview Area Association of REALTORS&#174;<br>
            ${this._name} Data Form
            </strong>
        </label><br>
        <small>Fields marked with an asterisk (<span class="red_asterisk">*</span>) and <strong>Bold Text</strong> are required.</small>
    </div>
    <div class="longview-mls">
        <label>MLS #:</label>
        <input type="text" name="mls_number">
    </div>
</header>`;

    }
}

class MlsStandardSection extends HTMLElement {
    static observedAttributes = ["name"];

    constructor() {
        super();
        this._name = null;
    }

    connectedCallback() {
        this._updateRendering();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            this._name = newValue;
            this._updateRendering();
        }
    }

    _updateRendering() {
        let name = this.getAttribute('name');
        this.innerHTML = renderReport(name);
    }
}

window.customElements.define("lv-header", lvMlsPageHeader);
window.customElements.define("lv-page", MlsStandardSection);


/* Greater Tyler MLS report custom elements */
class gtMlsPageHeader extends HTMLElement { 
    static observedAttributes = ["src", "name"];

    constructor() {
        super();
        this._logoUrl = null;
        this._name = null;
    }

    connectedCallback() {
        this._updateRendering();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "src") {
            this._logoUrl = newValue;
            this._updateRendering();
        } else if (name === "name") {
            this._name = newValue;
            this._updateRendering();
        }
    }

    _updateRendering() {
        this.innerHTML = `
<header>
    <div class="tyler-header">
        <img src="${this._logoUrl}" width="150px" alt="report logo">
        <div class="tyler-title">
            <label>MULTIPLE LISTING SERVICE&nbsp;&nbsp;&nbsp;${this._name} DATA FORM</label>
        </div>
    </div>
    <P>* All Fields Marked with an asterisk (<span class="red_asterisk">*</span>) and <strong>Bold Text</strong> are required. (Lookup) fields provide a list from which to select.</P>
</header>`;

    }
}

class gtMlsStandardSection extends HTMLElement {
    static observedAttributes = ["name"];

    constructor() {
        super();
        this._name = null;
    }

    connectedCallback() {
        this._updateRendering();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "name") {
            this._name = newValue;
            this._updateRendering();
        }
    }

    _updateRendering() {
        let name = this.getAttribute('name');
        this.innerHTML = renderReport(name);
    }
}

window.customElements.define("gt-page", gtMlsStandardSection);
window.customElements.define("gt-header", gtMlsPageHeader);


function getQuestionaireTitle(id) {
    let questionaireTitle = undefined;

    if (id != null && id.substring(0, 2) === "gt") {
        questionaireTitle = tyler_msl_questionaires.find(question => question.id === id).title;

    } else if (id != null && id.substring(0, 2) === "lv") {
        questionaireTitle = longview_msl_questionaires.find(question => question.id === id).title;

    }

    return questionaireTitle;
}
function getQuestionaire(id) {
    let questionaire = undefined;

    if (id != null && id.substring(0, 2) === "gt") {
        questionaire = tyler_msl_questionaires.find(question => question.id === id);

    } else if (id != null && id.substring(0, 2) === "lv") {
        questionaire = longview_msl_questionaires.find(question => question.id === id);

    }

    return questionaire;
}
/* Render MLS report body */
function renderReport(name) {
    let reportDoc = getQuestionaire(name);
    let fragment = "";

    if (reportDoc === null || reportDoc === undefined) {
        reportDoc = { name: name, sections: [
            { name: "Error", title: "Report Missing!", questions: [
                { type: "paragraph", name: `Unable to find ${name} questionaire please contact website creator` }
                ]
            }
        ]};
    }

    for (let i=0; i < reportDoc.sections.length; i++) {
        let section = reportDoc.sections[i];
        let sectionHTML = "";
        
        if (section != null) {
            sectionHTML += `<div class="section-title"><label>${section.name} ${section.title}</label></div>\n`;
            sectionHTML += `<div class="${section.class}">\n`;

            if (section.questions.length > 0) {

                for (let x=0; x < section.questions.length; x++) {
                    let question = section.questions[x];
                    let ctrl = ""

                    if (question != null && question.type != null) {
                        if (question.type === "paragraph") {
                            ctrl = `<p class="padstart">${question.name}</p>`;
                        } else if (question.type === "startgroup") {
                            ctrl = `<div class="${question.class}">\n`;
                        } else if (question.type === "endgroup") {
                            ctrl = "</div>";
                        } else if (question.type === "checkbox") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let linebreak = (question.oneline != null && question.oneline === true) ? "&nbsp;&nbsp;" : "<br>";
                            
                            if (question.class != null && question.class != "") {
                                linebreak = "";
                            }

                            ctrl = question.required ? `<div class="${classList} require-checkbox"><label><span class="red_asterisk">*</span><strong>${question.name}:</strong></label>${linebreak}` : `<div class="${classList}"><label>${question.name}:</label>${linebreak}`;

                            for (let j=0; j < question.options.length; j++) {
                                if (question.default != null && question.default == question.options[j]) {
                                    ctrl += `<label><input type="checkbox" name="${question.name.replace(' ', '_')}_${question.options[j].replace(' ', '_')}" checked>${question.options[j]} <small>(default)</small></label>${linebreak}`;
                                } else {
                                    ctrl += `<label><input type="checkbox" name="${question.name.replace(' ', '_')}_${question.options[j].replace(' ', '_')}">${question.options[j]}</label>${linebreak}`;
                                }
                            }
                            ctrl += "</div>";
                        } else if (question.type === "currency") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let linebreak = question.linebreak != null ? question.linebreak : "";

                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: $ </strong></label><input type="number" required name="${question.name.replace(' ', '_')}" step="0.01" min="0"></div>${linebreak}` : `<div class="${classList}"><label>${question.name}: $ </label><input type="number" name="${question.name.replace(' ', '_')}" step="0.01" min="0"></div>${linebreak}`;

                        } else if (question.type === "text") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let tail = (question.trailing != null && question.trailing != "") ? `<span>&nbsp; ${question.trailing}</span>` : "";

                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: </strong></label><input type="text" required name="${question.name.replace(' ', '_')}">${tail}</div>` : `<div class="${classList}"><label>${question.name}: </label><input type="text" name="${question.name.replace(' ', '_')}">${tail}</div>`;

                        } else if (question.type === "number") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let linebreak = question.linebreak != null ? question.linebreak : "";

                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: </strong></label><input type="number" required name="${question.name.replace(' ', '_')}" step="0.01" min="0"></div>${linebreak}` : `<div class="${classList}"><label>${question.name}: </label><input type="number" name="${question.name.replace(' ', '_')}" step="0.01" min="0"></div>${linebreak}`;

                        } else if (question.type === "date") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let linebreak = question.linebreak != null ? question.linebreak : "";

                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: </strong></label><input type="date" required name="${question.name.replace(' ', '_')}"></div>${linebreak}` : `<div class="${classList}"><label>${question.name}: </label><input type="date" name="${question.name.replace(' ', '_')}"></div>${linebreak}`;

                        } else if (question.type === "textarea") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-block";
                            let tail = (question.trailing != null && question.trailing != "") ? question.trailing : "";

                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: ${tail}</strong></label><br><textarea name="${question.name.replace(' ', '_')}" required></textarea></div>` : `<div class="${classList}"><label>${question.name}: ${tail}</label><br><textarea name="${question.name.replace(' ', '_')}"></textarea></div>`

                        } else if (question.type === "url") {
                            let classList = (question.class != null && question.class != "") ? question.class : "section-inline-block";
                            let tail = (question.trailing != null && question.trailing != "") ? question.trailing : "";
  
                            ctrl = question.required ? `<div class="${classList}"><label><span class="red_asterisk">*</span><strong>${question.name}: ${tail}</strong></label><input type="url" required name="${question.name.replace(' ', '_')}"></div>` : `<div class="${classList}"><label>${question.name}: ${tail}</label><input type="url" name="${question.name.replace(' ', '_')}"></div>`;

                        } else if (question.type === "table") {
                            ctrl = renderTable(question);
                        } else {
                            ctrl = question.required ? `<div class="section-inline-block"><label><span class="red_asterisk">*</span><strong>${question.name}</strong></label></div>` : `<label>${question.name}</label><br>`;
                        }

                        sectionHTML +=  ctrl + '\n'
                    }
                }
            }

            // End the section code block
            sectionHTML += "</div>\n";
        }

        fragment += sectionHTML;
    }

    return fragment
}

function renderTable(data) {
    let fragment = '<table class="longview-table">';

    for (let r=0; r < data.repeate; r++) {
        fragment += "<tr>"

        if (r === 0) {
            for (let c=0; c < data.columns.length; c++) {
                fragment += `<th>${data.columns[c].name}</th>`
            }
        } else {
            for (let c=0; c < data.columns.length; c++) {
                let ctrlType = data.columns[c].type;

                if (ctrlType === "counter") {
                    fragment += `<td>${data.columns[c].format.replace('{0}', r)}</td>`
                
                } else if (ctrlType === "options") {
                    let ctrlOption = data.columns[c].options;
                    fragment += '<td>';

                    ctrlOption.forEach(itm => {
                        fragment += `<label><input type="checkbox" name="${data.columns[c].name.replace(' ', '_')}_${itm.replace(' ', '_')}_${r}}">${itm} </label>`;
                    })
                    fragment += '</td>';

                } else {
                    fragment += `<td><input type="${data.columns[c].type}" name="${r}_${data.columns[c].name}"></td>`
                }
            }
        }

        fragment += "</tr>"
    }

    fragment += "</table>"
    return fragment
}