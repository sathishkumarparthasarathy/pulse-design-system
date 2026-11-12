A dedicated icon-only X for dismissing a modal, drawer, toast or banner — four sizes, three themes.

## When to use

Wherever something is dismissed rather than acted on. It is not a general icon button: a close affordance is the only thing it renders.

## What the consumer provides

`onClick`, and an `aria-label` when "Close" isn't right ("Dismiss notification", "Remove filter"). Nothing else — the X is built in.

```tsx
<CloseButton onClick={close} />
<CloseButton size="sm" theme="brand" aria-label="Dismiss announcement" />
```

## Rules

- `md` (36px) in modal and drawer headers, `sm` (32px) inside a toast or banner, `lg`/`xl` only on a full-screen surface.
- `theme="brand"` is for brand-tinted grounds (`brand-50`, `brand-100`); `ghost` drops the hover fill where a background would collide, such as over an image.
- Top-right of the surface, aligned to the title's optical centre.
- Disabled drops to 40% opacity — don't disable a close button unless the surface genuinely cannot be dismissed.
