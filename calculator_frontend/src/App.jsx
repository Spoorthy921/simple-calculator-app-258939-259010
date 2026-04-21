import React from "react";
import Calculator from "./components/Calculator/Calculator.jsx";
import styles from "./App.module.css";

// PUBLIC_INTERFACE
export default function App() {
  /** Top-level application component. */
  return (
    <div className={styles.app}>
      <main className={styles.main} aria-label="Calculator application">
        <header className={styles.header}>
          <h1 className={styles.title}>Calculator</h1>
          <p className={styles.subtitle}>Basic arithmetic with keyboard support</p>
        </header>

        <Calculator />
      </main>
    </div>
  );
}
