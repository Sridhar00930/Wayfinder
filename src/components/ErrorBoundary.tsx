import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Last line of defense: if anything crashes, show a calm page with emergency
 * numbers and a way to reset saved data, instead of a blank screen.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Wayfinder hit an error", error, info.componentStack);
  }

  resetData = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("wayfinder."))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch {
      // Storage may be blocked; reloading still helps.
    }
    window.location.reload();
  };

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <main id="main" className="crash">
        <h1>Something went wrong on this page.</h1>
        <p>It’s not your fault. Try reloading. If that doesn’t work, reset Wayfinder on this device.</p>
        <p>
          <strong>Resetting deletes</strong> your Access Passport, today’s plan, and journey progress from
          this browser.
        </p>
        <div className="crash-actions">
          <button type="button" className="button button-primary" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button type="button" className="button button-secondary" onClick={this.resetData}>
            Reset Wayfinder on this device
          </button>
        </div>
        <p className="crash-emergency">
          Emergency: call <a href="tel:911">911</a>. Crisis: call or text <a href="tel:988">988</a>.
        </p>
      </main>
    );
  }
}
