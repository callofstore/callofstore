// ============================================
// CARRINHO DE COMPRAS - CALL OF STORE
// ============================================

// ✅ Backend do bot (Express) que vai criar o PIX e receber webhook do Mercado Pago.
// Em produção, o ideal é o site e o backend estarem no mesmo domínio (aí window.location.origin funciona).
// Se não estiverem, você pode setar no HTML:
//   <script>window.API_URL = 'https://SEU_BACKEND_PUBLICO';</script>
const API_URL = window.API_URL || (
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000'
        : window.location.origin
);

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
    const email = document.getElementById('checkout-email')?.value;
    
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

    if (!email || email.trim() === '') {
        mostrarNotificacao('❌ Informe um email válido para gerar o PIX (Mercado Pago).', 'erro');
        return;
    }
    
    mostrarNotificacao('⏳ Enviando pedido...', 'info', 5000);
    
    try {
        const dadosPedido = {
            cliente: { nome: nome, discord: discordUser },
            discordUser: discordUser,
            email: email,
            jogos: carrinho.map(item => ({
                id: item.id,
                nome: item.title,
                preco: item.preco,
                quantidade: item.quantidade
            })),
            total: total
        };

        console.log('📦 Enviando para:', API_URL + '/api/checkout/pix');

        const response = await fetch(`${API_URL}/api/checkout/pix`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dadosPedido)
        });
        
        if (!response.ok) {
            const erro = await response.text();
            throw new Error(`HTTP ${response.status}: ${erro}`);
        }
        
        const resultado = await response.json();
        
        if (resultado.sucesso) {
            mostrarNotificacao('✅ Pedido criado! Gere o pagamento PIX.', 'sucesso');
            localStorage.removeItem(CONFIG.CARRINHO_KEY);

            const checkout = document.querySelector('.checkout-modal-overlay');
            if (checkout) checkout.remove();

            atualizarIconeCarrinho();
            mostrarModalPixPagamento(resultado);
        } else {
            throw new Error(resultado.erro || 'Erro desconhecido');
        }
        
    } catch (error) {
        console.error('❌ Erro detalhado:', error);
        
        let mensagem = '❌ Erro ao criar o pagamento! ';
        mensagem += error.message || '';
        
        mostrarNotificacao(mensagem, 'erro');
    }
}

// ============================================
// 5. MODAL PIX (MERCADO PAGO)
// ============================================

function mostrarModalPixPagamento(resultado) {
    const modalExistente = document.querySelector('.pix-modal-overlay');
    if (modalExistente) modalExistente.remove();

    const pedidoId = resultado.pedidoId;
    const qrBase64 = resultado.qr_code_base64;
    const qrCopiaCola = resultado.qr_code;

    const qrImgHtml = qrBase64
        ? `<img src="data:image/png;base64,${qrBase64}" alt="PIX QR" style="max-width:260px;width:100%;border-radius:12px;"/>`
        : `<div style="padding:12px;border:1px solid #333;border-radius:12px;">QR indisponível. Use o Copia e Cola abaixo.</div>`;

    const html = `
      <div class="pix-modal-overlay" style="position:fixed;inset:0;background:rgba(0,0,0,.78);display:flex;align-items:center;justify-content:center;z-index:99999;" onclick="if(event.target===this) this.remove()">
        <div class="pix-modal" onclick="event.stopPropagation()" style="position:relative;max-width:520px;width:92%;background:#111;border:1px solid #222;border-radius:16px;padding:18px;box-shadow:0 20px 60px rgba(0,0,0,.6);">
          <button style="background:transparent;border:none;color:#fff;font-size:28px;position:absolute;right:18px;top:10px;cursor:pointer" onclick="this.closest('.pix-modal-overlay').remove()">&times;</button>
          <h2 style="margin:0 0 10px 0;">💚 Pague com PIX</h2>
          <p style="margin:0 0 12px 0;opacity:.85;">
  Pedido <b>#${pedidoId}</b> criado. Pague com PIX aqui no site e, em seguida, envie o <b>comprovante por DM</b> para o bot no Discord.
</p>

<div style="margin:10px 0 14px 0;padding:12px;border:1px solid #222;border-radius:12px;background:#0b0b0b;">
  <div style="opacity:.88;margin-bottom:8px;">📩 Envie a imagem do comprovante junto do comando:</div>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
    <code style="display:block;padding:8px 10px;border:1px solid #2a2a2a;border-radius:10px;background:#050505;color:#fff;user-select:all;">!comprovante ${pedidoId}</code>
    <button class="btn-confirmar" style="min-width:170px;" onclick="copiarComandoComprovante(${pedidoId})">📋 Copiar comando</button>
    <a class="btn-cancelar" style="min-width:170px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;" href="${CONFIG.DISCORD_INVITE}" target="_blank" rel="noopener">💬 Abrir Discord</a>
  </div>
  <div style="margin-top:8px;opacity:.75;font-size:13px;">⚠️ Envie o comprovante <b>na DM do bot</b> (mensagem privada).</div>
</div>

          <div style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:center;margin:14px 0;">
            ${qrImgHtml}
          </div>

          <div style="margin-top:10px;">
            <label style="display:block;margin-bottom:6px;opacity:.85;">📋 Copia e Cola</label>
            <textarea id="pix-copia-cola" readonly style="width:100%;min-height:110px;background:#0b0b0b;color:#fff;border:1px solid #2a2a2a;border-radius:12px;padding:10px;">${qrCopiaCola || ''}</textarea>
            <div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap;">
              <button class="btn-confirmar" style="flex:1;min-width:180px;" onclick="copiarPixCopiaCola()">📋 Copiar código</button>
              <a class="btn-cancelar" style="flex:1;min-width:180px;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;" href="${CONFIG.DISCORD_INVITE}" target="_blank" rel="noopener">💬 Entrar no Discord</a>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

async function copiarPixCopiaCola() {
    try {
        const el = document.getElementById('pix-copia-cola');
        if (!el || !el.value) return;
        await navigator.clipboard.writeText(el.value);
        mostrarNotificacao('✅ Código PIX copiado!', 'sucesso');
    } catch (e) {
        mostrarNotificacao('⚠️ Não consegui copiar automaticamente. Selecione e copie manualmente.', 'erro');
    }
}

async function copiarComandoComprovante(pedidoId) {
    try {
        const cmd = `!comprovante ${pedidoId}`;
        await navigator.clipboard.writeText(cmd);
        mostrarNotificacao('✅ Comando copiado! Abra a DM do bot e cole junto da imagem do comprovante.', 'sucesso', 5000);
    } catch (e) {
        mostrarNotificacao('⚠️ Não consegui copiar automaticamente. Copie manualmente: !comprovante ' + pedidoId, 'erro', 5000);
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