import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { painWords, relayGroups } from "../data/relay";
import { useSpeech } from "../lib/speech";
import { markQuestFlag } from "../lib/storage";
import { focusLater } from "../lib/focus";

const MAX_TYPED = 200;

/**
 * A communication board for the exam room. The patient taps; the phone shows
 * the phrase in large type and can say it aloud. Nothing is saved.
 */
export function Relay({
  fullscreen,
  onFullscreen,
}: {
  fullscreen: boolean;
  onFullscreen: (on: boolean) => void;
}) {
  const { supported, speak, stop } = useSpeech();
  const [shown, setShown] = useState("");
  // Each tap gets a new number, so screen readers announce a repeated phrase again.
  const [tap, setTap] = useState(0);
  // Off by default: speaking out loud should always be the person's choice.
  const [voice, setVoice] = useState(false);
  const speakTimer = useRef<number | undefined>(undefined);
  const [typed, setTyped] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const displayRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    markQuestFlag("relay");
  }, []);

  useEffect(() => {
    if (fullscreen) {
      window.scrollTo({ top: 0 });
      rootRef.current?.querySelector<HTMLElement>("h1")?.focus();
    }
  }, [fullscreen]);

  useEffect(
    () => () => {
      window.clearTimeout(speakTimer.current);
      stop();
    },
    [stop],
  );

  const say = (text: string) => {
    const clean = text.trim().slice(0, MAX_TYPED);
    if (!clean) return;
    setShown(clean);
    setTap((n) => n + 1);
    setRecent((list) => [clean, ...list.filter((item) => item !== clean)].slice(0, 5));
    window.clearTimeout(speakTimer.current);
    // A short pause lets a screen reader finish its own announcement first.
    if (voice && supported) speakTimer.current = window.setTimeout(() => speak("relay", clean), 450);
    // Keep the display in view on small screens without stealing focus.
    displayRef.current?.scrollIntoView?.({ block: "nearest" });
  };

  // Arrow keys move between phrase buttons, so keyboard and switch users
  // don't need to Tab through every tile.
  const onBoardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    const current = event.target as HTMLElement;
    if (!current.matches(".relay-tile, .pain-tile, .chip")) return;
    const tiles = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(".relay-tile, .pain-tile, .relay-recent .chip"),
    );
    const index = tiles.indexOf(current);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? tiles.length - 1
          : event.key === "ArrowRight" || event.key === "ArrowDown"
            ? Math.min(tiles.length - 1, index + 1)
            : Math.max(0, index - 1);
    tiles[next]?.focus();
  };

  const board = (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div className="relay-board" onKeyDown={onBoardKeyDown}>
      <div
        className="relay-display"
        ref={displayRef}
        role="status"
        aria-atomic="true"
      >
        {shown ? (
          <p className="relay-shown" key={tap}>
            {shown}
          </p>
        ) : (
          <p className="relay-placeholder">Tap a phrase. It will appear here in big letters.</p>
        )}
      </div>

      <p className="field-help relay-keys">Using a keyboard? Arrow keys move between phrases.</p>
      <div className="relay-controls">
        {supported ? (
          <label className="relay-toggle">
            <input
              type="checkbox"
              checked={voice}
              aria-describedby="relay-voice-help"
              onChange={(e) => setVoice(e.target.checked)}
            />
            <span>Also say phrases out loud</span>
            <span id="relay-voice-help" className="sr-only">
              Your screen reader will also read each phrase.
            </span>
          </label>
        ) : (
          <p className="field-help">This browser can’t speak aloud, so phrases are shown as large text only.</p>
        )}
        {shown ? (
          <button
            type="button"
            className="clear-filters"
            onClick={() => {
              stop();
              setShown("");
              focusLater(".relay-tile");
            }}
          >
            Clear the screen
          </button>
        ) : null}
      </div>

      {relayGroups.map((group) => (
        <section key={group.id} className="relay-group" aria-labelledby={`relay-${group.id}`}>
          <h2 id={`relay-${group.id}`} className="relay-group-title">
            <Icon name={group.icon} size={20} />
            {group.title}
          </h2>
          <ul className="relay-grid">
            {group.phrases.map((phrase) => (
              <li key={phrase.id}>
                <button type="button" className="relay-tile" onClick={() => say(phrase.text)}>
                  {phrase.text}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="relay-group" aria-labelledby="relay-pain">
        <h2 id="relay-pain" className="relay-group-title">
          <Icon name="heart" size={20} />
          My pain, from 0 to 10
        </h2>
        <ul className="pain-scale">
          {painWords.map((word, value) => (
            <li key={value}>
              <button
                type="button"
                className="pain-tile"
                data-level={value}
                aria-label={`Pain ${value} of 10, ${word}`}
                onClick={() =>
                  say(value === 0 ? "I have no pain right now." : `My pain is ${value} out of 10. It’s ${word}.`)
                }
              >
                <span className="pain-number">{value}</span>
                <span className="pain-word" aria-hidden="true">
                  {word}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="relay-group" aria-labelledby="relay-type">
        <h2 id="relay-type" className="relay-group-title">
          <Icon name="keyboard" size={20} />
          Type my own words
        </h2>
        <form
          className="relay-type"
          onSubmit={(event) => {
            event.preventDefault();
            say(typed);
          }}
        >
          <label htmlFor="relay-input" className="sr-only">
            Your message
          </label>
          <input
            id="relay-input"
            type="text"
            autoComplete="off"
            maxLength={MAX_TYPED}
            value={typed}
            placeholder="Type here, then press Show it big"
            onChange={(e) => setTyped(e.target.value)}
          />
          <button type="submit" className="button button-primary" disabled={!typed.trim()}>
            Show it big
          </button>
        </form>
      </section>

      {recent.length > 0 ? (
        <section className="relay-group" aria-labelledby="relay-recent">
          <h2 id="relay-recent" className="relay-group-title">
            Said recently
          </h2>
          <ul className="relay-recent">
            {recent.map((item) => (
              <li key={item}>
                <button type="button" className="chip" onClick={() => say(item)}>
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="journey-footnote">
        <Icon name="lock" size={16} />
        Nothing on this board is saved or sent. Care Relay helps in the moment, but it doesn’t replace
        a qualified interpreter. You can still ask for one at any visit.
      </p>
    </div>
  );

  if (fullscreen) {
    return (
      <div className="relay-full" ref={rootRef}>
        <header className="bm-header">
          <h1 className="bm-mode" tabIndex={-1}>
            <Icon name="chat" size={18} />
            Care Relay
          </h1>
          <button
            type="button"
            className="bm-exit"
            onClick={() => {
              stop();
              onFullscreen(false);
            }}
          >
            Exit full screen
          </button>
        </header>
        <main id="main" className="bm-main relay-main" tabIndex={-1}>
          {board}
        </main>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Care Relay"
        title="Tap it. Show it. Say it."
        lede="A communication board for the exam room. You stay in control: tap a phrase and it appears in large letters, and the phone can say it out loud. Use it when speaking is hard, slow, or just too much today."
      >
        <div className="hero-actions">
          <button type="button" className="button button-primary" onClick={() => onFullscreen(true)}>
            <Icon name="eye" size={18} />
            Show board full screen
          </button>
        </div>
      </PageHeader>
      {board}
    </>
  );
}
