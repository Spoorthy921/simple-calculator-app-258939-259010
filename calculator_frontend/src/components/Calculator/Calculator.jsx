import React, { useEffect, useRef } from "react";
import { useCalculator } from "../../hooks/useCalculator.js";
import Display from "./Display.jsx";
import Keypad from "./Keypad.jsx";
import styles from "./Calculator.module.css";

// PUBLIC_INTERFACE
export default function Calculator() {
  /** Calculator container wiring UI components to calculator state/actions. */
  const { ui, actions, state } = useCalculator();
  const rootRef = useRef(null);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    // Keyboard support: listen when focus is within calculator region.
    const handler = (e) => actions.onKeyDown(e);
    node.addEventListener("keydown", handler);
    return () => node.removeEventListener("keydown", handler);
  }, [actions]);

  // Determine whether the left-top clear button should be "AC" or "C".
  // Rule: show "AC" when calculator is in its initial fully-clear state; else show "C".
  const isInitial =
    !state.error &&
    state.entry === "0" &&
    state.previous === null &&
    state.operator === null &&
    state.overwriteEntry === false;

  const clearLabel = isInitial ? "AC" : "C";
  const onClear = isInitial ? actions.clearAll : actions.clearEntry;

  return (
    <section
      className={styles.calculator}
      aria-label="Calculator"
      ref={rootRef}
      tabIndex={0}
    >
      <Display value={ui.displayValue} pending={ui.pendingLine} isError={ui.isError} />
      <Keypad
        clearLabel={clearLabel}
        onClear={onClear}
        onAllClear={actions.clearAll}
        onBackspace={actions.backspace}
        onDigit={actions.appendDigit}
        onDecimal={actions.appendDecimal}
        onOperator={actions.chooseOperator}
        onEquals={actions.equals}
      />
      <p className={styles.hint} aria-live="polite">
        Keyboard: digits, <kbd>.</kbd>, <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd> <kbd>/</kbd>,{" "}
        <kbd>Enter</kbd>=, <kbd>Backspace</kbd>, <kbd>Esc</kbd> (AC)
      </p>
    </section>
  );
}
