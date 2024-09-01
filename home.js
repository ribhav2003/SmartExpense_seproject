document.addEventListener('DOMContentLoaded', function () {
    const userNameElement = document.getElementById('userName');
    const userName = sessionStorage.getItem('userName');

    if (userName) {
        userNameElement.textContent = userName;
    }
});
