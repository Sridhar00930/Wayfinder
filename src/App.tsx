import { useEffect, useRef, useState } from "react";
import { AccessibilityDialog } from "./components/AccessibilityDialog";
import { ClinicianView } from "./components/ClinicianView";
import { decodePassport, isPassportHash } from "./data/passport";
import { Icon } from "./components/Icon";
import { navItems, type View } from "./lib/navigation";
import { defaultSettings, sanitizeSettings, type Settings } from "./lib/settings";
import { useSpeech } from "./lib/speech";
import { useLocalStorage } from "./lib/useLocalStorage";
import { FindCare } from "./views/FindCare";
import { Glossary } from "./views/Glossary";
import { Home } from "./views/Home";
import { Navigator } from "./views/Navigator";
import { BareMinimum } from "./views/BareMinimum";
import { Passport } from "./views/Passport";
import { Practice } from "./views/Practice";
import { Relay } from "./views/Relay";
import { Today } from "./views/Today";
import { Dragons } from "./components/Dragons";
import { Scripts } from "./views/Scripts";

function useHash() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  const clear = () => {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    setHash("");
  };
  return [hash, clear] as const;
}

export default function App() {
  const [hash, clearHash] = useHash();
  const [view, setView] = useState<View>("home");
  const [bareStored, setBare] = useLocalStorage<boolean>("wayfinder.bare.v1", false);
  const bare = bareStored === true;
  const [relayFull, setRelayFull] = useState(false);
  const [practiceMode, setPracticeMode] = useState<"rehearsal" | "words">("rehearsal");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastPlace = useRef<string | null>(null);
  const [pendingJourney, setPendingJourney] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [storedSettings, setSettings] = useLocalStorage<Settings>(
    "wayfinder.settings.v1",
    defaultSettings,
  );
  const settings = sanitizeSettings(storedSettings);
  const mainRef = useRef<HTMLElement>(null);
  const { stop } = useSpeech();

  useEffect(() => {
    const root = document.documentElement;
    root.style.fontSize = `${settings.scale}%`;
    root.dataset.contrast = String(settings.contrast);
    root.dataset.reading = String(settings.reading);
    root.dataset.reduceMotion = String(settings.reduceMotion);
  }, [settings.scale, settings.contrast, settings.reading, settings.reduceMotion]);

  useEffect(() => {
    const label = navItems.find((item) => item.view === view)?.label ?? "Start";
    document.title = isPassportHash(hash)
      ? "Access needs · Wayfinder"
      : bare
        ? "Bare Minimum · Wayfinder"
        : view === "home"
          ? "Wayfinder: health care navigation that works for you"
          : `${label} · Wayfinder`;
  }, [view, bare, hash]);

  useEffect(() => {
    // On first load, leave focus at the top so the skip link is the first Tab stop.
    // Comparing against the last place we focused also keeps React's dev-mode
    // double effects from moving focus.
    const place = `${view}|${bare}|${relayFull}|${hash}`;
    const previous = lastPlace.current;
    lastPlace.current = place;
    if (previous === null || previous === place) return;
    window.scrollTo({ top: 0 });
    mainRef.current?.querySelector<HTMLElement>("h1")?.focus();
  }, [view, bare, relayFull, hash]);

  const go = (next: View, mode?: "rehearsal" | "words") => {
    stop();
    setRelayFull(false);
    setPendingJourney(null);
    setMenuOpen(false);
    if (next === "practice") setPracticeMode(mode ?? "rehearsal");
    setView(next);
  };

  const resumeJourney = (id: string) => {
    stop();
    setPendingJourney(id);
    setView("navigator");
  };

  const openSettings = () => {
    stop();
    setSettingsOpen(true);
  };

  const renderView = () => {
    switch (view) {
      case "navigator":
        return <Navigator initialJourney={pendingJourney} />;
      case "glossary":
        return <Glossary />;
      case "care":
        return <FindCare />;
      case "scripts":
        return <Scripts />;
      case "passport":
        return <Passport />;
      case "today":
        return <Today onNavigate={go} onResume={resumeJourney} onBareMinimum={enterBare} />;
      case "practice":
        return <Practice key={practiceMode} initialMode={practiceMode} />;
      case "relay":
        return <Relay fullscreen={false} onFullscreen={setRelayFull} />;
      default:
        return <Home onNavigate={go} onResume={resumeJourney} onBareMinimum={enterBare} />;
    }
  };

  const enterBare = () => {
    stop();
    setSettingsOpen(false);
    setBare(true);
  };

  // A scanned Access Passport: show only what the clinician needs.
  if (isPassportHash(hash)) {
    const shared = decodePassport(hash);
    return (
      <div className="app shared-app">
        <header className="shared-header">
          <span className="brand-static">
            <span className="brand-mark" aria-hidden="true">
              <Icon name="spark" size={19} />
            </span>
            <span className="brand-name">Wayfinder</span>
          </span>
          <button type="button" className="button button-secondary shared-exit" onClick={clearHash}>
            Open Wayfinder
          </button>
        </header>
        <main id="main" className="shared-main">
          {shared ? (
            <ClinicianView passport={shared} />
          ) : (
            <div className="empty-state">
              <h1 tabIndex={-1}>This passport link is incomplete.</h1>
              <p>Ask the person to show you their screen, or to share the code again.</p>
            </div>
          )}
        </main>
      </div>
    );
  }

  if (bare) {
    return (
      <BareMinimum
        onExit={() => setBare(false)}
        onSetup={() => {
          setBare(false);
          setPendingJourney(null);
          setView("passport");
        }}
      />
    );
  }

  if (relayFull) {
    return <Relay fullscreen onFullscreen={setRelayFull} />;
  }

  return (
    <div className="app">
      <Dragons />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="header-inner">
          <button
            type="button"
            className="brand"
            onClick={() => go("home")}
            aria-label="Wayfinder — go to start"
          >
            <span className="brand-mark" aria-hidden="true">
              <Icon name="spark" size={19} />
            </span>
            <span className="brand-text">
              <span className="brand-name">Wayfinder</span>
              <span className="brand-tag">Health navigation</span>
            </span>
          </button>


          <button type="button" className="bad-day-trigger" onClick={enterBare}>
            <Icon name="moon" size={18} />
            Having a bad day?
          </button>

          <button
            type="button"
            className="a11y-trigger"
            aria-haspopup="dialog"
            aria-expanded={settingsOpen}
            onClick={openSettings}
          >
            <Icon name="access" size={18} />
            Accessibility
            <span className="sr-only"> settings</span>
          </button>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav-list"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Icon name={menuOpen ? "close" : "settings"} size={18} />
            {menuOpen ? "Close menu" : "Menu"}
          </button>

          <nav className="main-nav" aria-label="Main">
            <ul className="nav-list" id="main-nav-list" data-open={menuOpen}>
              {navItems.map((item) => (
                <li key={item.view}>
                  <button
                    type="button"
                    className="nav-button"
                    aria-current={view === item.view ? "page" : undefined}
                    onClick={() => go(item.view)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main id="main" className="site-main" ref={mainRef} tabIndex={-1}>
        <div className="view" key={view}>
          {renderView()}
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-mark" aria-hidden="true">
                <Icon name="spark" size={20} />
              </span>
              <div>
                <p className="footer-name">Wayfinder</p>
                <p className="footer-tag">
                  Navigation that starts from your life, not the system’s.
                </p>
              </div>
            </div>
            <p className="footer-emergency">
              <strong>Emergency?</strong> Call <a href="tel:911">911</a>.{" "}
              <strong>Mental health crisis?</strong> Call or text{" "}
              <a href="tel:988">988</a>.
            </p>
          </div>

          <div className="footer-cols">
            <p>
              <strong>Not medical, legal, or insurance advice.</strong>{" "}
              Wayfinder explains common U.S. health system terms and steps.
              Coverage and rights vary by plan and state. For advice about your
              situation, contact a patient navigator, your plan, or a
              disability rights organization.
            </p>
            <p>
              Sample clinics, people, and phone numbers are fictional. Wayfinder
              has no account and no server: what you enter stays in this
              browser, and you can delete it any time by clearing site data. The
              only outside request is for fonts from Google Fonts. Not
              affiliated with any clinic, insurer, or government agency.
            </p>
            <p className="footer-built">
              Built at HackGwinnett 2026. Designed to be used at 150% zoom, with
              a keyboard, or with a screen reader.
            </p>
          </div>
        </div>
      </footer>

      <AccessibilityDialog
        open={settingsOpen}
        settings={settings}
        onChange={setSettings}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
