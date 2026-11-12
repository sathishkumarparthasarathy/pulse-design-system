The surface that groups related content — a shell plus `CardHeader`, `CardTitle`, `CardDescription`, `CardContent` and `CardFooter`.

## When to use

To bound one subject: an application, a metric, a settings section. Not as a decorative box around a paragraph, and not nested inside another card.

## What the consumer provides

The parts, in order. The shell owns the border, radius and overflow; the parts own their padding and dividers, so don't add your own.

```tsx
<Card>
  <CardHeader>
    <CardTitle>Application #48219</CardTitle>
    <CardDescription>Auto loan · submitted 2 hours ago</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter>
    <Button size="sm">Open decision</Button>
    <Button size="sm" hierarchy="secondary-gray">Assign</Button>
  </CardFooter>
</Card>
```

## Rules

- Padding is fixed: header and content `px-6 py-5`, footer `px-6 py-4`. The footer also takes a `bg-gray-50` ground and a top hairline, which is what separates actions from content.
- `elevation="xs"` and `radius="xl"` are the defaults and should stay the defaults. `md`/`lg` only where cards float over a busy ground; `flat` inside an already-bordered panel.
- `interactive` adds a hover lift and a pointer — use it only when the whole card is a link or opens something. Then the card needs its own keyboard affordance; a hover-only target is not reachable.
- `CardTitle` renders an `<h3>`. Keep the document's heading order sane around it.
- A card with only `CardContent` is fine — the header is not required.
