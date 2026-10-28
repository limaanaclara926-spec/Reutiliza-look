
const campoNome = document.getElementById("nome-roupa");
const campoCategoria = document.getElementById("categoria-roupa");
const campoFoto = document.getElementById("foto-roupa");
const botaoAdicionar = document.getElementById("adicionar-roupa");
const mensagem = document.getElementById("mensagem-roupa");
const listaRoupas = document.getElementById("lista-roupas");
const totalRoupas = document.getElementById("total-roupas");

let roupas = [];

try {
    const roupasSalvas = localStorage.getItem("reutilizaLookRoupas");
    roupas = roupasSalvas ? JSON.parse(roupasSalvas) : [];

    if (!Array.isArray(roupas)) {
        roupas = [];
    }
} catch (erro) {
    roupas = [];
}

function salvarRoupas() {
    try {
        localStorage.setItem("reutilizaLookRoupas", JSON.stringify(roupas));
        return true;
    } catch (erro) {
        mensagem.textContent =
            "Não foi possível salvar. Tente uma foto menor ou remova algumas peças.";
        return false;
    }
}

function mostrarRoupas() {
    listaRoupas.replaceChildren();

    totalRoupas.textContent = roupas.length === 1
        ? "Você tem 1 peça cadastrada."
        : `Você tem ${roupas.length} peças cadastradas.`;

    roupas.forEach(function(roupa) {
        const cartao = document.createElement("article");
        cartao.className = "roupa-card";

        if (roupa.foto) {
            const imagem = document.createElement("img");
            imagem.src = roupa.foto;
            imagem.alt = roupa.nome;
            cartao.appendChild(imagem);
        } else {
            const emoji = document.createElement("div");
            emoji.className = "roupa-emoji";
            emoji.textContent = roupa.emoji || "👚";
            cartao.appendChild(emoji);
        }

        const titulo = document.createElement("h4");
        titulo.textContent = roupa.nome;
        cartao.appendChild(titulo);

        const categoria = document.createElement("p");
        categoria.textContent = roupa.categoria;
        cartao.appendChild(categoria);

        const botaoRemover = document.createElement("button");
        botaoRemover.type = "button";
        botaoRemover.className = "remover-roupa";
        botaoRemover.textContent = "Remover peça";

        botaoRemover.addEventListener("click", function() {
            roupas = roupas.filter(function(item) {
                return item.id !== roupa.id;
            });

            if (salvarRoupas()) {
                mostrarRoupas();
                mensagem.textContent = "Peça removida do guarda-roupa.";
            }
        });

        cartao.appendChild(botaoRemover);
        listaRoupas.appendChild(cartao);
    });
}

function adicionarPeca(roupa) {
    roupas.push({
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        nome: roupa.nome,
        categoria: roupa.categoria,
        foto: roupa.foto || "",
        emoji: roupa.emoji || "👚"
    });

    if (!salvarRoupas()) {
        roupas.pop();
        return false;
    }

    mostrarRoupas();
    return true;
}

botaoAdicionar.addEventListener("click", function() {
    const nome = campoNome.value.trim();
    const arquivo = campoFoto.files[0];
    const categoria = campoCategoria.value;

    if (!nome) {
        mensagem.textContent = "Digite o nome da roupa primeiro.";
        campoNome.focus();
        return;
    }

    if (!arquivo) {
        mensagem.textContent = "Escolha uma foto da sua roupa.";
        campoFoto.focus();
        return;
    }

    if (!arquivo.type.startsWith("image/")) {
        mensagem.textContent = "Escolha um arquivo de imagem.";
        return;
    }

    if (arquivo.size > 1.5 * 1024 * 1024) {
        mensagem.textContent =
            "Essa foto é grande demais. Escolha uma imagem de até 1,5 MB.";
        return;
    }

    const leitor = new FileReader();

    leitor.onload = function() {
        const adicionou = adicionarPeca({
            nome: nome,
            categoria: categoria,
            foto: leitor.result
        });

        if (adicionou) {
            campoNome.value = "";
            campoFoto.value = "";
            mensagem.textContent = "Sua roupa foi adicionada com sucesso! 💖";
        }
    };

    leitor.onerror = function() {
        mensagem.textContent = "Não conseguimos ler essa foto. Tente outra.";
    };

    leitor.readAsDataURL(arquivo);
});

document.querySelectorAll(".peca-catalogo").forEach(function(botao) {
    botao.addEventListener("click", function() {
        const adicionou = adicionarPeca({
            nome: botao.dataset.nome,
            categoria: botao.dataset.categoria,
            emoji: botao.dataset.emoji
        });

        if (adicionou) {
            mensagem.textContent =
                botao.dataset.nome + " foi adicionada ao seu guarda-roupa! 💖";
        }
    });
});

mostrarRoupas();


const botaoGerarLook = document.getElementById("gerar-look");
const botaoLimparLook = document.getElementById("limpar-look");
const resultadoLook = document.getElementById("resultado-look");
const mensagemLook = document.getElementById("mensagem-look");

function sortearPeca(pecas) {
    const indice = Math.floor(Math.random() * pecas.length);
    return pecas[indice];
}

function gerarLook() {
    // Lê as roupas que já estão salvas no guarda-roupa
    const roupasSalvas = JSON.parse(
        localStorage.getItem("reutilizaLookRoupas") || "[]"
    );

    if (roupasSalvas.length < 2) {
        mensagemLook.textContent =
         "Seu look está pronto! ✨ Gere novamente para descobrir outra combinação.";
         
    const botaoFavoritar = document.createElement("button");
    botaoFavoritar.className = "botao-favorito";
    botaoFavoritar.textContent = "⭐ Salvar nos favoritos";

    botaoFavoritar.addEventListener("click", function() {
        const favoritos = JSON.parse(
            localStorage.getItem("reutilizaLookFavoritos") || "[]"
        );

        const novoFavorito = {
            id: Date.now(),
            roupas: look
        };

        favoritos.push(novoFavorito);

        localStorage.setItem(
            "reutilizaLookFavoritos",
            JSON.stringify(favoritos)
        );

        mostrarFavoritos();
        mensagemLook.textContent = "Look salvo nos favoritos! 💖";
    });

    resultadoLook.appendChild(botaoFavoritar);

            "Cadastre pelo menos 2 peças para gerar um look! 💜";
        resultadoLook.innerHTML = `
            <div class="mensagem-inicial-look">
                <span>👚 👖 👟</span>
                <p>Adicione mais roupas ao seu guarda-roupa!</p>
            </div>
        `;
        return;
    }

    // Separa as roupas por categoria
    const categorias = {};

    roupasSalvas.forEach(function(roupa) {
        const categoria = roupa.categoria;

        if (!categorias[categoria]) {
            categorias[categoria] = [];
        }

        categorias[categoria].push(roupa);
    });

    // Escolhe até 3 categorias diferentes
    const categoriasDisponiveis = Object.keys(categorias);
    const categoriasEscolhidas = [];

    // Prioriza blusas e partes de baixo, se existirem
    const prioridades = [
        "Blusas",
        "Calças e saias",
        "Vestidos",
        "Sapatos e acessórios"
    ];

    prioridades.forEach(function(categoria) {
        if (
            categorias[categoria] &&
            categoriasEscolhidas.length < 3
        ) {
            categoriasEscolhidas.push(categoria);
        }
    });

    // Completa com outras categorias cadastradas
    const outrasCategorias = categoriasDisponiveis.filter(
        categoria => !categoriasEscolhidas.includes(categoria)
    );

    while (
        categoriasEscolhidas.length < 3 &&
        outrasCategorias.length > 0
    ) {
        const indice = Math.floor(Math.random() * outrasCategorias.length);
        categoriasEscolhidas.push(outrasCategorias.splice(indice, 1)[0]);
    }

    // Sorteia uma peça de cada categoria escolhida
    const look = categoriasEscolhidas.map(function(categoria) {
        return sortearPeca(categorias[categoria]);
    });

    // Mostra o look na tela
    resultadoLook.innerHTML = "";

    look.forEach(function(roupa) {
        const cartao = document.createElement("div");
        cartao.className = "peca-look";

        const nome = document.createElement("h4");
        nome.textContent = roupa.nome || "Minha peça";

        const categoria = document.createElement("p");
        categoria.textContent = roupa.categoria || "Outra peça";

        if (roupa.foto) {
            const imagem = document.createElement("img");
            imagem.src = roupa.foto;
            imagem.alt = roupa.nome || "Foto de roupa";
            cartao.appendChild(imagem);
        } else {
            const emoji = document.createElement("div");
            emoji.className = "emoji-look";
            emoji.textContent = roupa.emoji || "👕";
            cartao.appendChild(emoji);
        }

        cartao.appendChild(nome);
        cartao.appendChild(categoria);
        resultadoLook.appendChild(cartao);
    });

    mensagemLook.textContent =
        "Seu look está pronto! ✨ Gere novamente para descobrir outra combinação.";
}

function limparLook() {
    resultadoLook.innerHTML = `
        <div class="mensagem-inicial-look">
            <span>👚 👖 👟</span>
            <p>Seu próximo look incrível aparecerá aqui!</p>
        </div>
    `;

    mensagemLook.textContent = "";
}

botaoGerarLook.addEventListener("click", gerarLook);
botaoLimparLook.addEventListener("click", limparLook);

function mostrarFavoritos() {
    const listaFavoritos = document.getElementById("lista-favoritos");

    const favoritos = JSON.parse(
        localStorage.getItem("reutilizaLookFavoritos") || "[]"
    );

    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = `
            <p class="favoritos-vazio">
                Seus looks favoritos aparecerão aqui. 💕
            </p>
        `;
        return;
    }

    favoritos.forEach(function(favorito, indice) {
        const cartao = document.createElement("div");
        cartao.className = "favorito-card";

        const titulo = document.createElement("h3");
        titulo.textContent = "Look favorito " + (indice + 1);
        cartao.appendChild(titulo);

        const pecas = document.createElement("div");
        pecas.className = "pecas-favoritas";

        favorito.roupas.forEach(function(roupa) {
            const item = document.createElement("div");

            if (roupa.foto) {
                const imagem = document.createElement("img");
                imagem.src = roupa.foto;
                imagem.alt = roupa.nome || "Peça de roupa";
                item.appendChild(imagem);
            } else {
                const emoji = document.createElement("div");
                emoji.className = "emoji-look";
                emoji.textContent = roupa.emoji || "👕";
                item.appendChild(emoji);
            }

            const nome = document.createElement("p");
            nome.textContent = roupa.nome || roupa.categoria || "Peça";
            item.appendChild(nome);

            pecas.appendChild(item);
        });

        cartao.appendChild(pecas);

        const remover = document.createElement("button");
        remover.className = "botao-remover-favorito";
        remover.textContent = "🗑️ Remover favorito";

        remover.addEventListener("click", function() {
            const favoritosAtualizados = JSON.parse(
                localStorage.getItem("reutilizaLookFavoritos") || "[]"
            );

            favoritosAtualizados.splice(indice, 1);

            localStorage.setItem(
                "reutilizaLookFavoritos",
                JSON.stringify(favoritosAtualizados)
            );

            mostrarFavoritos();
        });

        cartao.appendChild(remover);
        listaFavoritos.appendChild(cartao);
    });
}

mostrarFavoritos();
