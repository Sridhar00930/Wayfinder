import { useEffect, useMemo, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { SpeakButton } from "../components/SpeakButton";
import { terms, type Term } from "../data/glossary";
import { END, scenarioById, scenarios, type RehearsalChoice, type Scenario } from "../data/rehearsal";
import { useSpeech } from "../lib/speech";
import { readJson, writeJson } from "../lib/storage";
import { focusLater } from "../lib/focus";
import { shortMeaning } from "../data/shortMeanings";

export const PRACTICE_KEY = "wayfinder.practice.v1";
export const WORDS_KEY = "wayfinder.words.v1";

type Mode = "rehearsal" | "words";

export function Practice({ initialMode = "rehearsal" }: { initialMode?: Mode }) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const { stop } = useSpeech();

  return (
    <>
      <PageHeader
        eyebrow="Practice"
        title="Practice phone calls before you make them."
        lede="Practice here first. Nothing here counts. There is no timer, and you can stop any time."
      />

      <div className="mode-switch" role="group" aria-label="Choose a practice">
        <button
          type="button"
          className="mode-button"
          aria-pressed={mode === "rehearsal"}
          onClick={() => {
            stop();
            setMode("rehearsal");
          }}
        >
          <Icon name="phone" size={18} />
          Rehearsal Room
        </button>
        <button
          type="button"
          className="mode-button"
          aria-pressed={mode === "words"}
          onClick={() => {
            stop();
            setMode("words");
          }}
        >
          <Icon name="book" size={18} />
          Word Spells
        </button>
      </div>

      {mode === "rehearsal" ? <RehearsalRoom /> : <WordSpells />}
    </>
  );
}

/* ---------------------------------------------------------------- */

interface PracticeRecord {
  done: Record<string, number>;
}

function RehearsalRoom() {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const scenario = scenarioId ? scenarioById(scenarioId) : undefined;
  const [record, setRecord] = useState<PracticeRecord>(() => {
    const value = readJson<PracticeRecord>(PRACTICE_KEY, { done: {} });
    return { done: value.done && typeof value.done === "object" ? value.done : {} };
  });

  const finish = (id: string, keys: number) => {
    setRecord((current) => {
      const best = Math.max(current.done[id] ?? 0, keys);
      const next = { done: { ...current.done, [id]: best } };
      writeJson(PRACTICE_KEY, next);
      return next;
    });
  };

  if (scenario) {
    return (
      <Call
        key={scenario.id}
        scenario={scenario}
        onExit={() => {
          const from = scenario.id;
          setScenarioId(null);
          focusLater(`[data-scenario="${from}"]`);
        }}
        onFinish={(keys) => finish(scenario.id, keys)}
      />
    );
  }

  return (
    <section aria-labelledby="rehearsal-title">
      <h2 id="rehearsal-title" className="section-title">
        Rehearsal Room
      </h2>
      <p className="section-lede practice-lede">
        Pick a pretend call. At each step, choose what you would say. Some answers earn a{" "}
        <strong>key</strong>. A key is something useful to get on a real call, like a reference number. A
        friend can read the other person’s lines out loud with you.
      </p>
      <ul className="scenario-list">
        {scenarios.map((s) => {
          const best = record.done[s.id];
          return (
            <li key={s.id}>
              <button
                type="button"
                className="scenario-card"
                data-scenario={s.id}
                onClick={() => setScenarioId(s.id)}
              >
                <span className="scenario-who">
                  {s.gatekeeper}, {s.role}
                </span>
                <span className="scenario-title">{s.title}</span>
                <span className="scenario-setup">{s.setup}</span>
                <span className="scenario-meta">
                  {best !== undefined ? (
                    <span className="pill pill-done">You’ve practiced this</span>
                  ) : (
                    <span className="pill">About 2 minutes</span>
                  )}
                  <Icon name="arrow-right" size={18} />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Call({
  scenario,
  onExit,
  onFinish,
}: {
  scenario: Scenario;
  onExit: () => void;
  onFinish: (keys: number) => void;
}) {
  const [nodeId, setNodeId] = useState(scenario.start);
  const [keys, setKeys] = useState<string[]>([]);
  const [picked, setPicked] = useState<RehearsalChoice | null>(null);
  const [transcript, setTranscript] = useState<{ who: string; text: string }[]>([]);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLHeadingElement>(null);
  const reported = useRef(false);
  const { stop } = useSpeech();

  const node = scenario.nodes.find((n) => n.id === nodeId);
  const ended = nodeId === END;

  useEffect(() => {
    if (ended) {
      if (!reported.current) {
        reported.current = true;
        onFinish(keys.length);
      }
      endRef.current?.focus();
    } else {
      lineRef.current?.focus();
    }
    // Only react to moving between steps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId]);

  useEffect(() => {
    if (picked) feedbackRef.current?.focus();
  }, [picked]);

  const choose = (choice: RehearsalChoice) => {
    stop();
    setPicked(choice);
    setTranscript((t) => [...t, { who: scenario.gatekeeper, text: node?.line ?? "" }, { who: "You", text: choice.text }]);
    if (choice.key && !keys.includes(choice.key)) setKeys((k) => [...k, choice.key as string]);
  };

  const proceed = () => {
    if (!picked) return;
    const next = picked.next;
    setPicked(null);
    setNodeId(next);
  };

  const restart = () => {
    stop();
    reported.current = false;
    setKeys([]);
    setPicked(null);
    setTranscript([]);
    setNodeId(scenario.start);
  };

  const keyTrack = (
    <ul className="key-track" aria-label={`Keys found: ${keys.length} of ${scenario.keys.length}`}>
      {scenario.keys.map((k) => (
        <li key={k.id} className={keys.includes(k.id) ? "key-found" : undefined}>
          <Icon name={keys.includes(k.id) ? "key" : "key-empty"} size={20} />
          <span className="sr-only">
            {k.label}: {keys.includes(k.id) ? "found" : "not found yet"}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className="call" aria-labelledby="call-title">
      <button
        type="button"
        className="back-button"
        onClick={() => {
          stop();
          onExit();
        }}
      >
        <Icon name="arrow-right" size={18} className="flip" />
        All practice calls
      </button>
      <div className="call-head">
        <div>
          <h2 id="call-title" className="section-title">
            {scenario.title}
          </h2>
          <p className="section-lede">{scenario.setup}</p>
        </div>
        {keyTrack}
      </div>

      {!ended && node ? (
        <div className="call-stage">
          <div className="call-line">
            <span className="call-avatar" aria-hidden="true">
              {scenario.gatekeeper.charAt(0)}
            </span>
            <div>
              <p className="call-who">
                {scenario.gatekeeper} ({scenario.role}) says:
              </p>
              <p className="call-text" ref={lineRef} tabIndex={-1}>
                <span className="sr-only">{scenario.gatekeeper} says: </span>“{node.line}”
              </p>
              <SpeakButton id={`line-${node.id}`} text={node.line} label={`Hear ${scenario.gatekeeper}`} />
            </div>
          </div>

          {picked ? (
            <div
              className={`call-feedback ${picked.good ? "is-good" : "is-hint"}`}
              ref={feedbackRef}
              tabIndex={-1}
              role="group"
              aria-labelledby="call-feedback-title"
              aria-describedby="call-feedback-text"
            >
              <p className="call-feedback-title" id="call-feedback-title">
                <Icon name={picked.good ? "check" : "spark"} size={20} />
                {picked.good ? "Good answer" : "A tip for next time"}
                {picked.key ? (
                  <span className="pill pill-done">
                    Key found: {scenario.keys.find((k) => k.id === picked.key)?.label}
                  </span>
                ) : null}
              </p>
              <p id="call-feedback-text">{picked.feedback}</p>
              <button type="button" className="button button-primary" onClick={proceed}>
                {picked.next === END ? "Finish the call" : "Continue"}
                <Icon name="arrow-right" size={18} />
              </button>
            </div>
          ) : (
            <fieldset className="call-choices">
              <legend>What do you say?</legend>
              <ul>
                {node.choices.map((choice) => (
                  <li key={choice.text}>
                    <button type="button" className="choice-button" onClick={() => choose(choice)}>
                      {choice.text}
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>
          )}
        </div>
      ) : (
        <div className="call-end">
          <h3 ref={endRef} tabIndex={-1} className="call-end-title">
            Call finished.
          </h3>
          <p className="section-lede">
            {keys.length === scenario.keys.length
              ? "You asked for everything useful on this call."
              : keys.length > 0
                ? "Here is what you got on this call, and one or two ideas for next time."
                : "Practicing is what counts. Here are one or two ideas for next time."}
          </p>
          <ul className="key-results">
            {[
              ...scenario.keys.filter((k) => keys.includes(k.id)),
              ...scenario.keys.filter((k) => !keys.includes(k.id)).slice(0, 2),
            ].map((k) => {
              const found = keys.includes(k.id);
              return (
                <li key={k.id} className={found ? "key-found" : "key-missed"}>
                  <Icon name={found ? "key" : "key-empty"} size={22} />
                  <div>
                    <strong>
                      {found ? "You got: " : "Next time, try asking for: "}
                      {k.label}
                    </strong>
                    <span>{k.why}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          <details className="details-panel">
            <summary>Read the whole conversation</summary>
            <ol className="transcript">
              {transcript.map((t, i) => (
                <li key={i}>
                  <strong>{t.who}:</strong> {t.text}
                </li>
              ))}
            </ol>
          </details>
          <p className="journey-footnote">
            <Icon name="shield" size={16} />
            {scenario.debrief}
          </p>
          <div className="hero-actions">
            <button type="button" className="button button-primary" onClick={restart}>
              Try this call again
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                stop();
                onExit();
              }}
            >
              Choose another call
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------------------------------------------------------------- */

function shuffle<T>(items: T[]): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface Round {
  term: Term;
  answer: string;
  options: string[];
}

const ROUNDS = 5;

function makeRounds(): Round[] {
  return shuffle(terms)
    .slice(0, ROUNDS)
    .map((term) => {
      const sameCategory = terms.filter((t) => t.term !== term.term && t.category === term.category);
      const pool = sameCategory.length >= 2 ? sameCategory : terms.filter((t) => t.term !== term.term);
      const distractors = shuffle(pool)
        .slice(0, 2)
        .map((t) => shortMeaning(t.term, t.plain));
      return { term, answer: shortMeaning(term.term, term.plain), options: shuffle([shortMeaning(term.term, term.plain), ...distractors]) };
    });
}

function WordSpells() {
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [learned, setLearned] = useState<string[]>(() => {
    const value = readJson<string[]>(WORDS_KEY, []);
    return Array.isArray(value) ? value.filter((v) => typeof v === "string") : [];
  });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const known = useMemo(() => new Set(terms.map((t) => t.term)), []);
  const learnedCount = learned.filter((t) => known.has(t)).length;

  useEffect(() => {
    if (rounds) headingRef.current?.focus();
  }, [rounds, index]);

  useEffect(() => {
    if (answer) feedbackRef.current?.focus();
  }, [answer]);

  const start = () => {
    setRounds(makeRounds());
    setIndex(0);
    setAnswer(null);
    setScore(0);
  };

  if (!rounds) {
    return (
      <section aria-labelledby="words-title" className="words-intro">
        <h2 id="words-title" className="section-title">
          Word Spells
        </h2>
        <p className="section-lede practice-lede">
          Health care words can be hard. Learn what they mean, one at a time. Each round has five words. Pick
          the meaning that fits.
        </p>
        <p className="words-progress">
          <Icon name="spark" size={18} />
          Words you know so far: {learnedCount}
        </p>
        <button type="button" className="button button-primary" id="spell-start" onClick={start}>
          Start a round
        </button>
      </section>
    );
  }

  if (index >= rounds.length) {
    return (
      <section className="call-end" aria-labelledby="words-done">
        <h2 id="words-done" ref={headingRef} tabIndex={-1} className="call-end-title">
          Round finished.
        </h2>
        <p className="section-lede">
          {score === rounds.length
            ? "You knew every word in this round."
            : "You can look up any of these words in Plain language, with questions to ask about them."}
        </p>
        <p className="words-progress">
          <Icon name="spark" size={18} />
          Words you know so far: {learnedCount}
        </p>
        <div className="hero-actions">
          <button type="button" className="button button-primary" onClick={start}>
            Another round
          </button>
          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setRounds(null);
              focusLater("#spell-start");
            }}
          >
            Done for now
          </button>
        </div>
      </section>
    );
  }

  const round = rounds[index];
  const correct = answer === round.answer;

  const pick = (option: string) => {
    if (answer) return;
    setAnswer(option);
    if (option === round.answer) {
      setScore((s) => s + 1);
      setLearned((list) => {
        if (list.includes(round.term.term)) return list;
        const next = [...list, round.term.term];
        writeJson(WORDS_KEY, next);
        return next;
      });
    }
  };

  return (
    <section className="spell" aria-labelledby="spell-term">
      <p className="spell-count">
        Word {index + 1} of {rounds.length}
      </p>
      <h2 id="spell-term" ref={headingRef} tabIndex={-1} className="spell-term">
        What does “{round.term.term}” mean?
      </h2>
      <ul className="spell-options">
        {round.options.map((option) => {
          const state = !answer ? "" : option === round.answer ? "is-right" : option === answer ? "is-wrong" : "is-dim";
          return (
            <li key={option}>
              <button
                type="button"
                className={`choice-button ${state}`}
                aria-disabled={answer ? true : undefined}
                onClick={() => pick(option)}
              >
                {answer && option === round.answer ? <span className="choice-tag">
                    <span aria-hidden="true">✓ </span>Right answer<span className="sr-only">: </span>
                  </span> : null}
                {answer && option === answer && option !== round.answer ? (
                  <span className="choice-tag">
                    <span aria-hidden="true">✗ </span>Your answer<span className="sr-only">: </span>
                  </span>
                ) : null}
                {option}
              </button>
            </li>
          );
        })}
      </ul>
      {answer ? (
        <div
          className={`call-feedback ${correct ? "is-good" : "is-hint"}`}
          ref={feedbackRef}
          tabIndex={-1}
          role="group"
          aria-labelledby="spell-feedback-title"
        >
          <p className="call-feedback-title" id="spell-feedback-title">
            <Icon name={correct ? "check" : "spark"} size={20} />
            {correct ? "Correct!" : "Not this time. Here is what it means:"}
          </p>
          <p>{round.term.plain}</p>
          <p>
            <strong>Why it matters:</strong> {round.term.matters}
          </p>
          <button type="button" className="button button-primary" onClick={() => {
            setAnswer(null);
            setIndex((i) => i + 1);
          }}>
            {index + 1 === rounds.length ? "See results" : "Next word"}
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      ) : null}
    </section>
  );
}
