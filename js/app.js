const initApp = () => {

    const currentValueElement = document.querySelector('.currentvalue');
    const previousValueElement = document.querySelector('.previousvalue');
    let itemArray = [];
    const equationArray = [];
    let newNumberFlag = false;

    const inputButtons = document.querySelectorAll('.number');
    inputButtons.forEach(button => {
        button.addEventListener('click', (event) => {

            const newInput = event.target.textContent;
            if (newNumberFlag) {
                currentValueElement.value = newInput;
                newNumberFlag = false;
            } else {
                currentValueElement.value = 
                    currentValueElement.value == 0
                        ? newInput
                        : `${currentValueElement.value}${newInput}`;
            }
        });
    });

    const opButtons = document.querySelectorAll('.operator');
    opButtons.forEach(button => {
        button.addEventListener('click', (event) => {
             if(newNumberFlag) {
                 previousValueElement.textContent = "";
                 itemArray = [];
             }

             const newOperator = event.target.textContent;
             const currentValue = currentValueElement.value;

             if (!itemArray.length && currentValue == 0) return;
             
             if(!itemArray.length) {
                 itemArray.push(currentValue, newOperator);
                 previousValueElement.textContent = 
                    `${currentValue}
                    ${newOperator}`;
                return newNumberFlag = true;
             }
             
             if(itemArray.length) {
                 itemArray.push(currentValue);

                 const equationObj = {
                     num1: parseFloat(itemArray[0]),
                     num2: parseFloat(currentValue),
                     op: itemArray[1]
                 }

                 equationArray.push(equationObj); 
                 const equationString = 
                    `${equationObj['num1']}
                     ${equationObj['op']}
                     ${equationObj['num2']}`;

                 const newValue = calculate(equationString, currentValueElement);

                 previousValueElement.textContent = 
                    `${newValue} ${newOperator}`;

                itemArray = [newValue, newOperator];
                newNumberFlag = true;
                console.log(equationArray);
             }
        });
    });

    const equalsButton = document.querySelector('.equals');
    equalsButton.addEventListener('click', () => {
        const currentValue = currentValueElement.value;
        let equationObj;

        if (!itemArray.length && equationArray.length) {
            const lastEquation = equationArray[equationArray.length -1];
            equationObj = {
                num1: parseFloat(currentValue),
                num2: lastEquation.num2,
                op: lastEquation.op
            }
        } else if (!itemArray.length) {
            return currentValue;
        } else {
            itemArray.push(currentValue);
            equationObj = {
                num1: parseFloat(itemArray[0]),
                num2: parseFloat(currentValue),
                op: itemArray[1]
            }
        }

        equationArray.push(equationObj);

        const equationString = 
            `${equationObj['num1']}
            ${equationObj['op']}
            ${equationObj['num2']}`;
        
        calculate(equationString, currentValueElement);

        previousValueElement.textContent = `${equationString} =`;

        newNumberFlag = true;
        itemArray = [];
        console.log(equationArray);
    })

    const clearButtons = document.querySelectorAll('.clear, .clearEntry');
    clearButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            currentValueElement.value = 0;
            if(event.target.classList.contains('clearEntry')) {
                previousValueElement.textContenti = '';
                itemArray = [];
            }
        });
    });

    const deleteButton = document.querySelector('.delete');
    deleteButton.addEventListener('click', () => {
        currentValueElement.value = currentValueElement.value.slice(0, -1);
    });

    const signChangeButton = document.querySelector('.signChange');
    signChangeButton.addEventListener('click', () => {
        currentValueElement.value = parseFloat(currentValueElement.value) * -1;
    });
}

document.addEventListener("DOMContentLoaded", initApp);

const calculate = (equation, currentValueElement) => {
    const regex = /(^[*/=])|(\s)/g;
    equation.replace(regex, '');
    const divByZero = /(\/0)/.test(equation);
    if (divByZero) return currentValueElement.value = 0;
    return currentValueElement.value = eval(equation);
}


