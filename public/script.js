async function handleSubmit(event) {
    event.preventDefault(); 

    const formData = new FormData(event.target);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    alert(data.message);

    if (data.redirectTo) {
        setTimeout(() => {
            window.location.href = data.redirectTo;
        }, 2000); 
    }
}
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
const role = getQueryParam("role");
if (role === "doctor") {
    document.querySelector(".inbox").style.display = "block";
    document.querySelector(".login").style.display = "none";
  } else {
    document.querySelector(".inbox").style.display = "none";
  }