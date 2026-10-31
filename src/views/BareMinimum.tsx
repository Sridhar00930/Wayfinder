import { useEffect, useRef, useState } from "react";
import { ClinicianView } from "../components/ClinicianView";
import { Icon, type IconName } from "../components/Icon";
import { SpeakButton } from "../components/SpeakButton";
import { formatDialed, hasContent, telHref, toShared } from "../data/passport";
import { useSpeech } from "../lib/speech";
import { focusLater } from "../lib/focus";
import { usePassport } from "../lib/usePassport";

type Screen = "menu" | "explain" | "call" | "ride" | "minute";

const MINUTE_TEXT = "I need a minute. Please wait with me. I will tell you when I’m ready.";
const FALLBACK_TEXT =
  "I’m having a hard time right now. Please speak slowly and use simple words. I may need a quiet place and a little more time.";

/**
 * When everything is too much, the app gets smaller: four giant actions,
 * no menus, no typing, and emergency numbers always on screen.
 */
export function BareMinimum({ onExit, onSetup }: { onExit: () => void; onSetup: () => void }) {
  const [data] = usePassport();
  const [screen, setScreen] = useState<Screen>("menu");
  const { stop } = useSpeech();
  const rootRef = useRef<HTMLDivElement>(null);

  const shared = toShared(data);
  const contactHref = telHref(data.contactPhone);
  const rideHref = telHref(data.ridePhone);

  const cameFrom = useRef<Screen | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (screen === "menu" && cameFrom.current) {
      // Back on the menu: return focus to the action the person just left.
      focusLater(`[data-action="${cameFrom.current}"]`);
      return;
    }
    rootRef.current?.querySelector<HTMLElement>("h1")?.focus();
  }, [screen]);

  const open = (next: Screen) => {
    stop();
    cameFrom.current = next === "menu" ? screen : null;
    setScreen(next);
  };

  const actions: { id: Screen; icon: IconName; title: string; hint: string }[] = [
    { id: "explain", icon: "id-card", title: "Explain my needs", hint: "Show or read them to staff" },
    {
      id: "call",
      icon: "phone",
      title: data.contactName ? `Call ${data.contactName}` : "Call my person",
      hint: contactHref ? "One tap to call" : "Not set up yet",
    },
    { id: "ride", icon: "home", title: "Get me home", hint: rideHref || data.homeAddress ? "Ride and address" : "Not set up yet" },
    { id: "minute", icon: "pause", title: "I need a minute", hint: "Ask people to wait" },
  ];

  const back = (
    <button type="button" className="bm-back" onClick={() => open("menu")}>
      <Icon name="arrow-right" size={20} className="flip" />
      Back
    </button>
  );

  const notSetUp = (what: string) => (
    <div className="bm-panel">
      <p className="bm-big">{what}</p>
      <p>When you have more energy, you can add it in your Access Passport. You don’t have to do it now.</p>
      <button type="button" className="button button-secondary" onClick={onSetup}>
        Open Access Passport
      </button>
    </div>
  );

  const renderScreen = () => {
    switch (screen) {
      case "explain":
        return (
          <>
            {back}
            {hasContent(shared) ? (
              <div className="bm-explain">
                <ClinicianView passport={shared} speakId="bm-explain" />
              </div>
            ) : (
              <div className="bm-panel">
                <h1 tabIndex={-1} className="bm-show">
                  {FALLBACK_TEXT}
                </h1>
                <SpeakButton id="bm-fallback" text={FALLBACK_TEXT} label="Say this out loud" />
              </div>
            )}
          </>
        );
      case "call":
        return (
          <>
            {back}
            <h1 tabIndex={-1} className="bm-title">
              {data.contactName ? `Call ${data.contactName}` : "Call my person"}
            </h1>
            {contactHref ? (
              <a className="bm-call" href={contactHref}>
                <Icon name="phone" size={34} />
                <span>
                  Call now
                  <span className="bm-call-number">{formatDialed(contactHref)}</span>
                </span>
              </a>
            ) : (
              notSetUp("You have not added a person to call yet.")
            )}
          </>
        );
      case "ride":
        return (
          <>
            {back}
            <h1 tabIndex={-1} className="bm-title">
              Get me home
            </h1>
            {rideHref || data.homeAddress ? (
              <>
                {rideHref ? (
                  <a className="bm-call" href={rideHref}>
                    <Icon name="phone" size={34} />
                    <span>
                      Call {data.rideName || "my ride"}
                      <span className="bm-call-number">{formatDialed(rideHref)}</span>
                    </span>
                  </a>
                ) : null}
                {data.homeAddress ? (
                  <div className="bm-panel">
                    <p className="bm-label">Show this to your driver</p>
                    <p className="bm-show">{data.homeAddress}</p>
                    <SpeakButton
                      id="bm-address"
                      text={`Please take me to ${data.homeAddress}.`}
                      label="Say my address"
                    />
                  </div>
                ) : null}
              </>
            ) : (
              notSetUp("You have not added a ride home yet.")
            )}
          </>
        );
      case "minute":
        return (
          <>
            {back}
            <div className="bm-panel bm-minute">
              <h1 tabIndex={-1} className="bm-show">
                I need a minute.
                <span>Please wait with me. I’ll tell you when I’m ready.</span>
              </h1>
              <SpeakButton id="bm-minute" text={MINUTE_TEXT} label="Say this out loud" />
              <div className="breathe" aria-hidden="true">
                <span className="breathe-circle" />
              </div>
              <p className="bm-breathe-text">
                If it helps: breathe in while the circle grows. Breathe out while it shrinks. There’s no rush.
              </p>
            </div>
          </>
        );
      default:
        return (
          <>
            <h1 tabIndex={-1} className="bm-title">
              Just the essentials.
            </h1>
            <p className="bm-sub">Pick one. Nothing else needs doing right now.</p>
            <ul className="bm-grid">
              {actions.map((action) => (
                <li key={action.id}>
                  {action.id === "call" && contactHref ? (
                    // With a saved number, one tap calls. No extra screen.
                    <a className="bm-action" href={contactHref} data-action={action.id}>
                      <span className="bm-action-icon">
                        <Icon name={action.icon} size={38} />
                      </span>
                      <span className="bm-action-title">{action.title}</span>
                      <span className="bm-action-hint">Calls {formatDialed(contactHref)}</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="bm-action"
                      data-action={action.id}
                      onClick={() => open(action.id)}
                    >
                      <span className="bm-action-icon">
                        <Icon name={action.icon} size={38} />
                      </span>
                      <span className="bm-action-title">{action.title}</span>
                      <span className="bm-action-hint">{action.hint}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </>
        );
    }
  };

  return (
    <div className="bare-minimum" ref={rootRef}>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="bm-header">
        <span className="bm-mode">
          <Icon name="moon" size={18} />
          Bare Minimum
        </span>
        <button
          type="button"
          className="bm-exit"
          onClick={() => {
            stop();
            onExit();
          }}
        >
          Back to full Wayfinder
        </button>
      </header>

      <main id="main" className="bm-main" tabIndex={-1}>
        {renderScreen()}
      </main>

      <aside className="bm-emergency" aria-label="Emergency numbers">
        <a href="tel:911">
          <span className="bm-em-label">Emergency</span> 911
        </a>
        <a href="tel:988">
          <span className="bm-em-label">Crisis line</span> 988
        </a>
      </aside>
    </div>
  );
}
