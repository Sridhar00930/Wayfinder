/**
 * Move keyboard focus after React has re-rendered. Use it whenever the
 * control someone just used disappears, so their place on the page isn't lost.
 */
export function focusLater(target: string | (() => HTMLElement | null | undefined)): void {
  window.setTimeout(() => {
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target();
    if (!el) return;
    if (!el.matches("a, button, input, select, textarea, [tabindex]")) el.setAttribute("tabindex", "-1");
    el.focus();
  }, 0);
}
