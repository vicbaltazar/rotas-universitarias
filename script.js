let allRoutes = [];
document.addEventListener("DOMContentLoaded", () => {
    fetch('routes.json')
        .then(response => response.json())
        .then(data => {
            allRoutes = data;
            renderRoutes(allRoutes);
            updateOperationalStatus();
        })
        .catch(error => console.error('Erro ao carregar as rotas:', error));
});

function renderRoutes(routes) {
    const container = document.getElementById('routesContainer');
    container.innerHTML = '';

    routes.forEach(route => {
        let tagsHtml = route.tagList.map(tag => `<span class="tag">${tag}</span>`).join('');
        let exemptionHtml = route.exemption ? `<span class="exemption-badge">${route.exemption}</span>` : '';
        let priceSubHtml = route.priceSub ? `<span class="price-sub">${route.priceSub}</span>` : '';

        let cardHtml = `
            <div class="card" data-tags="${route.tags.join(' ')}">
                <span class="status-badge" data-route="${route.id}">Verificando status...</span>
                <h2>${route.title}</h2>
                <div class="info-item"><span class="info-label">Saída:</span> ${route.departure}</div>
                <div class="info-item"><span class="info-label">Retorno:</span> ${route.return}</div>
                <div class="info-item">
                    <span class="price-badge">${route.price} ${priceSubHtml}</span>
                    ${exemptionHtml}
                </div>
                <div class="tag-list">
                    ${tagsHtml}
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });

    updateOperationalStatus();
}

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

function toggleChat() {
    const window = document.getElementById('chatWindow');
    window.style.display = window.style.display === 'flex' ? 'none' : 'flex';
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendQuery();
    }
}

function sendQuery() {
    const input = document.getElementById('chatInput');
    const query = input.value.trim().toLowerCase();
    if (!query) return;

    appendMessage(input.value, 'user');
    input.value = '';

    setTimeout(() => {
        let response = processAIResponse(query);
        appendMessage(response, 'bot');
    }, 500);
}

function appendMessage(text, sender) {
    const chatBody = document.getElementById('chatBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.innerHTML = text;
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function processAIResponse(q) {
    if (q.includes('guariba') && (q.includes('preço') || q.includes('valor') || q.includes('mensalidade'))) {
        return "O valor mensal para Guariba é <strong>R$ 370,00</strong>, com isenção de pagamento nas férias de Julho e Dezembro.";
    } 
    else if (q.includes('sertãozinho') && (q.includes('preço') || q.includes('valor') || q.includes('mensalidade'))) {
        return "Para as rotas de Sertãozinho, o valor mensal é <strong>R$ 70,00</strong>, sendo <strong>R$ 35,00</strong> para bolsistas ProUni / FIES.";
    } 
    else if (q.includes('prouni') || q.includes('fies') || q.includes('bolsista')) {
        return "Bolsistas ProUni e FIES pagam apenas <strong>R$ 35,00</strong> por mês nas rotas saindo de Sertãozinho.";
    } 
    else if (q.includes('regra') || q.includes('carteirinha') || q.includes('fumar') || q.includes('lixo') || q.includes('proibido')) {
        return "⚠️ <strong>Principais Regras:</strong><br>• Embarque apenas com carteirinha carimbada.<br>• Proibido sujar o ônibus com lixo.<br>• Proibido música alta (use fones).<br>• Proibido fumar e beber bebidas alcoólicas.";
    } 
    else if (q.includes('cadastro') || q.includes('renovação') || q.includes('onde')) {
        return "📍 <strong>Locais de Atendimento:</strong><br>• <strong>Sertãozinho:</strong> Terminal Urbano (Rua Sebastião Sampaio, 1051) ou Secretaria da Educação (Rua Washington Luiz, 1040).<br>• <strong>Guariba:</strong> Terminal Rodoviário José Chartune.<br>📱 WhatsApp: (16) 99154-3499";
    } 
    else if (q.includes('jaboticabal')) {
        return "A rota de Sertãozinho para Jaboticabal sai às 18:00 (Posto Savegnago) com retorno às 23:00, atendendo São Luiz, USP, Moura Lacerda e Unesp. O valor é R$ 70,00 (ou R$ 35,00 para ProUni/FIES).";
    }
    else {
        return `Posso te ajudar com horários, valores, regras de embarque ou locais de cadastro. Tente perguntar algo como: <em>"Qual o valor para Guariba?"</em> ou <em>"Quais as regras?"</em>`;
    }
}
