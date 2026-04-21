import React from "react";
import CalcButton from "./buttons/CalcButton.jsx";
import styles from "./Keypad.module.css";

const OP = {
  add: "+",
  sub: "-",
  mul: "*",
  div: "/"
};

// PUBLIC_INTERFACE
export default function Keypad({
  clearLabel,
  onClear,
  onAllClear,
  onBackspace,
  onDigit,
  onDecimal,
  onOperator,
  onEquals
}) {
  /** Calculator keypad grid of buttons. */
  return (
    <div className={styles.keypad} role="group" aria-label="Calculator keypad">
      <CalcButton
        variant="control"
        className={styles.span2}
        onClick={onClear}
        ariaLabel={clearLabel === "AC" ? "All clear" : "Clear entry"}
      >
        {clearLabel}
      </CalcButton>

      <CalcButton variant="control" onClick={onBackspace} ariaLabel="Backspace">
        ⌫
      </CalcButton>

      <CalcButton variant="operator" onClick={() => onOperator(OP.div)} ariaLabel="Divide">
        ÷
      </CalcButton>

      <CalcButton onClick={() => onDigit("7")}>7</CalcButton>
      <CalcButton onClick={() => onDigit("8")}>8</CalcButton>
      <CalcButton onClick={() => onDigit("9")}>9</CalcButton>
      <CalcButton variant="operator" onClick={() => onOperator(OP.mul)} ariaLabel="Multiply">
        ×
      </CalcButton>

      <CalcButton onClick={() => onDigit("4")}>4</CalcButton>
      <CalcButton onClick={() => onDigit("5")}>5</CalcButton>
      <CalcButton onClick={() => onDigit("6")}>6</CalcButton>
      <CalcButton variant="operator" onClick={() => onOperator(OP.sub)} ariaLabel="Subtract">
        −
      </CalcButton>

      <CalcButton onClick={() => onDigit("1")}>1</CalcButton>
      <CalcButton onClick={() => onDigit("2")}>2</CalcButton>
      <CalcButton onClick={() => onDigit("3")}>3</CalcButton>
      <CalcButton variant="operator" onClick={() => onOperator(OP.add)} ariaLabel="Add">
        +
      </CalcButton>

      <CalcButton className={styles.span2} onClick={() => onDigit("0")}>
        0
      </CalcButton>
      <CalcButton onClick={onDecimal} ariaLabel="Decimal point">
        .
      </CalcButton>
      <CalcButton variant="equals" onClick={onEquals} ariaLabel="Equals">
        =
      </CalcButton>

      {/* Hidden: keep prop to avoid unused warnings in future expansion */}
      <span className={styles.srOnly} aria-hidden="true">
        {typeof onAllClear}
      </span>
    </div>
  );
}
