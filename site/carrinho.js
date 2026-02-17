// ============================================
// CARRINHO DE COMPRAS - CALL OF STORE
// ============================================

const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000'
    : 'https://your-production-url.com';

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1473337974505607178/-cduwv59PzxSg41IgmQEsr-MDlb1grtATPtEAGBw8LpbndTGSj4MWCbFyGucB0n75X_B';

const CONFIG = {
    EMAIL_PIX: 'callofstoreoficial@gmail.com',
    DISCORD_INVITE: 'https://discord.gg/3hPTerCjju',
    CARRINHO_KEY: 'callofstore_carrinho'
};

// ============================================
// 1. FUNÇÕES DO CARRINHO
// ============================================

function carregarCarrinho() {
    try {
        const carrinhoSalvo = localStorage.getItem(CONFIG.CARRINHO_KEY);
        return carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];
    } catch (e) {
        console.error('Erro ao carregar carrinho:', e);
        return [];
    }
}

function salvarCarrinho(carrinho) {
    try {
        localStorage.setItem(CONFIG.CARRINHO_KEY, JSON.stringify(carrinho));
        atualizarIconeCarrinho();
    } catch (e) {
        console.error('Erro ao salvar carrinho:', e);
    }
}

function adicionarAoCarrinho(jogoId) {
    if (typeof gamesData === 'undefined') {
        console.error('gamesData não encontrado!');
        mostrarNotificacao('❌ Erro ao adicionar ao carrinho', 'erro');
        return;
    }
    
    const jogo = gamesData.find(j => j.id === jogoId);
    if (!jogo) {
        console.error('Jogo não encontrado:', jogoId);
        return;
    }
    
    const carrinho = carregarCarrinho();
    const existe = carrinho.find(item => item.id === jogoId);
    
    if (existe) {
        existe.quantidade += 1;
        mostrarNotificacao(`✅ ${jogo.title} - Quantidade aumentada!`, 'sucesso');
    } else {
        carrinho.push({
            id: jogo.id,
            title: jogo.title,
            preco: jogo.ourPrice,
            imagem: jogo.image,
            quantidade: 1
        });
        mostrarNotificacao(`✅ ${jogo.title} adicionado ao carrinho!`, 'sucesso');
    }
    
    salvarCarrinho(carrinho);
}

function removerDoCarrinho(jogoId) {
    let carrinho = carregarCarrinho();
    carrinho = carrinho.filter(item => item.id !== jogoId);
    salvarCarrinho(carrinho);
    
    const modalAberto = document.querySelector('.carrinho-modal-overlay');
    if (modalAberto) {
        mostrarCarrinhoModal();
    }
    
    mostrarNotificacao('🗑️ Item removido do carrinho', 'info');
}

function atualizarQuantidade(jogoId, novaQuantidade) {
    const carrinho = carregarCarrinho();
    const item = carrinho.find(i => i.id === jogoId);
    
    if (item) {
        if (novaQuantidade <= 0) {
            removerDoCarrinho(jogoId);
            return;
        }
        item.quantidade = novaQuantidade;
        salvarCarrinho(carrinho);
        
        const modalAberto = document.querySelector('.carrinho-modal-overlay');
        if (modalAberto) {
            mostrarCarrinhoModal();
        }
    }
}

function calcularTotal() {
    const carrinho = carregarCarrinho();
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

// ============================================
// 2. INTERFACE DO CARRINHO
// ============================================

function criarBotaoCarrinho() {
    if (document.querySelector('.carrinho-flutuante')) return;
    
    const botao = document.createElement('div');
    botao.className = 'carrinho-flutuante';
    botao.innerHTML = `
        <div class="carrinho-icone">
            <i class="fas fa-shopping-cart"></i>
            <span class="carrinho-contagem">0</span>
        </div>
        <div class="carrinho-tooltip">Ver carrinho</div>
    `;
    
    botao.addEventListener('click', mostrarCarrinhoModal);
    document.body.appendChild(botao);
}

function atualizarIconeCarrinho() {
    const carrinho = carregarCarrinho();
    const contagem = carrinho.reduce((total, item) => total + item.quantidade, 0);
    
    const contador = document.querySelector('.carrinho-contagem');
    if (contador) {
        contador.textContent = contagem;
        contador.style.display = contagem > 0 ? 'flex' : 'none';
    }
}

function mostrarCarrinhoModal() {
    const carrinho = carregarCarrinho();
    const total = calcularTotal();
    
    const modalExistente = document.querySelector('.carrinho-modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    let html = `
        <div class="carrinho-modal-overlay" onclick="if(event.target===this) this.remove()">
            <div class="carrinho-modal" onclick="event.stopPropagation()">
                <div class="carrinho-modal-header">
                    <h2><i class="fas fa-shopping-cart"></i> Seu Carrinho</h2>
                    <button class="carrinho-fechar" onclick="this.closest('.carrinho-modal-overlay').remove()">&times;</button>
                </div>
                <div class="carrinho-modal-body">
    `;
    
    if (carrinho.length === 0) {
        html += `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-basket"></i>
                <p>Seu carrinho está vazio</p>
                <button class="continuar-comprando" onclick="this.closest('.carrinho-modal-overlay').remove()">
                    Continuar comprando
                </button>
            </div>
        `;
    } else {
        html += '<div class="carrinho-itens">';
        
        carrinho.forEach(item => {
            html += `
                <div class="carrinho-item">
                    <img src="${item.imagem}" alt="${item.title}" class="carrinho-item-img">
                    <div class="carrinho-item-info">
                        <h4>${item.title}</h4>
                        <div class="carrinho-item-preco">
                            R$ ${item.preco.toFixed(2)}
                        </div>
                    </div>
                    <div class="carrinho-item-controles">
                        <button onclick="atualizarQuantidade(${item.id}, ${item.quantidade - 1}); event.stopPropagation()">-</button>
                        <span>${item.quantidade}</span>
                        <button onclick="atualizarQuantidade(${item.id}, ${item.quantidade + 1}); event.stopPropagation()">+</button>
                        <button class="remover-item" onclick="removerDoCarrinho(${item.id}); event.stopPropagation()">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
        
        html += `
            <div class="carrinho-total">
                <span>Total:</span>
                <span class="total-valor">R$ ${total.toFixed(2)}</span>
            </div>
        `;
    }
    
    html += `
                </div>
                <div class="carrinho-modal-footer">
                    <button class="btn-continuar" onclick="this.closest('.carrinho-modal-overlay').remove()">
                        Continuar comprando
                    </button>
                    ${carrinho.length > 0 ? 
                        '<button class="btn-finalizar" onclick="mostrarCheckout(); event.stopPropagation()">Finalizar compra</button>' : 
                        '<button class="btn-finalizar" disabled>Finalizar compra</button>'}
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// ============================================
// 3. CHECKOUT
// ============================================

function mostrarCheckout() {
    const carrinho = carregarCarrinho();
    const total = calcularTotal();
    
    if (carrinho.length === 0) {
        mostrarNotificacao('❌ Carrinho vazio!', 'erro');
        return;
    }
    
    const modalCarrinho = document.querySelector('.carrinho-modal-overlay');
    if (modalCarrinho) modalCarrinho.remove();
    
    const checkoutExistente = document.querySelector('.checkout-modal-overlay');
    if (checkoutExistente) checkoutExistente.remove();
    
    const html = `
        <div class="checkout-modal-overlay" onclick="if(event.target===this) this.remove()">
            <div class="checkout-modal" onclick="event.stopPropagation()">
                <div class="checkout-modal-header">
                    <h2><i class="fas fa-check-circle"></i> Finalizar Compra</h2>
                    <button class="checkout-fechar" onclick="this.closest('.checkout-modal-overlay').remove()">&times;</button>
                </div>
                
                <div class="checkout-modal-body">
                    <div class="checkout-resumo">
                        <h3>Resumo do pedido</h3>
                        <div class="resumo-itens">
                            ${carrinho.map(item => `
                                <div class="resumo-item">
                                    <span>${item.quantidade}x ${item.title}</span>
                                    <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div class="resumo-total">
                            <strong>Total:</strong>
                            <strong>R$ ${total.toFixed(2)}</strong>
                        </div>
                    </div>
                    
                    <div class="checkout-form">
                        <h3><i class="fab fa-discord"></i> Dados para contato</h3>
                        
                        <div class="form-group">
                            <label>Seu nome:</label>
                            <input type="text" id="checkout-nome" class="checkout-input" placeholder="Como prefere ser chamado">
                        </div>
                        
                        <div class="form-group">
                            <label>Seu Discord (obrigatório):</label>
                            <input type="text" id="checkout-discord" class="checkout-input" placeholder="Ex: usuario#1234" required>
                            <small>Digite seu nome de usuário do Discord</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Email (opcional):</label>
                            <input type="email" id="checkout-email" class="checkout-input" placeholder="para enviar comprovante">
                        </div>
                    </div>
                    
                    <div class="checkout-info">
                        <i class="fas fa-info-circle"></i>
                        <span>Após finalizar, você será redirecionado para o Discord onde receberá as instruções de pagamento.</span>
                    </div>
                </div>
                
                <div class="checkout-modal-footer">
                    <button class="btn-voltar" onclick="this.closest('.checkout-modal-overlay').remove()">
                        <i class="fas fa-arrow-left"></i> Voltar
                    </button>
                    <button class="btn-confirmar" onclick="enviarPedidoWebhook()">
                        <i class="fab fa-discord"></i> Confirmar Pedido
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// ============================================
// 4. ENVIAR PEDIDO PARA O BOT
// ============================================

async function enviarPedidoWebhook() {
    const nome = document.getElementById('checkout-nome')?.value || 'Não informado';
    const discordUser = document.getElementById('checkout-discord')?.value;
    const email = document.getElementById('checkout-email')?.value || 'Não informado';
    
    if (!discordUser || discordUser.trim() === '') {
        mostrarNotificacao('❌ Por favor, informe seu Discord!', 'erro');
        return;
    }
    
    const carrinho = carregarCarrinho();
    
    if (carrinho.length === 0) {
        mostrarNotificacao('❌ Carrinho vazio!', 'erro');
        return;
    }
    
    const total = calcularTotal();
    const pedidoId = Math.floor(Math.random() * 9000) + 1000;
    
    mostrarNotificacao('⏳ Enviando pedido...', 'info', 5000);
    
    try {
        const API_LOCAL = 'http://localhost:3000';
        
        const dadosPedido = {
            pedidoId: pedidoId,
            cliente: {
                nome: nome,
                discord: discordUser
            },
            discordUser: discordUser,
            email: email,
            jogos: carrinho.map(item => ({
                id: item.id,
                nome: item.title,
                preco: item.preco,
                quantidade: item.quantidade
            })),
            total: total,
            data: new Date().toISOString()
        };
        
        console.log('📦 Enviando para:', API_LOCAL + '/webhook/pedido');
        
        const response = await fetch(`${API_LOCAL}/webhook/pedido`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-webhook-secret': 'callofstore_secret_2026'
            },
            body: JSON.stringify(dadosPedido)
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(`HTTP ${response.status}: ${erro}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            mostrarNotificacao('✅ Pedido enviado com sucesso!', 'sucesso');
            localStorage.removeItem(CONFIG.CARRINHO_KEY);
            
            const checkout = document.querySelector('.checkout-modal-overlay');
            if (checkout) checkout.remove();
            
            mostrarSucessoPedido(pedidoId, discordUser);
            atualizarIconeCarrinho();
        } else {
            throw new Error(resultado.erro || 'Erro desconhecido');
        }
        
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        
        let mensagem = '❌ Erro de conexão! ';
        if (!error.message.includes('HTTP')) {
            mensagem += 'O bot está rodando? (node bot-tickets.js)';
        } else {
            mensagem += error.message;
        }
        
        mostrarNotificacao(mensagem, 'erro');
    }
}

// ============================================
// 5. TELA DE SUCESSO
// ============================================

function mostrarSucessoPedido(pedidoId, discord) {
    const modalExistente = document.querySelector('.sucesso-modal-overlay');
    if (modalExistente) modalExistente.remove();
    
    const html = `
        <div class="sucesso-modal-overlay" onclick="if(event.target===this) this.remove()">
            <div class="sucesso-modal" onclick="event.stopPropagation()">
                <button class="sucesso-fechar" onclick="this.closest('.sucesso-modal-overlay').remove()">&times;</button>
                
                <div class="sucesso-icone">✅</div>
                <h2>Pedido recebido com sucesso!</h2>
                
                <div class="sucesso-info">
                    <p><strong>Nº do pedido:</strong> #${pedidoId}</p>
                    <p><strong>Discord informado:</strong> ${discord}</p>
                </div>
                
                <div class="sucesso-instrucoes">
                    <h3><i class="fab fa-discord"></i> Próximos passos:</h3>
                    <ol>
                        <li>Entre no nosso Discord (link abaixo)</li>
                        <li>Você receberá uma mensagem privada de um vendedor</li>
                        <li>Enviaremos o PIX para pagamento</li>
                        <li>Após confirmação, você recebe a key!</li>
                    </ol>
                </div>
                
                <div class="sucesso-botoes">
                    <a href="${CONFIG.DISCORD_INVITE}" target="_blank" class="btn-discord" onclick="event.stopPropagation()">
                        <i class="fab fa-discord"></i> Entrar no Discord
                    </a>
                    <button class="btn-fechar" onclick="this.closest('.sucesso-modal-overlay').remove()">
                        Continuar comprando
                    </button>
                </div>
                
                <div class="sucesso-aviso">
                    <i class="fas fa-clock"></i>
                    O atendimento pode levar alguns minutos. Fique de olho no Discord!
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', html);
}

// ============================================
// 6. NOTIFICAÇÕES
// ============================================

function mostrarNotificacao(mensagem, tipo = 'info', duracao = 3000) {
    const notificacoesAntigas = document.querySelectorAll('.notificacao');
    notificacoesAntigas.forEach(n => n.remove());
    
    const notificacao = document.createElement('div');
    notificacao.className = `notificacao notificacao-${tipo}`;
    notificacao.innerHTML = `
        <div class="notificacao-conteudo">
            <span>${mensagem}</span>
            <button class="notificacao-fechar" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, duracao);
}

// ============================================
// 7. INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Carrinho.js iniciado!');
    
    criarBotaoCarrinho();
    atualizarIconeCarrinho();
    
    // Observer para quando os jogos forem carregados
    const observer = new MutationObserver(() => {
        modificarBotoesJogos();
    });
    
    const gamesGrid = document.getElementById('games-grid');
    if (gamesGrid) {
        observer.observe(gamesGrid, { childList: true, subtree: true });
    }
    
    setTimeout(modificarBotoesJogos, 1500);
});

function modificarBotoesJogos() {
    document.querySelectorAll('.game-card').forEach(card => {
        if (card.querySelector('.game-card-actions')) return;
        
        const gameId = card.dataset.gameId;
        if (!gameId) return;
        
        const gameInfo = card.querySelector('.game-info');
        if (!gameInfo) return;
        
        const titulo = card.querySelector('.game-title')?.textContent || '';
        const precoAtual = card.querySelector('.current-price')?.textContent || '';
        const precoOriginal = card.querySelector('.original-price')?.outerHTML || '';
        
        gameInfo.innerHTML = `
            <h3 class="game-title">${titulo}</h3>
            <div class="game-price">
                <span class="current-price">${precoAtual}</span>
                ${precoOriginal}
            </div>
            <div class="game-card-actions">
                <button class="buy-btn" onclick="adicionarAoCarrinho(${gameId}); event.stopPropagation()">
                    <i class="fas fa-cart-plus"></i> Carrinho
                </button>
                <button class="buy-btn buy-now-btn" onclick="comprarAgora(${gameId}); event.stopPropagation()">
                    <i class="fas fa-bolt"></i> Comprar
                </button>
            </div>
        `;
    });
}

function comprarAgora(gameId) {
    adicionarAoCarrinho(gameId);
    setTimeout(mostrarCheckout, 500);
}

// ============================================
// EXPOR FUNÇÕES
// ============================================

window.adicionarAoCarrinho = adicionarAoCarrinho;
window.removerDoCarrinho = removerDoCarrinho;
window.atualizarQuantidade = atualizarQuantidade;
window.mostrarCarrinhoModal = mostrarCarrinhoModal;
window.mostrarCheckout = mostrarCheckout;
window.enviarPedidoWebhook = enviarPedidoWebhook;
window.comprarAgora = comprarAgora;