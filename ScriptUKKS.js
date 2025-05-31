    let display = document.getElementById('display');
    let expression = '';

    function append(value) {
      const ops = ['+', '-', '×', '÷'];
      const lastChar = expression.slice(-1);

      if (ops.includes(value)) {
        if (expression === '') {
          if (value === '-') {
            expression += value;
          }
          return;
        }
        if (ops.includes(lastChar)) {
          if (!(value === '-' && lastChar !== '-')) { 
            return;
          }
        }
      }
      expression += value;
      display.value = expression;
    }

    function setOperator(op) {
      const lastChar = expression.slice(-1);
      const ops = ['+', '-', '×', '÷'];

      if (expression === '') {
        if (op === '-') {
          expression += op;
          display.value = expression;
        }
        return;
      }

      if (ops.includes(lastChar)) {
        if (!(op === '-' && lastChar !== '-')) {
          expression = expression.slice(0, -1);
        }
      }
      expression += op;
      display.value = expression;
    }

    function clearDisplay() {
      expression = '';
      display.value = '';
    }

    function backspace() {
      expression = expression.slice(0, -1);
      display.value = expression;
    }

    function calculate() {
      let tokens = tokenizeWithNegatives(expression);
      if (!tokens || tokens.length === 0) {
        display.value = 'Input salah';
        expression = '';
        return;
      }

      tokens = processPercent(tokens);
      tokens = processOperators(tokens, ['×', '÷']);
      tokens = processOperators(tokens, ['+', '-']);

      if (tokens.length === 1) {
        display.value = tokens[0];
        expression = tokens[0];
      } else {
        display.value = 'Error';
        expression = '';
      }
    }

    function tokenizeWithNegatives(expr) {
      const tokens = [];
      let current = '';
      for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if ('+-×÷'.includes(char)) {
          if (char === '-') {
            if (i === 0 || ('+-×÷'.includes(expr[i - 1]))) {
              current += char;
              continue;
            }
          }

          if (current === '') return null;
          tokens.push(current);
          tokens.push(char);
          current = '';
        } else {
          current += char;
        }
      }
      if (current !== '') tokens.push(current);
      return tokens;
    }

    function processPercent(tokens) {
      let result = [];
      for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        if (token.endsWith('%')) {
          let percentValue = parseFloat(token.replace('%', '')) / 100;
          if (i >= 2 && ['+', '-'].includes(tokens[i - 1])) {
            const base = parseFloat(tokens[i - 2]);
            percentValue = base * percentValue;
          }
          result.push(percentValue.toString());
        } else {
          result.push(token);
        }
      }
      return result;
    }

    function processOperators(tokens, operators) {
      let result = [...tokens];
      let i = 0;

      while (i < result.length) {
        const token = result[i];
        if (operators.includes(token)) {
          const left = parseFloat(result[i - 1]);
          const right = parseFloat(result[i + 1]);
          let tempResult = 0;

          switch (token) {
            case '×':
              tempResult = left * right;
              break;
            case '÷':
              if (right === 0) {
                display.value = 'Tidak bisa ÷ 0';
                expression = '';
                return [];
              }
              tempResult = left / right;
              break;
            case '+':
              tempResult = left + right;
              break;
            case '-':
              tempResult = left - right;
              break;
            default:
              return [];
          }

          result.splice(i - 1, 3, tempResult.toString());
          i = i - 1;
        } else {
          i++;
        }
      }
      return result;
    }