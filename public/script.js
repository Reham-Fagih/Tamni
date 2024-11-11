async function handleSubmit(event) {
  event.preventDefault();  

  const formData = new FormData(event.target);

  const response = await fetch('/predict', {
      method: 'POST',
      body: formData,
  });

  const data = await response.json();
  console.log('Response from server:', data);  

  const resultContainer = document.getElementById('result-container');
  
  if (data.message) {
      const messageElem = document.createElement('p');
      messageElem.textContent = data.message;
      resultContainer.appendChild(messageElem);
  }

  if (data.prediction) {
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


async function handleAddReport(event) {
  event.preventDefault();  

  
  const formData = new FormData();
  formData.append('reportData', 'Sample report data');

  try {
    const response = await fetch('/add-report', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Response from server:', data);

    const resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = ''; 

    if (data.message) {
      const messageElem = document.createElement('p');
      messageElem.textContent = data.message;
      resultContainer.appendChild(messageElem);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

async function handleDeleteRecord(recordId) {
  try {
    const response = await fetch(`/delete-record/${recordId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    console.log('Delete response:', data);

    if (data.message) {
      alert(data.message);  
      document.getElementById(`record-${recordId}`).remove(); 
    }
  } catch (error) {
    console.error('Error:', error);
  }
}