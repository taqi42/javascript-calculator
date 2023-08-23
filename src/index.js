import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./index.css";

const calcData = [
  { id: "clear", value: "AC" },
  { id: "divide", value: "/" },
  { id: "multiply", value: "x" },
  { id: "seven", value: 7 },
  { id: "eight", value: 8 },
  { id: "nine", value: 9 },
  { id: "subtract", value: "-" },
  { id: "four", value: 4 },
  { id: "five", value: 5 },
  { id: "six", value: 6 },
  { id: "add", value: "+" },
  { id: "one", value: 1 },
  { id: "two", value: 2 },
  { id: "three", value: 3 },
  { id: "equals", value: "=" },
  { id: "zero", value: 0 },
  { id: "decimal", value: "." },
];

const operators = ["AC", "/", "x", "+", "-", "="];

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Display({ input, output }) {
  return (
    <div className="output">
      <span className="result">{output}</span>
      <span id="display" className="input">
        {input}
      </span>
    </div>
  );
}

function Key({ keyData: { id, value }, handleInput }) {
  return (
    <button id={id} onClick={() => handleInput(value)}>
      {value}
    </button>
  );
}

function Keyboard({ handleInput }) {
  return (
    <div className="keys">
      {calcData.map((key) => (
        <Key key={key.id} keyData={key} handleInput={handleInput} />
      ))}
    </div>
  );
}

function App() {
  const [input, setInput] = useState("0");
  const [output, setOutput] = useState("");
  const [calculatorData, setCalculatorData] = useState("");

  function handleSubmit() {
    console.log({ calculatorData });

    try {
      const total = eval(calculatorData.replace(/x/g, "*"));
      if (typeof total === "number" && !isNaN(total)) {
        setInput(total);
        setOutput(`${calculatorData} = ${total}`);
        setCalculatorData(`${total}`);
      } else {
        setInput("NaN");
        setOutput("NaN");
        setCalculatorData("");
      }
    } catch (error) {
      setInput("NaN");
      setOutput("NaN");
      setCalculatorData("");
    }
  }

  function handleClear() {
    setInput("0");
    setOutput("");
    setCalculatorData("");
  }

  function handleNumbers(value) {
    if (!calculatorData.length) {
      setInput(`${value}`);
      setCalculatorData(`${value}`);
    } else {
      if (value === 0 && (calculatorData === "0" || input === "0")) {
        setCalculatorData(`${calculatorData}`);
      } else {
        const lastChar = calculatorData.charAt(calculatorData.length - 1);
        const isLastCharOperator =
          lastChar === "*" || operators.includes(lastChar);

        setInput(isLastCharOperator ? `${value}` : `${input}${value}`);
        setCalculatorData(`${calculatorData}${value}`);
      }
    }
  }

  function dotOperator() {
    const lastChar = calculatorData.charAt(calculatorData.length - 1);
    if (!calculatorData.length) {
      setInput("0.");
      setCalculatorData("0.");
    } else {
      if (lastChar === "*" || operators.includes(lastChar)) {
        setInput("0.");
        setCalculatorData(`${calculatorData} 0.`);
      } else {
        setInput(
          lastChar === "." || input.includes(".") ? `${input}` : `${input}.`
        );
        const formattedValue =
          lastChar === "." || input.includes(".")
            ? `${calculatorData}`
            : `${calculatorData}.`;
        setCalculatorData(formattedValue);
      }
    }
  }

  function handleOperators(value) {
    if (calculatorData.length) {
      setInput(`${value}`);
      const beforeLastChar = calculatorData.charAt(calculatorData.length - 2);

      const beforeLastCharIsOperator =
        operators.includes(beforeLastChar) || beforeLastChar === "*";

      const lastChar = calculatorData.charAt(calculatorData.length - 1);

      const lastCharIsOperator =
        operators.includes(lastChar) || lastChar === "*";

      const validOp = value === "x" ? "*" : value;
      if (
        (lastCharIsOperator && value !== "-") ||
        (beforeLastCharIsOperator && lastCharIsOperator)
      ) {
        if (beforeLastCharIsOperator) {
          const updatedValue = `${calculatorData.substring(
            0,
            calculatorData.length - 2
          )}${validOp}`;
          setCalculatorData(updatedValue);
        } else {
          setCalculatorData(
            `${calculatorData.substring(
              0,
              calculatorData.length - 1
            )}${validOp}`
          );
        }
      } else {
        if (value === "=") {
          try {
            const total = eval(calculatorData.replace(/x/g, "*"));
            setInput(total);
            setOutput(`${calculatorData} = ${total}`);
            setCalculatorData(`${total}`);
          } catch (error) {
            setInput("Error");
            setOutput("Invalid Expression");
            setCalculatorData("");
          }
        } else {
          setCalculatorData(`${calculatorData}${validOp}`);
        }
      }
    }
  }

  function handleInput(value) {
    const number = numbers.find((num) => num === value);
    const operator = operators.find((op) => op === value);

    switch (value) {
      case "=":
        handleSubmit();
        break;
      case "AC":
        handleClear();
        break;
      default:
        if (number !== undefined) {
          handleNumbers(value);
        } else if (value === ".") {
          dotOperator(value);
        } else if (operators.includes(operator)) {
          handleOperators(value);
        }
        break;
    }
  }

  useEffect(() => {
    handleOutput();
  }, [calculatorData]);

  function handleOutput() {
    setOutput(calculatorData);
  }

  return (
    <div className="container">
      <div className="calculator">
        <Display input={input} output={output} />
        <Keyboard handleInput={handleInput} />
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
