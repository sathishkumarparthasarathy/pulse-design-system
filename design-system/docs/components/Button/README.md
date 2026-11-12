The page's commitment control — twelve hierarchies across five sizes, each carrying a different weight of intent.

## When to use

One `primary` per view, on the action that moves the task forward. Everything else steps down: `secondary-gray` for cancel and back, `secondary-color` for an on-brand alternative that isn't the commit, `tertiary-*` for low-emphasis actions inside rows and toolbars, `link-*` for actions inside a sentence. `destructive-*` for anything that removes data. `primary-gradient` is opt-in and belongs on marketing heroes, not in the product.

## What the consumer provides

The label as `children`, and optionally `leadingIcon` / `trailingIcon` as rendered icon elements (the button sizes them to 20px itself — pass `<Mail />`, not `<Mail className="h-5 w-5" />`). `loading` swaps the leading slot for a spinner and disables the button. `asChild` renders through Radix `Slot`, so a link action is `<Button asChild><a href="…">…</a></Button>`.

```tsx
<Button hierarchy="primary" leadingIcon={<Plus />}>New application</Button>
<Button hierarchy="secondary-gray" size="sm">Cancel</Button>
<Button hierarchy="destructive-primary" loading>Deleting</Button>
<Button iconOnly aria-label="Add"><Plus /></Button>
```

## Rules

- `md` (40px) is the default; `sm` (36px) for table rows and toolbars, `lg`/`xl` for landing pages, `2xl` (60px) for a hero only.
- `iconOnly` needs an `aria-label` — there is no text to read.
- The focus ring is `shadow-ring-brand` (or `shadow-ring-error` on destructive). Don't replace it with an outline; `*:focus { outline: none }` is global.
- Don't build a button out of `Badge` or a bare `<button>`. Don't change the radius — every size is `radius-md`.
- White on `brand-600` measures 3.47:1. It is kept as the code has it, but don't repeat the pairing for small text elsewhere.
