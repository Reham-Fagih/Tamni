async function handleSubmit(event) {
  event.preventDefault();  // Prevent form submission

  const formData = new FormData(event.target);

  // Send the POST request to the backend
  const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
  });

  const data = await response.json();
  console.log('Response from server:', data);  // Log the full response for debugging

  // Check if the server responded with a message
  const resultContainer = document.getElementById('result-container');
  
  if (data.message) {
      // Append the success message
      const messageElem = document.createElement('p');
      messageElem.textContent = data.message;
      resultContainer.appendChild(messageElem);
  }

  if (data.prediction) {
      // Append the prediction result
      const predictionElem = document.createElement('p');
      predictionElem.textContent = `Prediction: ${data.prediction}`;
      resultContainer.appendChild(predictionElem);
  } else {
      console.error('No prediction data found:', data);
  }
}




function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
const role = getQueryParam("role");
  if (role == "patient") {
    document.querySelector("#Hiuser").style.display = "block";
    document.querySelector(".inbox").style.display = "none";
    document.querySelector(".login").style.display = "none";
  }
  else {
    document.querySelector("#Hiuser").style.display = "none";
  }