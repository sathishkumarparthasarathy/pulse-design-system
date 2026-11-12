A person's mark — image, initials or a generic icon — in seven sizes, with an optional status dot, plus `AvatarGroup` and `AvatarProfile`.

## When to use

To identify a human: assignee on an application, author of a note, member on a profile card, participants on a shared queue. Not for logos, institutions or files.

## What the consumer provides

`name` always — it drives the initials, the hashed background colour and the `aria-label`. `src` when a photo exists; the component falls back to initials by itself if the image fails. `status` when presence matters.

```tsx
<Avatar src={user.photo} name="Priya Raman" status="online" />
<Avatar name="Priya Raman" />          {/* initials, colour hashed from the name */}
<Avatar />                              {/* anonymous — generic user icon */}

<AvatarGroup max={4} total={9}>
  {members.map(m => <Avatar key={m.id} name={m.name} src={m.photo} />)}
</AvatarGroup>

<AvatarProfile title="Priya Raman" subtitle="Credit risk analyst"
               avatarProps={{ name: "Priya Raman", status: "online" }} />
```

## Rules

- The initials colour is hashed from the name, so the same person is the same colour everywhere. Don't override it — that breaks recognition across screens.
- `AvatarGroup` sets `size` and `bordered` on its children itself; don't set them on the child avatars. Pass `total` when the real count exceeds the avatars you render, so the `+N` pill is accurate.
- Status dots: `online` success, `busy` error, `away` warning, `offline` gray. Only show one where presence is live data — a stale dot is worse than none.
- `md` (40px) is the default; `xs`/`sm` inside table rows, `2xl`/`3xl` on a profile header.
- `shape="square"` (`radius-md`) is for a team or an entity rather than a person.
