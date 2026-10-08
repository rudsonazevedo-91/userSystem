const form = document.querySelector("#formCadastro");

// escuta o evento de envio do formulário
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário  
    console.log(Object.fromEntries(
        [...form.elements]
            .filter(element => element.id)
            .map(element => [element.id, element.value])
    ));
    form.reset();
});



