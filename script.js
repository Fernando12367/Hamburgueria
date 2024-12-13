let carrinho = [];

// Funções globais
function atualizarCarrinho() {
    const itensCarrinho = document.getElementById('itens-carrinho');
    const carrinhoTotal = document.getElementById('carrinho-total');
    const carrinhoContador = document.querySelector('.carrinho-btn .carrinho-contador');
    
    itensCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item-carrinho');
        itemElement.innerHTML = `
            <div>
                <h4>${item.nome}</h4>
                <p>R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            </div>
            <div class="item-controles">
                <button onclick="alterarQuantidade('${item.nome}', -1)">-</button>
                <span>${item.quantidade}</span>
                <button onclick="alterarQuantidade('${item.nome}', 1)">+</button>
            </div>
        `;
        itensCarrinho.appendChild(itemElement);
        total += item.preco * item.quantidade;
    });

    carrinhoTotal.textContent = total.toFixed(2);
    carrinhoContador.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    
    const itensPedido = document.getElementById('itens-pedido');
    const totalPedido = document.getElementById('total-pedido');
    
    itensPedido.innerHTML = carrinho.map(item => `
        <div class="item-resumo">
            <span>${item.nome} x${item.quantidade}</span>
            <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
        </div>
    `).join('');
    
    totalPedido.textContent = total.toFixed(2);
}

function alterarQuantidade(nome, delta) {
    const item = carrinho.find(i => i.nome === nome);
    if (item) {
        item.quantidade += delta;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.nome !== nome);
        }
        atualizarCarrinho();
    }
}

function mostrarCarrinho() {
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    carrinhoLateral.classList.add('aberto');
}

function abrirFormulario() {
    document.getElementById('modal-formulario').style.display = 'block';
}

function validarFormulario() {
    const nome = document.getElementById('nome');
    const telefone = document.getElementById('telefone');
    const email = document.getElementById('email');
    const rua = document.getElementById('rua');
    const numero = document.getElementById('numero');
    const bairro = document.getElementById('bairro');
    let isValid = true;

    // Validar nome
    if (nome.value.length < 3) {
        mostrarErro(nome, 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    } else {
        limparErro(nome);
    }

    // Validar telefone
    const telefoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
    if (!telefoneRegex.test(telefone.value)) {
        mostrarErro(telefone, 'Telefone inválido');
        isValid = false;
    } else {
        limparErro(telefone);
    }

    // Validar email se preenchido
    if (email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            mostrarErro(email, 'E-mail inválido');
            isValid = false;
        } else {
            limparErro(email);
        }
    }

    // Validar endereço
    if (!rua.value || !numero.value || !bairro.value) {
        mostrarErro(rua, 'Endereço completo é obrigatório');
        isValid = false;
    } else {
        limparErro(rua);
    }

    return isValid;
}

function mostrarErro(input, mensagem) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.add('error');
    const erro = formGroup.querySelector('.error-message');
    erro.textContent = mensagem;
}

function limparErro(input) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.remove('error');
}

function updateActiveSection() {
    const sections = ['inicio', 'menu', 'sobre', 'contato'];
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const sidebarItem = document.querySelector(`.sidebar-item[href="#${sectionId}"]`);
        
        if (section && sidebarItem) {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.sidebar-item').forEach(item => {
                    item.classList.remove('active');
                });
                sidebarItem.classList.add('active');
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const modalFormulario = document.getElementById('modal-formulario');
    const closeBtn = document.querySelector('.close');
    const btnsPedido = document.querySelectorAll('.btn-pedido');
    const formPedido = document.getElementById('form-pedido');
    const carrinhoBtn = document.querySelector('.carrinho-btn');
    const carrinhoLateral = document.getElementById('carrinho-lateral');
    const fecharCarrinho = document.querySelector('.fechar-carrinho');
    const modalPagamento = document.getElementById('modal-pagamento');
    const closePagamento = document.querySelector('.close-pagamento');
    const formPagamento = document.querySelectorAll('input[name="pagamento"]');
    const campoTroco = document.getElementById('campo-troco');
    const btnFinalizarPagamento = document.querySelector('.btn-finalizar-pagamento');

    // Adicionar ao carrinho
    btnsPedido.forEach(btn => {
        btn.addEventListener('click', function() {
            const produto = this.closest('.produto') || this.closest('.promocao-info');
            const nome = produto.querySelector('h4, h3').textContent;
            const item = {
                nome: nome,
                preco: parseFloat(this.dataset.preco),
                quantidade: 1
            };
            
            const itemExistente = carrinho.find(i => i.nome === item.nome);
            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push(item);
            }
            
            atualizarCarrinho();
            mostrarCarrinho();
        });
    });

    // Event listeners do carrinho
    carrinhoBtn.addEventListener('click', mostrarCarrinho);
    fecharCarrinho.addEventListener('click', () => {
        carrinhoLateral.classList.remove('aberto');
    });

    // Fechar modal do formulário
    closeBtn.addEventListener('click', () => {
        modalFormulario.style.display = 'none';
    });

    // Enviar pedido
    formPedido.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }

        // Fechar modal do formulário e abrir modal de pagamento
        modalFormulario.style.display = 'none';
        modalPagamento.style.display = 'block';
        
        // Atualizar resumo final
        const resumoFinalItens = document.getElementById('resumo-final-itens');
        const totalFinal = document.getElementById('total-final');
        
        resumoFinalItens.innerHTML = carrinho.map(item => `
            <div class="item-resumo">
                <span>${item.nome} x${item.quantidade}</span>
                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
        `).join('');
        
        totalFinal.textContent = document.getElementById('total-pedido').textContent;
    });

    // Máscara para o telefone
    document.getElementById('telefone').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        }
    });

    // Adicionar event listener para scroll
    window.addEventListener('scroll', updateActiveSection);
    
    // Atualizar seção ativa no carregamento
    updateActiveSection();

    // Adicionar smooth scroll para os links da sidebar
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Event listeners para formas de pagamento
    formPagamento.forEach(radio => {
        radio.addEventListener('change', function() {
            // Esconder todas as informações de pagamento
            document.querySelectorAll('.pagamento-info').forEach(info => {
                info.style.display = 'none';
            });

            // Mostrar informação específica da forma de pagamento selecionada
            const infoElement = document.getElementById(`${this.value}-info`);
            if (infoElement) {
                infoElement.style.display = 'block';
            }
        });
    });

    // Máscara para cartão de crédito
    document.getElementById('numero-cartao').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        e.target.value = value;
    });

    // Máscara para validade do cartão
    document.getElementById('validade-cartao').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        e.target.value = value;
    });

    // Máscara para CVV
    document.getElementById('cvv-cartao').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Botões de troco
    document.querySelectorAll('.btn-troco').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-troco').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const needTroco = this.dataset.needTroco === 'sim';
            document.getElementById('campo-troco').style.display = needTroco ? 'block' : 'none';
        });
    });

    closePagamento.addEventListener('click', () => {
        modalPagamento.style.display = 'none';
    });

    btnFinalizarPagamento.addEventListener('click', finalizarPedido);
    btnFinalizarPagamento.addEventListener('touchend', finalizarPedido);

    function finalizarPedido(e) {
        e.preventDefault();
        
        const formaPagamento = document.querySelector('input[name="pagamento"]:checked');
        
        if (!formaPagamento) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }

        let isValid = true;

        if (formaPagamento.value === 'cartao') {
            // Validação do cartão...
            const numeroCartao = document.getElementById('numero-cartao').value.replace(/\s/g, '');
            const validade = document.getElementById('validade-cartao').value;
            const cvv = document.getElementById('cvv-cartao').value;
            const nomeCartao = document.getElementById('nome-cartao').value;

            if (numeroCartao.length !== 16 || validade.length !== 5 || cvv.length !== 3 || !nomeCartao) {
                alert('Por favor, preencha todos os dados do cartão corretamente.');
                isValid = false;
            }
        } else if (formaPagamento.value === 'dinheiro') {
            const needTroco = document.querySelector('.btn-troco.selected')?.dataset.needTroco === 'sim';
            if (needTroco) {
                const trocoValor = document.getElementById('valor-troco').value;
                const totalPedido = parseFloat(document.getElementById('total-final').textContent);
                
                if (!trocoValor || parseFloat(trocoValor) < totalPedido) {
                    alert('Por favor, insira um valor válido para o troco.');
                    isValid = false;
                }
            }
        }

        if (isValid) {
            alert('Pedido finalizado com sucesso!');
            modalPagamento.style.display = 'none';
            carrinho = [];
            atualizarCarrinho();
        }
    }

    // Prevenir scroll do body quando modal estiver aberto
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('show', () => {
            document.body.classList.add('modal-open');
        });
        
        modal.addEventListener('hide', () => {
            document.body.classList.remove('modal-open');
        });
    });

    // Garantir que o botão de finalizar seja sempre clicável
    document.querySelector('.btn-finalizar-pagamento').addEventListener('touchstart', function(e) {
        e.preventDefault();
        // Seu código de finalização aqui
    });
}); 