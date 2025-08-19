
const myCtrls = document.createElement('div');
const myPreview = document.createElement('pre');
myCtrls.classList.add('section-group');
//myCtrls.innerHTML = `<p>Loading HTML fragment and building HTML source code </p>`;
const frdata = document.body;

if (frdata != null && true == true) {
    //console.log("Found HTML fragment");
    //class="f-form-required ui-widget-header"
    let headers = frdata.querySelectorAll('div.ui-widget-header');
    //console.log(`located ${headers.length} headers`);
    //class="f-form-required feature-panel"
    let panels = frdata.querySelectorAll('div.feature-panel');
    //console.log(`located ${panels.length} panels`);
    let jsonString = "";

    for (let i=0; i < headers.length; i++) {
        let head =  headers[i]
        let req = head.classList.contains('f-form-required');

        if (i+1 === headers.length) {
            jsonString += loadString(req, headers[i], panels[i]) + "\n";
        } else {
            jsonString += loadString(req, headers[i], panels[i]) + ",\n";
        }
        console.log(headers[i].textContent);
        /*
        if (head.classList.contains('f-form-required')) {
            loadReqHeaders(myCtrls, headers[i], panels[i])
        } else {
            loadHeaders(myCtrls, headers[i], panels[i])
        } */
    }

    myPreview.innerHTML = jsonString;
    frdata.innerHTML = "";
    frdata.appendChild(myPreview);
    //frdata.appendChild(myCtrls);
    //let htmldata = myCtrls.innerHTML;
    //saveTextToFile(p_link, 'fr.txt', htmldata);
}

function loadString(req, header, panel) {
    let options = "[]";
    if (panel != null) {
        let lbls = panel.querySelectorAll('label');
        let optionList = "";

        for (let i=0; i < lbls.length; i++) {
            let selected = lbls[i];

            if (selected != null) {
                if (i === 0) {
                    optionList += `"${selected.textContent}"`;
                } else {
                    optionList += `, "${selected.textContent}"`;
                }
            }
        }

        options = "[" + optionList + "]";
    }

    return `{ type: "checkbox", name: "${header.textContent}", required: ${req}, options: ${options} }`;
}


function loadHeaders(myCtrls, header, panel) {
    let name = header.textContent;
    //<div class="section-inline-block">
    let div = document.createElement('div');
    div.classList.add('section-inline-block');
    div.innerHTML = `<label>${header.textContent}</label><br>`
    
    if (panel != null) {
        loadOptions(div, name, panel);
    }

    myCtrls.append(div);
}

function loadReqHeaders(myCtrls, header, panel) {
    let name = header.textContent;
    //<div class="section-inline-block require-checkbox">
    let div = document.createElement('div');
    div.classList.add('section-inline-block', 'require-checkbox');
    div.innerHTML = `<label><span class="red_asterisk">*</span><strong>${header.textContent}</strong></label><br>`
    
    if (panel != null) {
        loadOptions(div, name, panel);
    }

    myCtrls.append(div);
}

function loadOptions(ctrl, name, panel) {
    let lbls = panel.querySelectorAll('label');
    let elname = name.toLowerCase().replace(' - ' ,'_').replaceAll(' ', '_');

    for (let i=0; i < lbls.length; i++) {
        let selected = lbls[i];

        if (selected != null) {
            let elnum = selected.getAttribute('for')
            let name = elname + elnum.replace('ck', '');
            //console.log(name);

            //<label><input type="checkbox" name="garage_type_garage"> Garage</label><br>
            let br = document.createElement('br');
            let lbl = document.createElement('label');
            lbl.innerHTML = `<input type="checkbox" name="${name}"> ${selected.textContent}`;
            ctrl.append(lbl);
            ctrl.append(br);
        }
    }
}

function saveTextToFile(doc, filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.innerHTML = "Download HTML data"; 
    doc.appendChild(a);
    URL.revokeObjectURL(url);
}
