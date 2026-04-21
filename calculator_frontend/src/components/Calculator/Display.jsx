import React from "react";
import styles from "./Display.module.css";

// PUBLIC_INTERFACE
export default function Display({ value, pending, isError }) {
  /** Calculator display showing pending expression (if any) and the current value. */
  return (
    <div className={styles.display} role="group" aria-label="Calculator display">
      <div className={styles.pending} aria-label="Pending operation">
        {pending || "\u00A0"}
      </div>
      <output
        className={styles.value}
        aria-label="Current value"
        aria-live="polite"
        aria-atomic="true"
        data-error={isError ? "true" : "false"}
      >
        {value}
      </output>
    </div>
  );
}
