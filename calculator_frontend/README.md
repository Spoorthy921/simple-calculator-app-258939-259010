# Calculator Frontend

A simple React calculator with:
- Always-visible display (defaults to `0`)
- Pending operator / previous operand indicator
- Digit + decimal entry (single decimal per operand, supports `12.` in-progress)
- Backspace editing of current operand only
- Clear Entry (**C**) vs All Clear (**AC**) behavior
- Responsive layout and baseline accessibility (semantic buttons, focus styles, keyboard mappings)

## Development

Install dependencies:

```bash
npm install
```

Run the app:

```bash
npm run dev
```

Keyboard shortcuts:
- Digits `0-9`
- Decimal `.`
- Operators `+ - * /`
- Equals: `Enter` or `=`
- Backspace/Delete: delete last character
- Escape: All Clear (AC)
"
