OAuth sign-in button for seven providers, in a neutral default mode and a brand mode that uses each provider's own ground.

## When to use

On sign-in and sign-up screens only. Stack the providers the credit union has actually enabled, in one column at `fullWidth`, under or above the email form — never mixed into a form's field flow.

## What the consumer provides

`provider`, and `href` when the flow is a redirect (the component renders an `<a>` instead of a `<button>`). The label defaults to "Sign in with <Provider>"; override it with `children` for a sign-up screen. `fullWidth` stretches it to the column.

```tsx
<SocialButton provider="google" href={googleOAuthUrl} fullWidth />
<SocialButton provider="microsoft" mode="brand">Sign up with Microsoft</SocialButton>
```

## Rules

- Keep one mode across a screen. `default` (white surface, `border-gray-300`, colour mark) is the house style; `brand` is for marketing pages where the provider's identity should lead.
- The marks are full-colour SVGs, not `currentColor` — they must not be recoloured, dimmed or monochromed, in either mode. That is a provider brand requirement, not a style choice.
- Don't substitute a Lucide glyph for a provider mark.
- Facebook `#1877F2` and LinkedIn `#0A66C2` are the providers' own values, hard-coded in the component rather than drawn from the palette. Leave them alone.
