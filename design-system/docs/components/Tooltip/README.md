A Radix-backed tooltip with a one-line API for the common case and full composition for the rest, plus `TooltipRich` for a title, description and keyboard shortcut.

## When to use

To name an icon-only control, or to add a short qualifier the label has no room for. Never for anything the user must read to proceed — a tooltip is unreachable on touch and gone on blur. That belongs in `HelperText` or on the surface itself.

## What the consumer provides

A single `TooltipProvider` near the root of the app, then a trigger as `children` and the body as `content`. The trigger is rendered through `asChild`, so it must be a single element that forwards its ref — a `Button` works, a bare string does not.

```tsx
<TooltipProvider delayDuration={150}>
  …
  <Tooltip content="Re-run the model with the current bureau pull">
    <Button hierarchy="secondary-gray">Rescore</Button>
  </Tooltip>

  <TooltipRich title="Save decision"
               description="Writes the adverse action reason codes and notifies the member."
               shortcut={["⌘", "S"]}>
    <Button>Save</Button>
  </TooltipRich>
</TooltipProvider>
```

## Rules

- Without a `TooltipProvider` ancestor Radix throws. One per app, not one per tooltip.
- A falsy `content`, or `disabled`, renders the trigger naked — so a conditional tooltip needs no branch in the consumer.
- `dark` (`gray-900`) is the default; `light` needs its `border-gray-200` to separate from a white ground and is for tooltips over dark or photographic surfaces.
- Content caps at `max-w-xs`; `TooltipRich` at 260px. If it doesn't fit, it isn't a tooltip.
- The arrow is on by default. Turn it off (`arrow={false}`) only when the tooltip is wider than its trigger and the arrow lands off-centre.
- Keep `delayDuration` around 150–200ms. Zero makes a toolbar flicker as the pointer crosses it.
