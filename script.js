const display = document.getElementById("display"); 
//Cria uma constante display, Visor da calculadora onde os números digitados e o resultado são exibidos no html//
const buttons = document.querySelectorAll(".btn");
//Cria uma constante buttons, Seção onde ficam os botões da calculadora//

let currentInput = "";
//Cria uma variável vazia//
let previousInput = "";
//Cria uma variável vazia//
let operator = "";
//Cria uma variável vazia//
let result = 0;
//Cria uma variável inciada em 0//
let shouldResetDisplay = false;
//Cria a variável falsa por padrão, quando receber true reseta a calculadora//

//Adicona eventos de clique para os botões//
buttons.forEach(button => { //Função varre todo conteúdo dos botões//
    button.addEventListener("click", () => { //Captura o valor do botão clicado//
        const value = button.dataset.value;
        if (!value) { //Verifica se  é um botão especial (AC ou =)//
            if (button.id === "clear") clearDisplay();//Se for AC, limpa a tela//
            if (button.id === "calculate") calculate();
            return;
        }

        if (["+", "-", "*", "/"].includes(value)) {
            setOperator (value);
        } else {
            appendNumber(value);
        }
    });
});

function updateDisplay() {
    display.innerText = currentInput || "0";
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = "";
        shouldResetDisplay = false;
    }

    if (currentInput.includes(".") && number ===".") return;
    currentInput += number;
    updateDisplay();
}

function setOperator(op) {
    if (currentInput === "") return;
    if (previousInput !=="" && !shouldResetDisplay) { 
        // Correção: if (previousInput !== "") { calculate(); } Essa parte recalcula sempre que você clica em um novo operador, mesmo depois de já ter feito um cálculo.
        // Solução:   if (previousInput !== "" && !shouldResetDisplay) { Vamos só calcular se ainda não tiver resultado anterior, ou seja, só quando ainda não clicou no =.     
        // Porque Funciona?  A variável shouldResetDisplay fica true somente depois do cálculo (=). Então, ao checar !shouldResetDisplay, a gente evita recalcular se já acabamos de calcular.//
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    currentInput = "";
}

function clearDisplay() {
    currentInput = "";
    previousInput = "";
    operator = "";
    result = 0;
    shouldResetDisplay = 0
    updateDisplay();
}

function calculate() {
    if (previousInput ==="") return;
    
    const num1 = parseFloat(previousInput);
    const num2 = parseFloat(currentInput) || 0;

    switch (operator) {
        case "+" : result = num1 + num2; break;
        case "-" : result = num1 - num2; break;
        case "*" : result = num1 * num2; break;
        case "/" : 
        if (num2 === 0) {
            currentInput = "Erro";
            previousInput = "";
            operator = ""; //Linha de código adicionado, função limpar o operador após o cálculo//

            //Necessário ajuste na função calculate e na lógica geral:

            // Modificar a função calculate para que o cálculo só seja feito se novos números forem inseridos. Evitar que o cálculo seja acionado se o botão = for pressionado repetidamente sem novos dados.

            // O que mudou? 
            // 
            // calculate(): Agora, ela só faz o cálculo se tanto previousInput quanto currentInput não estiverem vazios. Isso impede cálculos indesejados quando você clica =, mas não inseriu nenhum valor novo.
            // setOperator(): Após um cálculo, o operador é limpo (operator = ""), o que evita que ele seja usado em cálculos subsequentes de forma indesejada. Agora, o operador só é aplicado após um novo número ser inserido.//
            updateDisplay();
            return;
        }
        result = num1 / num2;
        break;
    }

    currentInput = result.toString();
    previousInput = result.toString();
    operator = ""; //Limpa o operador após o calculo//
    shouldResetDisplay = true;
    updateDisplay();
}

