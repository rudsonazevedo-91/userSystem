// Seleciona o formulário através do ID "formCadastro"
// e armazena esse elemento na constante "form".
const form = document.querySelector("#formCadastro");

// Seleciona o botão de buscar CEP através do ID "buscarCep"
// e armazena esse elemento na constante "buscarCep".
const buscarCep = document.querySelector("#buscarCep");

// Seleciona o campo de CEP através do ID "cep"
// e armazena esse elemento na constante "cep".
const cep = document.querySelector("#cep");

const estado = document.querySelector("#estado");


// Cria uma função responsável por exibir mensagens na tela.
// O parâmetro "texto" recebe a mensagem que será exibida.
// O parâmetro "tipo" define se a mensagem será de sucesso ou de erro.
// Por padrão, o tipo será "sucesso".
function mensagem(texto, tipo = "sucesso") {

    // Cria uma notificação utilizando a biblioteca Toastify.
    Toastify({

        // Define o texto que será exibido na notificação.
        text: texto,

        // Define por quanto tempo a mensagem ficará visível.
        // O valor é informado em milissegundos.
        duration: 3000,

        // Define a posição vertical da mensagem.
        gravity: "top",

        // Define a posição horizontal da mensagem.
        position: "right",

        // Define o estilo visual da mensagem.
        style: {

            // Verifica o tipo da mensagem.
            // Se for "sucesso", utiliza a cor verde.
            // Caso contrário, utiliza a cor vermelha.
            background: tipo === "sucesso"
                ? "#198754"
                : "#dc3545"
        }

    // Exibe a notificação na tela.
    }).showToast();
}


// Adiciona um evento ao formulário para detectar quando ele for enviado.
// O evento utilizado é o "submit".
form.addEventListener("submit", function (event) {

    // Impede que o formulário seja enviado da maneira padrão.
    // Dessa forma, a página não é recarregada.
    event.preventDefault();


    // Exibe no console os dados preenchidos no formulário.
    console.log(Object.fromEntries(

        // "form.elements" obtém todos os elementos que pertencem ao formulário.
        // Os três pontos (...) transformam essa coleção em um Array.
        [...form.elements]

            // Filtra somente os elementos que possuem um ID.
            .filter(element => element.id)

            // Cria pares no formato [id, valor].
            // O ID será a chave e o valor digitado será o valor.
            .map(element => [element.id, element.value])

        // Object.fromEntries transforma os pares [chave, valor]
        // em um objeto JavaScript.
        )
    );


    // Limpa todos os campos do formulário após o envio.
    form.reset();
});


// Adiciona um evento ao botão de buscar CEP.
// O evento utilizado é o "click", que acontece quando o botão é clicado.
// A função é marcada como "async" porque será utilizado "await"
// para aguardar a resposta da consulta do CEP.
buscarCep.addEventListener("click", async function () {

    // Obtém o valor digitado no campo de CEP.
    // replace(/\D/g, "") remove todos os caracteres que não são números.
    // Dessa forma, um CEP como "60.000-000" será transformado em "60000000".
    const valor = cep.value.replace(/\D/g, "");


    // Verifica se o CEP possui exatamente 8 números.
    if (valor.length !== 8) {

        // Exibe uma mensagem de erro utilizando a função mensagem().
        mensagem(
            "CEP inválido. Por favor, digite um CEP com 8 dígitos.",
            "erro"
        );

        // Interrompe a execução da função.
        return;
    }


    // Inicia o bloco "try".
    // Ele será utilizado para tentar executar a consulta do CEP.
    try {

        // Utiliza o fetch para fazer uma requisição para a API ViaCEP.
        // O valor do CEP é colocado dentro da URL.
        // O "await" faz o código aguardar a resposta da API.
        const resposta = await fetch(
            `https://viacep.com.br/ws/${valor}/json/`
        );


        // Converte a resposta recebida da API para o formato JSON.
        // O "await" aguarda a conversão dos dados.
        const dados = await resposta.json();


        // Verifica se a resposta da requisição não foi bem-sucedida
        // OU se a API informou que o CEP não foi encontrado.
        if (!resposta.ok || dados.erro)

            // Cria um novo erro com a mensagem "CEP não encontrado."
            throw new Error("CEP não encontrado.");


        // Seleciona o campo que possui o ID "logradouro"
        // e coloca nele o valor retornado pela API.
        document.querySelector("#logradouro").value = dados.logradouro;


        // Seleciona o campo que possui o ID "bairro"
        // e coloca nele o bairro retornado pela API.
        document.querySelector("#bairro").value = dados.bairro;


        // Seleciona o campo que possui o ID "estado"
        // e coloca nele o estado retornado pela API.
        document.querySelector("#estado").value = dados.estado;


        // Seleciona o campo que possui o ID "cidade"
        // e coloca nele a cidade retornada pela API.
        document.querySelector("#cidade").value = dados.localidade;


        // Exibe uma mensagem informando que o CEP foi encontrado.
        mensagem("CEP encontrado com sucesso!");


    // Caso aconteça algum erro dentro do bloco "try",
    // a execução passa para o bloco "catch".
    } catch (erro) {

        // Exibe a mensagem do erro utilizando a função mensagem().
        // O segundo parâmetro "erro" faz a notificação aparecer em vermelho.
        mensagem(erro.message, "erro");
    }

});

function adicionarOpçao(selecao, texto, valor) {
    selecao.add(new Option(texto, valor));
}

async function carregarEstado() {
    try {
        const resposta = await fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome");
        if (!resposta.ok) {
            throw new Error("Não foi possivel carregar os estados")
        }
        const estados = await resposta.json();
        estados.forEach(a => adicionarOpçao(estado, a.nome, a.sigla));
    } catch (error) {
        mensagem(error.message, "erro");
    }
}

carregarEstado();