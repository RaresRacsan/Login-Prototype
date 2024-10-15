const urlParams = new URLSearchParams(window.location.search);
const error = urlParams.get('error');
const success = urlParams.get('success');

if (error) {
    alert(error);  // Show error message in alert
}

if (success) {
    alert(success);  // Show success message in alert
}