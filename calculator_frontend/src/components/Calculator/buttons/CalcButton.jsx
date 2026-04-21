import React from "react";
import styles from "./CalcButton.module.css";

// PUBLIC_INTERFACE
export default function CalcButton({
  children,
  onClick,
  variant = "default",
  className = "",
  ariaLabel
}) {
  /** Reusable calculator button with accessible labeling and focus styles. */
  const cls = `${styles.button} ${styles[variant]} ${className}`.trim();

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
