function eval() {
    // Do not use eval!!!
    return;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];

const OPERATORS = {
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
    DIVISION: '/',
    OPENING: '(',
    CLOSING: ')'
}


function expressionCalculator(expr) {
    const stack = [
        {
            result: 0,
            product: null,
            quotient: null,
            currentNumber: ''
        }
    ];

    const completeSubExpression = (data, sign) => {
        if (data.currentNumber) {
            if (data.product !== null) {
                data.result += data.product * +data.currentNumber;
                data.product = null;
            } else if (data.quotient !== null) {
                if (data.currentNumber === '0') {
                    throw new Error('TypeError: Division by zero.');
                }
                data.result += data.quotient / +data.currentNumber;
                data.quotient = null;
            } else {
                data.result += +data.currentNumber;
            }
        }
        data.currentNumber = sign;
    }

    for (let i = 0; i < expr.length; i++) {
        let data = stack[stack.length-1];

        if (DIGITS.includes(expr[i])) {
            data.currentNumber += expr[i];
        }

        if (expr[i] === OPERATORS.MULTIPLICATION) {
            if (data.product === null) {
                if (data.quotient !== null) {
                    if (data.currentNumber === '0') {
                        throw new Error('TypeError: Division by zero.');
                    }
                    data.product = data.quotient / +data.currentNumber;
                    data.quotient = null;
                } else {
                    data.product = +data.currentNumber;
                }
            } else {
                data.product *= +data.currentNumber;
            }
            data.currentNumber = '';
        } else if (expr[i] === OPERATORS.DIVISION) {
            if (data.quotient === null) {
                if (data.product !== null) {
                    data.quotient = data.product * +data.currentNumber;
                    data.product = null;
                } else {
                    data.quotient = +data.currentNumber;
                }
            } else {
                if (data.currentNumber === '0') {
                    throw new Error('TypeError: Division by zero.');
                }
                data.quotient /= +data.currentNumber;
            }
            data.currentNumber = '';
        } else if (expr[i] === OPERATORS.OPENING) {
            stack.push({
                result: 0,
                product: null,
                quotient: null,
                currentNumber: ''
            })
            
        } else if (expr[i] === OPERATORS.CLOSING) {
            if (stack.length === 1) {
                throw new Error('ExpressionError: Brackets must be paired');
            }
            completeSubExpression(data, '');
            const bracketsResult = data.result;
            stack.pop();
            data = stack[stack.length-1];
            data.currentNumber = data.currentNumber === '-' ? `${-bracketsResult}` : `${bracketsResult}`;
        }

        if (expr[i] === OPERATORS.ADDITION || expr[i] === OPERATORS.SUBTRACTION || i === expr.length - 1) {
            completeSubExpression(data, expr[i]);
        }
    }
    if (stack.length > 1) {
        throw new Error('ExpressionError: Brackets must be paired');
    }
    return stack[0].result;
}


module.exports = {
    expressionCalculator
}