import { Icon, type IconName } from "../components/Icon";
import { journeys } from "../data/journeys";
import { terms } from "../data/glossary";
import { providers } from "../data/providers";
import { scripts } from "../data/scripts";
import { useProgress } from "../lib/progress";
import type { View } from "../lib/navigation";

const quickLinks: {
  view: View;
  icon: IconName;
  title: string;
  text: string;
}[] = [
  {
    view: "glossary",
    icon: "book",
    title: "Look up a word",
    text: "Plain-language meanings for 54 insurance, medical, and medicine words.",
  },
  {
    view: "navigator",
    icon: "compass",
    title: "Plan the next step",
    text: "Guided journeys for denials, discharge, new diagnoses, and more.",
  },
  {
    view: "care",
    icon: "map-pin",
    title: "Find accessible care",
    text: "Filter by lifts, ASL, sensory needs, sliding fees, and home visits.",
  },
  {
    view: "scripts",
    icon: "phone",
    title: "Make the call",
    text: "Fill-in scripts for interpreters, appeals, and accessible visits.",
  },
];

const playLinks: {
  view: View;
  mode?: "rehearsal" | "words";
  icon: IconName;
  title: string;
  text: string;
}[] = [
  {
    view: "today",
    icon: "sun",
    title: "Plan today",
    text: "Plan your day around how much energy you have. Optional small goals, too.",
  },
  {
    view: "practice",
    icon: "key",
    title: "Practice a phone call",
    text: "Try a pretend call first. Learn what to ask for on every call.",
  },
  {
    view: "practice",
    mode: "words",
    icon: "book",
    title: "Word Spells quiz",
    text: "Five quick questions to learn hard health care words.",
  },
  {
    view: "relay",
    icon: "chat",
    title: "Care Relay",
    text: "Tap a phrase at the doctor’s office. Your phone shows it in big letters.",
  },
];

const commitments: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "speaker",
    title: "Read it, don’t strain",
    text: "Every explanation and script can be read aloud, and the whole app scales up to 150% without breaking.",
  },
  {
    icon: "keyboard",
    title: "Keyboard and screen reader first",
    text: "A skip link, real landmarks, visible focus, live result counts, and controls that never rely on color alone.",
  },
  {
    icon: "lock",
    title: "No account. No tracking.",
    text: "Settings and journey progress stay in your browser. There is nothing to sign up for and nothing to sell.",
  },
];

export function Home({
  onNavigate,
  onResume,
  onBareMinimum,
}: {
  onNavigate: (view: View, mode?: "rehearsal" | "words") => void;
  onResume: (journeyId: string) => void;
  onBareMinimum: () => void;
}) {
  const [progress] = useProgress();

  const activeJourneys = journeys
    .map((journey) => ({
      journey,
      done: progress[journey.id]?.length ?? 0,
    }))
    .filter(({ journey, done }) => done > 0 && done < journey.steps.length);

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">For disabled people, by design</p>
          <h1 id="hero-title" tabIndex={-1}>
            Get help with health care,{" "}
            <span className="accent">one step at a time.</span>
          </h1>
          <p className="lede">
            Wayfinder explains insurance letters and hospital papers in plain
            words. It tells you what to do next, and it can read out loud. You
            don’t need an account.
          </p>
          <p className="here-be">
            Old maps drew dragons where the roads were unknown. Health care has
            its own: denials, deadlines, and fine print. Wayfinder is your map.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => onNavigate("navigator")}
            >
              Start a care journey
              <Icon name="arrow-right" size={18} />
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => onNavigate("glossary")}
            >
              Look up a word
            </button>
          </div>
          <p className="hero-note">
            <Icon name="lock" size={15} />
            Free · Works with screen readers · Your data stays on your device
          </p>
        </div>

        <div className="hero-art">
          <figure className="decoded-card" aria-labelledby="decoded-caption">
            <figcaption id="decoded-caption" className="decoded-label">
              <span className="status-dot" aria-hidden="true" />
              Example: a denial letter, decoded
            </figcaption>
            <blockquote className="letter-quote">
              “We are unable to authorize the requested equipment because it
              does not meet our criteria for medical necessity.”
            </blockquote>
            <p className="decode-arrow">
              <Icon name="arrow-right" size={18} />
              <span>In plain language</span>
            </p>
            <p className="decode-plain">
              <strong>What this actually means:</strong> your insurer is saying
              your wheelchair does not meet their definition of “medically
              necessary.” That is a denial — and you can appeal it.
            </p>
            <ul className="decode-next">
              <li>
                <Icon name="check" size={17} />
                Ask for the exact criteria
              </li>
              <li>
                <Icon name="check" size={17} />
                Get a letter from your provider
              </li>
              <li>
                <Icon name="check" size={17} />
                File before the deadline
              </li>
            </ul>
          </figure>
        </div>
      </section>

      <section className="section" aria-labelledby="quick-title">
        <div className="section-head">
          <h2 id="quick-title" className="section-title">
            Start where you are
          </h2>
          <p className="section-lede">
            Pick the one that matches what you need help with today.
          </p>
        </div>
        <div className="quick-grid">
          {quickLinks.map((link) => (
            <button
              key={link.view}
              type="button"
              className="quick-card"
              onClick={() => onNavigate(link.view)}
            >
              <span className="quick-icon">
                <Icon name={link.icon} size={24} />
              </span>
              <span className="quick-body">
                <span className="quick-title">{link.title}</span>
                <span className="quick-text">{link.text}</span>
              </span>
              <span className="quick-arrow" aria-hidden="true">
                <Icon name="arrow-right" size={20} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="play-title">
        <div className="section-head">
          <h2 id="play-title" className="section-title">
            <Icon name="flag" size={24} />
            Practice and plan
          </h2>
          <p className="section-lede">
            Small ways to get ready. No timers, no streaks, and no scores.
          </p>
        </div>
        <div className="quick-grid play-grid">
          {playLinks.map((link) => (
            <button key={link.title} type="button" className="quick-card" onClick={() => onNavigate(link.view, link.mode)}>
              <span className="quick-icon">
                <Icon name={link.icon} size={24} />
              </span>
              <span className="quick-body">
                <span className="quick-title">{link.title}</span>
                <span className="quick-text">{link.text}</span>
              </span>
              <span className="quick-arrow" aria-hidden="true">
                <Icon name="arrow-right" size={20} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="feature-band" aria-labelledby="passport-band-title">
        <div className="feature-copy">
          <p className="eyebrow">New · Access Passport</p>
          <h2 id="passport-band-title" className="section-title">
            Stop explaining yourself fourteen times a year.
          </h2>
          <p className="section-lede">
            Pick what helps you, like a transfer lift, a quiet room, or written instructions. Wayfinder
            turns it into a QR code the front desk can scan. They see clear instructions, and your
            details stay inside the code instead of on our server.
          </p>
          <div className="hero-actions">
            <button type="button" className="button button-primary" onClick={() => onNavigate("passport")}>
              <Icon name="qr" size={18} />
              Make my Access Passport
            </button>
          </div>
        </div>
        <div className="feature-side">
          <Icon name="moon" size={26} />
          <p>
            <strong>Too much today?</strong> Bare Minimum shrinks Wayfinder to four giant buttons:
            explain my needs, call my person, get me home, and I need a minute.
          </p>
          <button type="button" className="button button-secondary" onClick={onBareMinimum}>
            Switch to Bare Minimum
          </button>
        </div>
      </section>

      {activeJourneys.length > 0 ? (
        <section className="section" aria-labelledby="resume-title">
          <div className="section-head">
            <h2 id="resume-title" className="section-title">
              Pick up where you left off
            </h2>
          </div>
          <ul className="resume-list">
            {activeJourneys.map(({ journey, done }) => (
              <li key={journey.id}>
                <button
                  type="button"
                  className="resume-card"
                  onClick={() => onResume(journey.id)}
                >
                  <span className="resume-icon">
                    <Icon name={journey.icon} size={22} />
                  </span>
                  <span className="resume-copy">
                    <span className="resume-title">{journey.title}</span>
                    <span className="resume-meta">
                      {done} of {journey.steps.length} steps done
                    </span>
                  </span>
                  <span className="mini-track" aria-hidden="true">
                    <span
                      className="mini-fill"
                      style={{
                        width: `${(done / journey.steps.length) * 100}%`,
                      }}
                    />
                  </span>
                  <Icon name="arrow-right" size={20} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section" aria-labelledby="built-title">
        <div className="section-head">
          <h2 id="built-title" className="section-title">
            Built for the parts that are hardest
          </h2>
          <p className="section-lede">
            Not a chatbot bolted onto a hospital website. A navigation tool
            designed around fatigue, pain, brain fog, and bureaucracy.
          </p>
        </div>
        <div className="commitments">
          {commitments.map((item) => (
            <article key={item.title} className="commitment">
              <span className="commit-icon">
                <Icon name={item.icon} size={22} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="library-strip" aria-labelledby="library-title">
        <div>
          <h2 id="library-title" className="section-title">
            A small library for a big system
          </h2>
          <p className="section-lede">
            Everything here works without an account, and everything is written
            to be read once and understood.
          </p>
        </div>
        <dl className="library-stats">
          <div>
            <dt>Plain-language terms</dt>
            <dd>{terms.length}</dd>
          </div>
          <div>
            <dt>Guided journeys</dt>
            <dd>{journeys.length}</dd>
          </div>
          <div>
            <dt>Call scripts</dt>
            <dd>{scripts.length}</dd>
          </div>
          <div>
            <dt>Sample clinics</dt>
            <dd>{providers.length}</dd>
          </div>
        </dl>
      </section>

      <aside className="crisis-strip" aria-label="Emergency information">
        <span className="crisis-label">
          <Icon name="heart" size={18} />
          If you need help right now
        </span>
        <p>
          Call <a href="tel:911">911</a> for a medical emergency. Call or text{" "}
          <a href="tel:988">988</a> for mental health crisis support. Wayfinder
          is information, not emergency care.
        </p>
      </aside>
    </>
  );
}
