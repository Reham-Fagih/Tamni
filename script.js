
// Get the image input and upload button elements
const imageInput = document.getElementById('imageUpload');
const uploadButton = document.getElementById('uploadButton');
const imagePreview = document.getElementById('imagePreview');

// Function to trigger the file input dialog when the button is clicked
uploadButton.addEventListener('click', function() {
    imageInput.click();  // Simulate a click on the hidden file input
});

// Function to handle image selection and change button text
imageInput.onchange = function () {
    const file = imageInput.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function(e) {
            // Display the selected image in the image preview element
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';  // Show the image preview
            
            // Change the button text to indicate successful upload
            uploadButton.innerText = "تم إرفاق الصورة بنجاح!";
            uploadButton.style.backgroundColor = "green";  // Optional: Change button color
        };
        reader.readAsDataURL(file);  // Read the image as a data URL
    } else {
        console.log("No file selected");
    }
};

// Get the image input and upload button elements
const imageInput = document.getElementById('imageUpload');
const uploadButton = document.getElementById('uploadButton');
const imagePreview = document.getElementById('imagePreview');

// Function to trigger the file input dialog when the button is clicked
uploadButton.addEventListener('click', function() {
    imageInput.click();  // Simulate a click on the hidden file input
});

// Function to handle image selection and change button text
imageInput.onchange = function () {
    const file = imageInput.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader(); // Create a FileReader object
        reader.onload = function(e) {
            // Display the selected image in the image preview element
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';  // Show the image preview
            
            // Change the button text to indicate successful upload
            uploadButton.innerText = "تم إرفاق الصورة بنجاح!";
            uploadButton.style.backgroundColor = "green";  // Optional: Change button color
        };
        reader.readAsDataURL(file);  // Read the image as a data URL
    } else {
        console.log("No file selected");
    }
};

