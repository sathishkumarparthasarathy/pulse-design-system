import * as React from "react";
import { ToastProvider, ToastViewport, Toast, type ToastIntent, type ToastLayout } from "./Toast";
import { cn } from "@/lib/cn";

/**
 * PULSE Toaster — the mount point + imperative API.
 *
 * Usage:
 *   // App root
 *   <Toaster />
 *
 *   // Anywhere
 *   import { toast } from "@/components";
 *   toast({ intent: "success", subject: "Saved.", message: "Draft is safe." });
 *   toast.loading({ subject: "Uploading…" }).update({ intent: "success", subject: "Done." });
 *
 * Features in v1:
 *   - `dedupeKey` merges repeated toasts into one with an ×N pill + timer restart
 *   - auto-dismiss 5s / 7s with action / never when persistent | loading | busy
 *   - `onAction` returning a Promise → toast swaps to `busy` state until resolved
 *   - store caps at `max` (default 3) — oldest drops when a new one arrives
 *   - compact at top of the stack, full-width toasts at the very bottom
 *   - mobile (<640px) reflows everything to a full-width bar
 *   - `insetLeft` / `insetRight` / `bottomOffset` for layouts with side nav or bottom bar
 *   - Radix handles pause-on-hover/focus + Esc-to-close + swipe natively
 *
 * Not yet in v1 (flagged for follow-up):
 *   - separate cap for compact (3) vs full (2) — current cap is combined
 *   - "+N more" expand UI — the cap-and-drop approach doesn't need one for v1
 */

/* ─── Types ─── */

export interface ToastInput {
  intent?: ToastIntent;
  subject?: React.ReactNode;
  message?: React.ReactNode;
  layout?: ToastLayout;
  action?: React.ReactNode;
  actionVariant?: "text" | "primary";
  onAction?: () => void | Promise<void>;
  persistent?: boolean;
  dedupeKey?: string;
  wrap?: boolean;
  /** Override default duration (ms). Use `Infinity` for no auto-dismiss. */
  duration?: number;
}

export interface ToastItem extends ToastInput {
  id: string;
  state: "default" | "loading" | "busy";
  count: number;
  /** Increments on each update — forces Radix Root remount so the timer restarts. */
  renderKey: number;
  createdAt: number;
}

export interface ToastHandle {
  id: string;
  update: (patch: Partial<ToastInput> & { state?: ToastItem["state"] }) => void;
  dismiss: () => void;
}

/* ─── Module-level store — lets `toast()` work from anywhere ─── */

type Listener = (items: ToastItem[]) => void;

let nextId = 0;
const items: ToastItem[] = [];
const listeners = new Set<Listener>();
// Updated by <Toaster /> on mount so the store respects its `max` prop
let storeMax = 3;

function notify() {
  const snapshot = items.slice();
  listeners.forEach((l) => l(snapshot));
}

function trimToMax() {
  while (items.length > storeMax) items.shift();
}

function resolveDuration(item: ToastItem): number {
  if (typeof item.duration === "number") return item.duration;
  if (item.persistent) return Infinity;
  if (item.state === "loading" || item.state === "busy") return Infinity;
  if (item.action) return 7000;
  return 5000;
}

function addItem(input: ToastInput, presetState: ToastItem["state"] = "default"): ToastHandle {
  // Dedupe — merge into an existing visible toast with the same key
  if (input.dedupeKey) {
    const existing = items.find((t) => t.dedupeKey === input.dedupeKey);
    if (existing) {
      existing.count += 1;
      existing.renderKey += 1;
      // Also refresh the latest copy's subject/message/action (most recent wins)
      Object.assign(existing, {
        subject: input.subject ?? existing.subject,
        message: input.message ?? existing.message,
        action: input.action ?? existing.action,
        intent: input.intent ?? existing.intent,
      });
      notify();
      return makeHandle(existing.id);
    }
  }

  const id = `toast-${++nextId}`;
  const item: ToastItem = {
    ...input,
    id,
    state: presetState,
    count: 1,
    renderKey: 0,
    createdAt: Date.now(),
  };
  items.push(item);
  trimToMax();
  notify();
  return makeHandle(id);
}

function updateItem(id: string, patch: Partial<ToastInput> & { state?: ToastItem["state"] }) {
  const existing = items.find((t) => t.id === id);
  if (!existing) return;
  Object.assign(existing, patch);
  existing.renderKey += 1;
  notify();
}

function dismissItem(id: string) {
  const idx = items.findIndex((t) => t.id === id);
  if (idx === -1) return;
  items.splice(idx, 1);
  notify();
}

function clearAll() {
  items.length = 0;
  notify();
}

function makeHandle(id: string): ToastHandle {
  return {
    id,
    update: (patch) => updateItem(id, patch),
    dismiss: () => dismissItem(id),
  };
}

/* ─── Public imperative API ─── */

type ToastFn = ((input: ToastInput) => ToastHandle) & {
  loading: (input: ToastInput) => ToastHandle;
  dismiss: (id: string) => void;
  clear: () => void;
};

export const toast: ToastFn = ((input: ToastInput) => addItem(input, "default")) as ToastFn;
toast.loading = (input: ToastInput) => addItem({ persistent: true, ...input }, "loading");
toast.dismiss = (id: string) => dismissItem(id);
toast.clear = () => clearAll();

/* ─── React hook — subscribe to the store ─── */

function useToasts(): ToastItem[] {
  const [snapshot, setSnapshot] = React.useState<ToastItem[]>(() => items.slice());
  React.useEffect(() => {
    const listener: Listener = (next) => setSnapshot(next);
    listeners.add(listener);
    // Catch anything that fired between mount and subscription
    listener(items.slice());
    return () => { listeners.delete(listener); };
  }, []);
  return snapshot;
}

/* ─── Toaster — single mount point ─── */

export interface ToasterProps {
  /** Max toasts visible before overflow (combined compact + full). Default 3. */
  max?: number;
  /** Horizontal inset — useful when a left side nav is open. */
  insetLeft?: number;
  /** Horizontal inset — useful when a right drawer is open. */
  insetRight?: number;
  /** Lift the stack off the bottom edge — useful when a bottom nav bar is present. */
  bottomOffset?: number;
  /** Override the sm breakpoint below which everything reflows to a bar. */
  mobileBreakpoint?: number;
  /** Swipe direction on touch devices. Default "right". */
  swipeDirection?: "right" | "left" | "up" | "down";
}

export function Toaster({
  max = 3,
  insetLeft = 0,
  insetRight = 0,
  bottomOffset = 24,
  swipeDirection = "right",
}: ToasterProps) {
  // Push the cap down to the module-level store so `toast()` from anywhere
  // respects it. Only one Toaster should mount at a time.
  React.useEffect(() => {
    storeMax = max;
  }, [max]);

  const toasts = useToasts();

  // Order the visible stack: compact first (above), full-width at the bottom.
  const ordered = [
    ...toasts.filter((t) => (t.layout ?? "compact") === "compact"),
    ...toasts.filter((t) => t.layout === "full"),
  ];

  return (
    <ToastProvider swipeDirection={swipeDirection} duration={Infinity}>
      {/* Toasts render here and Radix portals them INTO the Viewport below. */}
      {ordered.map((item) => (
        <RenderedToast
          key={`${item.id}-${item.renderKey}`}
          item={item}
          isNewest={toasts[toasts.length - 1]?.id === item.id}
        />
      ))}

      <ToastViewport
        className={cn(
          // Positioning: fixed to the bottom of the content area, centered.
          "fixed left-1/2 -translate-x-1/2 z-[1000]",
          "flex flex-col items-center gap-2",
          // Width cap: desktop up to 600px; mobile reflows to a bar.
          "w-max max-w-[min(600px,calc(100vw-32px))]",
          "max-sm:left-4 max-sm:right-4 max-sm:translate-x-0 max-sm:w-auto max-sm:max-w-none",
          // Below sm, stretch items so both compact and full fill the bar.
          "max-sm:items-stretch",
          "pointer-events-none [&>*]:pointer-events-auto",
          "focus-visible:outline-none",
          "list-none m-0 p-0"
        )}
        style={{
          bottom: bottomOffset,
          paddingLeft: insetLeft || undefined,
          paddingRight: insetRight || undefined,
        }}
      />
    </ToastProvider>
  );
}

/* ─── A Toast item rendered inside the viewport ─── */

function RenderedToast({
  item,
  isNewest,
}: {
  item: ToastItem;
  isNewest: boolean;
}) {
  const duration = resolveDuration(item);
  // Radix Toast.Root duration prop expects a finite number; Infinity → omit
  // (the Provider default already is Infinity, so no auto-close).
  const radixDuration = Number.isFinite(duration) ? duration : undefined;

  return (
    <Toast
      intent={item.intent}
      subject={item.subject}
      message={item.message}
      layout={item.layout ?? "compact"}
      state={item.state}
      count={item.count}
      live={isNewest}
      wrap={item.wrap}
      action={item.action}
      actionVariant={item.actionVariant}
      onAction={() => runActionWithBusy(item)}
      duration={radixDuration}
      onOpenChange={(open) => {
        if (!open) dismissItem(item.id);
      }}
    />
  );
}

/* ─── Action wrapper — flips to `busy` while a returned Promise resolves ─── */

function runActionWithBusy(item: ToastItem) {
  if (!item.onAction) return;
  let result: void | Promise<void>;
  try {
    result = item.onAction();
  } catch (err) {
    // Sync throw — leave the toast alone, user can decide
    throw err;
  }
  if (result && typeof (result as Promise<void>).then === "function") {
    updateItem(item.id, { state: "busy" });
    (result as Promise<void>).then(
      () => { updateItem(item.id, { state: "default" }); },
      () => { updateItem(item.id, { state: "default" }); }
    );
  }
}
