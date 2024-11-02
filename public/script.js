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