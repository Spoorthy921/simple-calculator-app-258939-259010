import { useCallback, useMemo, useState } from "react";

const OPERATORS = /** @type {const} */ ({
  "+": "+",
  "-": "-",
  "*": "×",
  "/": "÷"
});

/**
 * Returns true if the string is a valid "in-progress" numeric token.
 * Examples: "0", "12", "12.", "12.3", "-0.5"
 */
function isInProgressNumberToken(token) {
  return /^-?\d+(\.\d*)?$/.test(token);
}

function normalizeLeadingZeros(token) {
  // Preserve in-progress decimals like "0." or "00." -> "0."
  if (token.includes(".")) {
    const [intPart, fracPart] = token.split(".");
    const normalizedInt =
      intPart.replace(/^(-?)0+(?=\d)/, "$1") || (intPart.startsWith("-") ? "-0" : "0");
    return `${normalizedInt}.${fracPart}`;
  }

  // Normalize integer leading zeros (keep single "0" or "-0")
  if (/^-?0+\d+$/.test(token)) {
    return token.replace(/^(-?)0+(?=\d)/, "$1");
  }
  return token;
}

function formatForDisplay(token) {
  // We keep user-typed in-progress tokens, including trailing decimal "12."
  // For extremely long tokens, allow horizontal scroll in UI; do not truncate here.
  return token;
}

function compute(aToken, operator, bToken) {
  const a = Number(aToken);
  const b = Number(bToken);

  if (!Number.isFinite(a) || !Number.isFinite(b)) return { ok: false, value: "Error" };

  switch (operator) {
    case "+":
      return { ok: true, value: String(a + b) };
    case "-":
      return { ok: true, value: String(a - b) };
    case "*":
      return { ok: true, value: String(a * b) };
    case "/":
      if (b === 0) return { ok: false, value: "Error" };
      return { ok: true, value: String(a / b) };
    default:
      return { ok: false, value: "Error" };
  }
}

function getOperatorDisplay(op) {
  return OPERATORS[op] ?? op;
}

// PUBLIC_INTERFACE
export function useCalculator() {
  /**
   * Calculator state + actions.
   *
   * State model:
   * - entry: string token being edited / current displayed numeric token ("0" by default)
   * - previous: previous operand token when an operator is pending, else null
   * - operator: one of "+", "-", "*", "/" when pending, else null
   * - overwriteEntry: when true, the next digit/decimal starts a fresh entry (used after operator selection or equals)
   * - error: when true, display is "Error" and only AC/C/digits can recover (C clears entry, AC clears all)
   */
  const [entry, setEntry] = useState("0");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwriteEntry, setOverwriteEntry] = useState(false);
  const [error, setError] = useState(false);

  const displayValue = useMemo(() => {
    if (error) return "Error";
    return formatForDisplay(entry);
  }, [entry, error]);

  const pendingLine = useMemo(() => {
    if (!previous || !operator) return "";
    return `${previous} ${getOperatorDisplay(operator)}`;
  }, [previous, operator]);

  const clearAll = useCallback(() => {
    setEntry("0");
    setPrevious(null);
    setOperator(null);
    setOverwriteEntry(false);
    setError(false);
  }, []);

  const clearEntry = useCallback(() => {
    // "C" clears only the active entry, preserving pending operator/previous.
    setEntry("0");
    setOverwriteEntry(true);
    setError(false);
  }, []);

  const appendDigit = useCallback(
    (digit) => {
      if (error) {
        // Starting fresh after error with a digit
        setError(false);
        setPrevious(null);
        setOperator(null);
        setOverwriteEntry(false);
        setEntry(digit);
        return;
      }

      setEntry((cur) => {
        const starting = overwriteEntry ? "0" : cur;

        // Replace "0" with non-zero digits for consistent leading-zero behavior.
        if (starting === "0") {
          return digit === "0" ? "0" : digit;
        }

        const next = normalizeLeadingZeros(`${starting}${digit}`);
        return isInProgressNumberToken(next) ? next : starting;
      });

      setOverwriteEntry(false);
    },
    [error, overwriteEntry]
  );

  const appendDecimal = useCallback(() => {
    if (error) {
      setError(false);
      setPrevious(null);
      setOperator(null);
      setOverwriteEntry(false);
      setEntry("0.");
      return;
    }

    setEntry((cur) => {
      const starting = overwriteEntry ? "0" : cur;
      if (starting.includes(".")) return starting;
      return `${starting}.`;
    });
    setOverwriteEntry(false);
  }, [error, overwriteEntry]);

  const backspace = useCallback(() => {
    if (error) {
      // Backspace on error behaves like clear entry.
      clearEntry();
      return;
    }

    setEntry((cur) => {
      if (overwriteEntry) return "0";
      if (cur.length <= 1) return "0";
      if (cur.length === 2 && cur.startsWith("-")) return "0";

      const next = cur.slice(0, -1);
      // If we end up with "-" or "-0" edge cases, normalize to "0"
      if (next === "-" || next === "") return "0";
      return next;
    });
  }, [clearEntry, error, overwriteEntry]);

  const chooseOperator = useCallback(
    (nextOp) => {
      if (error) return;

      // If there is already a pending operation and user has typed a new entry,
      // perform immediate chaining typical of calculators.
      if (previous !== null && operator !== null && !overwriteEntry) {
        const result = compute(previous, operator, entry);
        if (!result.ok) {
          setError(true);
          setEntry("0");
          setPrevious(null);
          setOperator(null);
          setOverwriteEntry(true);
          return;
        }
        setPrevious(result.value);
        setEntry(result.value);
        setOperator(nextOp);
        setOverwriteEntry(true);
        return;
      }

      // If no previous yet, set it from current entry.
      if (previous === null) {
        setPrevious(entry);
      }

      setOperator(nextOp);
      setOverwriteEntry(true);
    },
    [entry, error, operator, overwriteEntry, previous]
  );

  const equals = useCallback(() => {
    if (error) return;
    if (previous === null || operator === null) return;

    // If user pressed "=" immediately after operator, treat as no-op (keep state).
    if (overwriteEntry) return;

    const result = compute(previous, operator, entry);
    if (!result.ok) {
      setError(true);
      setEntry("0");
      setPrevious(null);
      setOperator(null);
      setOverwriteEntry(true);
      return;
    }

    setEntry(result.value);
    setPrevious(null);
    setOperator(null);
    setOverwriteEntry(true);
  }, [entry, error, operator, overwriteEntry, previous]);

  const onKeyDown = useCallback(
    (e) => {
      // Avoid interfering with browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      const { key } = e;

      if (key >= "0" && key <= "9") {
        e.preventDefault();
        appendDigit(key);
        return;
      }

      if (key === ".") {
        e.preventDefault();
        appendDecimal();
        return;
      }

      if (key === "Backspace" || key === "Delete") {
        e.preventDefault();
        backspace();
        return;
      }

      if (key === "Escape") {
        e.preventDefault();
        clearAll();
        return;
      }

      if (key === "Enter" || key === "=") {
        e.preventDefault();
        equals();
        return;
      }

      if (key === "+" || key === "-" || key === "*" || key === "/") {
        e.preventDefault();
        chooseOperator(key);
      }
    },
    [appendDecimal, appendDigit, backspace, chooseOperator, clearAll, equals]
  );

  const ui = useMemo(
    () => ({
      displayValue,
      pendingLine,
      operatorDisplay: operator ? getOperatorDisplay(operator) : "",
      isError: error
    }),
    [displayValue, error, operator, pendingLine]
  );

  const actions = useMemo(
    () => ({
      appendDigit,
      appendDecimal,
      backspace,
      clearAll,
      clearEntry,
      chooseOperator,
      equals,
      onKeyDown
    }),
    [appendDecimal, appendDigit, backspace, chooseOperator, clearAll, clearEntry, equals, onKeyDown]
  );

  return { ui, actions, state: { entry, previous, operator, overwriteEntry, error } };
}
