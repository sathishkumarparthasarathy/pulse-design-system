The text field, plus the `Label`, `HelperText` and `Field` parts that wrap it into a complete form row.

## When to use

For every single-line value the user types. `Field` is the normal entry point — it wires the label, the required mark, the hint and the helper or error text together so the three never drift apart.

## What the consumer provides

Through `Field`: `label`, `htmlFor` matched to the input's `id`, and either `helper` or `error` (passing `error` sets `invalid` on the helper text and supplies the `AlertCircle` mark — you still set `invalid` on the `Input` itself). Through `Input`: the native input props, plus one of `leadingIcon`/`trailingIcon` (20px, positioned for you) or `leadingAddon`/`trailingAddon` (text chips like `$` or `https://`).

```tsx
<Field label="Member email" required htmlFor="email"
       helper="We send the decision letter here.">
  <Input id="email" type="email" leadingIcon={<Mail />}
         placeholder="name@creditunion.org" />
</Field>

<Field label="Annual income" htmlFor="income" error="Enter a whole number without separators.">
  <Input id="income" invalid leadingAddon="$" className="min-w-0" />
</Field>
```

## Rules

- Icons and addons are alternatives, not a pair — the component takes one branch or the other, and passing both renders the addon layout only.
- In the addon layout the inner input keeps its intrinsic width; inside a grid or flex column add `className="min-w-0"` or the addons push past the border.
- `md` (40px) matches a `md` Button, so they align on one row. `sm` for dense filter bars, `lg` for a standalone sign-in form.
- Placeholder is an example of the format, never the label. Every input gets a real `Label`.
- The focus ring switches to `shadow-ring-error` while `invalid` — set `invalid` on the input, not just the error copy, or the field looks fine and reads broken.
- `HelperText` holds one line. Longer guidance belongs above the field.
