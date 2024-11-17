function closeChat() {
    var userType = document.getElementById("role").value;
    
    if (userType === "doctor") {
        window.location.href = 'doctorpage.html';
    } else if (userType === "patient") {
        window.location.href = 'index.html';
    }
}
