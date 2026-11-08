function filterRoutes() {
    let input = document.getElementById('searchInput').value.toLowerCase();
    let cards = document.getElementsByClassName('card');

    for (let i = 0; i < cards.length; i++) {
        let text = cards[i].innerText.toLowerCase();
        let tags = cards[i].getAttribute('data-tags').toLowerCase();
        
        if (text.includes(input) || tags.includes(input)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

function updateOperationalStatus() {
    const now = new Date();
    const dayOfWeek = now.getDay(); 
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const isBusinessDay = dayOfWeek >= 1 && dayOfWeek <= 5;

    const badges = document.querySelectorAll('.status-badge');

    badges.forEach(badge => {
        if (!isBusinessDay) {
            badge.textContent = "🔴 Fechado (Fim de semana)";
            badge.className = "status-badge status-closed";
            return;
        }

        if (currentTimeInMinutes >= 5 * 60 && currentTimeInMinutes <= 24 * 60) {
            badge.textContent = "🟢 Operando (Dia Útil)";
            badge.className = "status-badge status-open";
        } else {
            badge.textContent = "🔴 Encerrado por hoje";
            badge.className = "status-badge status-closed";
        }
    });
}

window.onload = function() {
    updateOperationalStatus();
};