const calorieCounter = document.getElementById('calorie-counter'); 
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById('entry-dropdown');
const addEntryButton = document.getElementById('add-entry');
const clearButton = document.getElementById('clear');
const output = document.getElementById('output');

/* Método usado para acessar elementos em HTML dentro de um documento WEB ('document.getElementById'), com base no 
atributo 'id', primeiramente é declarada uma variavel (const), onde será armazenada a referência quando o método 
é executado, o objeto 'document' representa o documento HTML e 'getElementId('calorie-counter') é o método do objeto, 
usado para selecionar elemento com base no atributo 'Id' 
*/

let isError = false; /*variavel declarada ('isError') e inicializada com o valor ('false')
essa varivel é usada para acompanhar o estado de um erro durante a execução de um código, e o valor ('false') indica
que não há erro. o valor pode ser alterado para ('true') em algum ponto do código se ocorrer um erro 
*/


 //um parametro é uma variavel usada para passar uma informação para uma função. 
function cleanInputString(str) { //uma função com um parametro ('str') STR é uma abreviação de string. Essa função é projetada para limpar uma string, removendo caracteres indesejados                                
    const regex = /[+-\s]/g; //expressao regular (regex) para identificar caracteres especificos 
    return str.replace(regex, ""); //metodo replace para substituir todos os caracteres que correspondem ao padrao regex
//por uma string vazia removendo os sinais de +/- e esoaços em branco da string fornecida e retorna uma string vazia 
}
function isInvalidInput (str) { //função que verifica se a string de entrada é invalida de acordo com uma deterinada condição
    const regex = /\d+e\d+/i; //expressao regex para identificar padroes especificos na string 
    return str.match(regex); //metodo ('match') para retornar o array de correspondecia caso a string corresponder  ao
//padrao regex, caso contrario rertona ('null) 
}
function addEntry () {
  const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
  //'document.querySelector' é usado para selecionar um elemento base em um seletor CSS 
  const entryNumber = targetInputContainer.querySelectorAll('input[type="text"]').length + 1;
  //conta o numero atual de campos de entrada do tipo texto dentro do 'targetInputContainer" e calcula o proximo numero disponivel
  const HTMLString = `
  <label for="${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
  <input type ="text" placeholder="Name" id="${entryDropdown.value}-${entryNumber}-name"> </input>
  <label for="${entryDropdown.value}-${entryNumber}-calories">Entry ${entryNumber} Calories</label>
<input type ="number" min="0" placeholder="Calories" id="${entryDropdown.value}-${entryNumber}-calories">
  `; //string HTML que define a estrutura da nova entrada a ser adicionada
targetInputContainer.insertAdjacentHTML("beforeend", HTMLString);
//insere o HTML criado na posição desejada dentro do 'targetInputContainer' adicionando uma nova entrada ao final do 
//contêiner de entrada selecionado
}

function calculateCalories(e) { //parametro 'e' representa o objeto de evento (event Object) em um manipulador de eventos
e.preventDefault(); //metodo usado para evitar o comportamento padrao do evento. 
//Em um evento de envio de formulário (submit), o comportamento padrão seria enviar o 
//formulário para o servidor. e.preventDefault() impede que isso aconteça.
isError = false; //uma variavel global ou de escopo mais amplo que rastreia se ocorreu algum erro durante o processamento

const breakfastNumberInputs = document.querySelectorAll('#breakfast input[type=number]');
const lunchNumberInputs = document.querySelectorAll('#lunch input[type=number]');
const dinnerNumberInputs = document.querySelectorAll('#dinner input[type=number]');
const snacksNumberInputs = document.querySelectorAll('#snacks input[type=number]');
const exerciseNumberInputs = document.querySelectorAll('#exercise input[type=number]'); 

/*metodo 'document.querySelectorAll é um metodo DOM (document object model) que seleciona todos os elementos 
que correspondem a um seletor CSS especificado e retorna uma 'NodeList' desses elementos. 
*/

const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);

const budgetCalories = getCaloriesFromInputs([budgetNumberInput]);

if (isError) {
    return;  
}

const consumedCalories = breakfastCalories + lunchCalories + dinnerCalories + snacksCalories + exerciseCalories; 
const remainingCalories = budgetCalories - consumedCalories + exerciseCalories;
const surplusOrDeficit = remainingCalories < 0 ? 'Surplus' : 'Deficit';
//operador ternario é um operador condicional que fornece de maneira compacta uma expressão com base em uma condição
// SINTAXE -> condição ? valorSeVerdadeiro : valorSeFalso;
//a condição é avaliada como true ou false, se verdadeiro é retornado o valor 'true', se false torna valor 'false' 

output.innerHTML = `
<span class="${surplusOrDeficit.toLowerCase()}">${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}</span>
<hr></hr>
<p>${budgetCalories} Calories Budgeted</p>
<p>${consumedCalories} Calories Consumed</p>
<p>${exerciseCalories} Calories Burned</p>
output.classList.remove('hide');
`;

}


function getCaloriesFromImputs (list) {  //função que aceita um parametro chamado 'list'
let calories = 0; //inicilização da variavel 'calories'

let invalidInputMatch = isInvalidInput(currVal);
for (const item of list ) { //iteração sobre a lista percorrendo cada objeto 
const currVal = cleanInputString(item.value); //limpeza do valor de entrada

if (invalidInputMatch) { //verificação de entrada invalida 
alert(`Invalid Input: ${invalidInputMatch[0]}`); 
isError = true; 
return null;  
}
calories += Number(currVal);
}
return calories;
}

function clearForm () {
const inputContainers = Array.from(document.querySelectorAll('.input-container'));
for (const container of inputContainers) {
    container.innerHTML = '';
}
budgetNumberInput.value = '';
output.innerText = '';
output.classList.add('hide');
clearButton.addEventListener("click", clearForm);
}

addEntryButton.addEventListener("click", addEntry);

calorieCounter.addEventListener("submit", calculateCalories);

