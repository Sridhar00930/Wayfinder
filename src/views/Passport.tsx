import { useEffect, useMemo, useRef, useState } from "react";
import { ClinicianView } from "../components/ClinicianView";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { QrCode } from "../components/QrCode";
import {
  avoids,
  emptyPassport,
  hasAnyData,
  hasContent,
  sanitizePassport,
  LIMITS,
  needGroups,
  needs,
  samplePassport,
  shareUrl,
  toShared,
  type PassportData,
} from "../data/passport";
import { copyToClipboard } from "../lib/clipboard";
import { focusLater } from "../lib/focus";
import { encodeQr } from "../lib/qr";
import { useSpeech } from "../lib/speech";
import { usePassport } from "../lib/usePassport";

export function Passport() {
  const [data, setData] = usePassport();
  const [showScreen, setShowScreen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [status, setStatus] = useState("");
  const { stop } = useSpeech();
  const screenRef = useRef<HTMLDivElement>(null);
  const shareHeadingRef = useRef<HTMLHeadingElement>(null);
  const returnFocus = useRef(false);

  const shared = toShared(data);
  const ready = hasContent(shared);
  const url = ready ? shareUrl(shared) : "";
  const qrVersion = useMemo(() => {
    try {
      return url ? encodeQr(url, "M").version : 0;
    } catch {
      return 41;
    }
  }, [url]);
  const wasReady = useRef(ready);

  // Tell screen-reader users when the code first appears or goes away.
  useEffect(() => {
    if (ready && !wasReady.current) setStatus("Your code is ready.");
    if (!ready && wasReady.current) setStatus((current) => (current === "Your code is ready." ? "" : current));
    wasReady.current = ready;
  }, [ready]);

  // A delete that's armed but not confirmed quietly un-arms after a few seconds.
  useEffect(() => {
    if (!confirmDelete) return;
    const timeout = window.setTimeout(() => setConfirmDelete(false), 10000);
    return () => window.clearTimeout(timeout);
  }, [confirmDelete]);

  useEffect(() => {
    if (showScreen) {
      window.scrollTo({ top: 0 });
      screenRef.current?.querySelector<HTMLElement>("h1")?.focus();
    } else if (returnFocus.current) {
      returnFocus.current = false;
      shareHeadingRef.current?.focus();
    }
  }, [showScreen]);

  const update = <K extends keyof PassportData>(key: K, value: PassportData[K]) => {
    setConfirmDelete(false);
    setData((current) => ({ ...sanitizePassport(current), [key]: value }));
  };

  const toggle = (key: "needs" | "avoids", code: string) => {
    const list = data[key];
    update(key, list.includes(code) ? list.filter((c) => c !== code) : [...list, code]);
  };

  const copyLink = async () => {
    const copied = await copyToClipboard(url);
    setStatus(copied ? "Link copied. Anyone with the link can read it." : "Couldn’t copy automatically.");
  };

  const remove = () => {
    stop();
    setData(emptyPassport);
    setConfirmDelete(false);
    setStatus("Your passport was deleted from this device.");
    focusLater("#pp-share-title");
  };

  const peopleNeeds = shared.needs.length;
  const peopleAvoids = shared.avoids.length;
  const qrLabel = `Access Passport QR code${shared.name ? ` for ${shared.name}` : ""}. Scanning it opens a page with ${peopleNeeds} ${peopleNeeds === 1 ? "thing" : "things"} to do${peopleAvoids ? ` and ${peopleAvoids} to avoid` : ""}.`;

  if (showScreen) {
    return (
      <div className="show-screen" ref={screenRef}>
        <div className="show-screen-bar">
          <p>
            <Icon name="eye" size={18} />
            Showing your passport. Turn the screen toward the person helping you.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              stop();
              returnFocus.current = true;
              setShowScreen(false);
            }}
          >
            Done showing
          </button>
        </div>
        <ClinicianView passport={shared} speakId="passport-show" />
      </div>
    );
  }

  return (
    <>
      <div className="print-hide">
        <PageHeader
          eyebrow="Access Passport"
          title="Explain your needs once. Then hand them a QR."
          lede="Choose what helps you. Staff scan the code with a phone camera. They don’t need an app or an account. Your answers are kept inside the code, not on our computers."
        >
          {!ready ? (
            <div className="hero-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setData(samplePassport);
                  focusLater("#pp-name");
                }}
              >
                Try it with a sample person
              </button>
            </div>
          ) : null}
        </PageHeader>
      </div>

      <div className="passport-layout print-hide">
        <form className="passport-form" onSubmit={(event) => event.preventDefault()} aria-label="Your Access Passport">
          <fieldset className="passport-fieldset">
            <legend>About you</legend>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="pp-name">What should staff call you?</label>
                <input
                  id="pp-name"
                  type="text"
                  autoComplete="nickname"
                  maxLength={LIMITS.name}
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="pp-pronouns">Pronouns (optional)</label>
                <input
                  id="pp-pronouns"
                  type="text"
                  maxLength={LIMITS.pronouns}
                  placeholder="for example, she/her"
                  value={data.pronouns}
                  onChange={(e) => update("pronouns", e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          <p className="passport-intro">
            <Icon name="shield" size={18} />
            Choose what helps you. You don’t have to name a diagnosis.
          </p>

          {needGroups.map((group) => (
            <fieldset key={group.id} className="passport-fieldset">
              <legend>
                <span className="legend-icon">
                  <Icon name={group.icon} size={18} />
                </span>
                {group.title}
              </legend>
              <div className="filter-chips">
                {needs
                  .filter((need) => need.group === group.id)
                  .map((need) => (
                    <label key={need.code} className="filter-chip">
                      <input
                        type="checkbox"
                        checked={data.needs.includes(need.code)}
                        onChange={() => toggle("needs", need.code)}
                      />
                      <span>{need.self}</span>
                    </label>
                  ))}
              </div>
            </fieldset>
          ))}

          <fieldset className="passport-fieldset">
            <legend>
              <span className="legend-icon">
                <Icon name="close" size={18} />
              </span>
              Please don’t…
            </legend>
            <div className="filter-chips">
              {avoids.map((avoid) => (
                <label key={avoid.code} className="filter-chip">
                  <input
                    type="checkbox"
                    checked={data.avoids.includes(avoid.code)}
                    onChange={() => toggle("avoids", avoid.code)}
                  />
                  <span>{avoid.self}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="passport-fieldset">
            <legend>In your own words (optional)</legend>
            <div className="field">
              <label htmlFor="pp-note">Anything else that helps</label>
              <textarea
                id="pp-note"
                rows={3}
                maxLength={LIMITS.note}
                aria-describedby="pp-note-count"
                value={data.note}
                onChange={(e) => update("note", e.target.value)}
              />
              <p id="pp-note-count" className="field-help">
                {data.note.length} of {LIMITS.note} characters. Short notes keep the code easy to scan.
              </p>
            </div>
          </fieldset>

          <fieldset className="passport-fieldset passport-private">
            <legend>
              <span className="legend-icon">
                <Icon name="lock" size={18} />
              </span>
              For bad days (kept on this phone)
            </legend>
            <p className="field-help">
              Bare Minimum mode uses these to call your person or get you home. Your ride and home
              address are never put in the QR code.
            </p>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="pp-contact-name">My person’s name</label>
                <input
                  id="pp-contact-name"
                  type="text"
                  maxLength={LIMITS.contactName}
                  placeholder="for example, Sam (sister)"
                  value={data.contactName}
                  onChange={(e) => update("contactName", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="pp-contact-phone">Their phone number</label>
                <input
                  id="pp-contact-phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={LIMITS.phone}
                  value={data.contactPhone}
                  onChange={(e) => update("contactPhone", e.target.value)}
                />
              </div>
            </div>
            <label className="switch-row passport-switch">
              <span className="switch-copy">
                <strong>Include my person in the QR code</strong>
                <span className="field-help">Off by default. Turn it on only if staff should be able to call them.</span>
              </span>
              <input
                type="checkbox"
                checked={data.shareContact}
                onChange={(e) => update("shareContact", e.target.checked)}
              />
            </label>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="pp-ride-name">How I get home</label>
                <input
                  id="pp-ride-name"
                  type="text"
                  maxLength={LIMITS.contactName}
                  placeholder="for example, paratransit"
                  value={data.rideName}
                  onChange={(e) => update("rideName", e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="pp-ride-phone">Ride phone number</label>
                <input
                  id="pp-ride-phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={LIMITS.phone}
                  value={data.ridePhone}
                  onChange={(e) => update("ridePhone", e.target.value)}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="pp-home">Home address to show a driver</label>
              <input
                id="pp-home"
                type="text"
                autoComplete="street-address"
                maxLength={LIMITS.address}
                value={data.homeAddress}
                onChange={(e) => update("homeAddress", e.target.value)}
              />
            </div>
          </fieldset>
        </form>

        <aside className="passport-share" aria-labelledby="pp-share-title">
          <h2 id="pp-share-title" ref={shareHeadingRef} tabIndex={-1}>
            Your code
          </h2>
          {ready ? (
            <>
              <div className="qr-frame">
                <QrCode value={url} label={qrLabel} describedBy="pp-qr-caption" />
              </div>
              <p className="field-help qr-caption" id="pp-qr-caption">
                Any phone camera can scan it. It opens a page that tells staff what helps you.
              </p>
              {qrVersion > 15 ? (
                <p className="passport-dense">
                  <Icon name="spark" size={16} />
                  Your code is getting crowded, which can make it hard to scan. A shorter note helps.
                </p>
              ) : null}
              <div className="passport-actions">
                <button type="button" className="button button-primary" onClick={() => setShowScreen(true)}>
                  <Icon name="eye" size={18} />
                  Show this screen instead
                </button>
                <button type="button" className="button button-secondary" onClick={() => window.print()}>
                  <Icon name="print" size={18} />
                  Print a wallet card
                </button>
                <button type="button" className="button button-secondary" onClick={() => void copyLink()}>
                  <Icon name="link" size={18} />
                  Copy link
                </button>
              </div>
              <div className="passport-warning">
                <Icon name="lock" size={18} />
                <p>
                  <strong>You choose who sees this.</strong> Anyone who scans, photographs, or gets the
                  link can read it. Only show it to people you trust.
                </p>
              </div>
            </>
          ) : (
            <div className="qr-empty">
              <Icon name="qr" size={40} />
              <p>Add your name or choose something that helps. Your code will show here.</p>
            </div>
          )}

          <p className="copy-status" role="status" aria-live="polite">
            {status}
          </p>

          {hasAnyData(data) ? (
            confirmDelete ? (
              <div className="delete-confirm" role="group" aria-labelledby="pp-delete-q">
                <p id="pp-delete-q">
                  <strong>Delete everything in your passport?</strong> This can’t be undone.
                </p>
                <div className="delete-confirm-actions">
                  <button
                    type="button"
                    className="button button-primary"
                    id="pp-keep"
                    onClick={() => {
                      setConfirmDelete(false);
                      focusLater(".delete-button");
                    }}
                  >
                    Keep my passport
                  </button>
                  <button type="button" className="button button-danger" onClick={remove}>
                    Yes, delete it
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="delete-button"
                onClick={() => {
                  setConfirmDelete(true);
                  focusLater("#pp-keep");
                }}
              >
                <Icon name="trash" size={16} />
                Delete my passport from this device
              </button>
            )
          ) : null}
        </aside>
      </div>

      {ready ? (
        <section className="print-only passport-print" aria-hidden="true">
          <div className="print-qr">
            <QrCode value={url} label="Access passport QR code" size={190} />
            <p>Scan for my access needs</p>
          </div>
          <ClinicianView passport={shared} headingLevel={2} speakId="passport-print" />
        </section>
      ) : null}
    </>
  );
}
