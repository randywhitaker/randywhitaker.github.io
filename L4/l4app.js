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
