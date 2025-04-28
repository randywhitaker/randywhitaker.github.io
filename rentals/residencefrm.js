const serviceUrl = 'https://script.google.com/macros/s/AKfycbyEaVEknaOR9ubievdvbL7HkQKyHrc__P4lcVDW9ml4Bv_IBLrQUv-J-29pEivNijs4yg/exec';
const nextPageUrl = 'completed.html';
const failedMessage = "Sorry something went wrong! Please try submitting your application later.";

const form = document.forms['residence-form']

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Instruct fetch to follow redirects
  fetch(serviceUrl, { redirect: 'follow', method: 'POST', 
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new FormData(form)
  })
  .then((response) => {
    let data = response.text();
    console.log(data);

    if (response.ok) {
      window.location.href = nextPageUrl; // Redirect on successful response
    } else {
      alert(failedMessage);
    }
  })
  .catch((ex) => {
    // Handle network errors or other issues
    console.log('Error:', ex);
    alert(failedMessage);
  });

});
