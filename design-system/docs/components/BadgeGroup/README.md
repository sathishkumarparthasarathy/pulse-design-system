A composite badge — a leading addon pill plus a trailing message — for announcements, version tags and "new feature" calls to action.

## When to use

Above a page title or at the top of a feed, to announce one thing. One per view. It is a banner in miniature, not a row label: for that use `Badge`.

## What the consumer provides

`addonText` for the pill and the message as `children`. `trailingIcon` (typically `<ArrowRight />`) signals it leads somewhere; pass `href` to make the whole thing an anchor, or `as="button"` with `onClick`.

```tsx
<BadgeGroup addonText="New" trailingIcon={<ArrowRight />} href="/changelog">
  Adverse action letters
</BadgeGroup>
<BadgeGroup variant="modern" theme="brand" dot addonText="Live">Decision engine</BadgeGroup>
```

## Rules

- `align="trailing"` moves the addon to the right and swaps the padding automatically — use it when the message is the subject and the addon is the qualifier ("Read the integration guide · Docs").
- `dot` only renders in the `modern` variant.
- Only add `trailingIcon` when the group is actually interactive. An arrow on a static badge promises a destination that isn't there.
- Two sizes: `md` (28px) inline, `lg` (36px) as a page-level announcement.
