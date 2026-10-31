import { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { hasContent, toShared } from "../data/passport";
import { journeys } from "../data/journeys";
import { terms } from "../data/glossary";
import { activities, MAX_SPOONS, MIN_SPOONS, quests } from "../data/today";
import { readJson, readQuests, todayKey, writeJson, QUEST_KEY, type QuestState } from "../lib/storage";
import { usePassport } from "../lib/usePassport";
import { useProgress } from "../lib/progress";
import type { View } from "../lib/navigation";
import { focusLater } from "../lib/focus";
import { PRACTICE_KEY, WORDS_KEY } from "./Practice";

const TODAY_KEY = "wayfinder.today.v1";

interface CustomTask {
  id: string;
  label: string;
  cost: number;
}

interface DayPlan {
  date: string;
  spoons: number | null;
  tasks: string[];
  custom: CustomTask[];
}

const freshDay = (): DayPlan => ({ date: todayKey(), spoons: null, tasks: [], custom: [] });

function loadDay(): DayPlan {
  const value = readJson<DayPlan>(TODAY_KEY, freshDay());
  if (!value || value.date !== todayKey()) return freshDay();
  return {
    date: value.date,
    spoons:
      typeof value.spoons === "number" && value.spoons >= MIN_SPOONS && value.spoons <= MAX_SPOONS
        ? Math.round(value.spoons)
        : null,
    tasks: Array.isArray(value.tasks) ? value.tasks.filter((t) => activities.some((a) => a.id === t)) : [],
    custom: Array.isArray(value.custom)
      ? value.custom
          .filter((c) => c && typeof c.label === "string" && typeof c.cost === "number")
          .slice(0, 12)
          .map((c, i) => ({ id: String(c.id ?? i), label: c.label.slice(0, 60), cost: Math.min(5, Math.max(1, Math.round(c.cost))) }))
      : [],
  };
}

export function Today({
  onNavigate,
  onResume,
  onBareMinimum,
}: {
  onNavigate: (view: View, mode?: "rehearsal" | "words") => void;
  onResume: (journeyId: string) => void;
  onBareMinimum: () => void;
}) {
  const [day, setDay] = useState<DayPlan>(loadDay);
  const [customLabel, setCustomLabel] = useState("");
  const [customCost, setCustomCost] = useState(1);
  const [customError, setCustomError] = useState("");
  const [undo, setUndo] = useState<{ message: string; previous: DayPlan } | null>(null);
  const [questState, setQuestState] = useState<QuestState>(readQuests);
  const [passport] = usePassport();
  const [progress] = useProgress();

  useEffect(() => {
    writeJson(TODAY_KEY, day);
    if (day.tasks.length + day.custom.length > 0 && !questState.flags.planned) {
      const next = { ...questState, flags: { ...questState.flags, planned: true } };
      setQuestState(next);
      writeJson(QUEST_KEY, next);
    }
  }, [day, questState]);

  const used =
    day.tasks.reduce((sum, id) => sum + (activities.find((a) => a.id === id)?.cost ?? 0), 0) +
    day.custom.reduce((sum, c) => sum + c.cost, 0);
  const budget = day.spoons ?? 0;
  const over = day.spoons !== null && used > budget;

  // Any new change replaces the last undo, so Undo never throws away newer work.
  const toggleTask = (id: string) => {
    setUndo(null);
    setDay((d) => ({ ...d, tasks: d.tasks.includes(id) ? d.tasks.filter((t) => t !== id) : [...d.tasks, id] }));
  };

  const addCustom = () => {
    const label = customLabel.trim().slice(0, 60);
    if (!label) {
      setCustomError("Type something first, like “walk the dog”.");
      focusLater("#custom-label");
      return;
    }
    if (day.custom.length >= 12) {
      setCustomError("That’s the most you can add for one day.");
      return;
    }
    setCustomError("");
    setUndo(null);
    setDay((d) => ({ ...d, custom: [...d.custom, { id: `${Date.now()}`, label, cost: customCost }] }));
    setCustomLabel("");
    setCustomCost(1);
    focusLater("#custom-label");
  };

  const removeCustom = (id: string, label: string) => {
    const index = day.custom.findIndex((c) => c.id === id);
    setUndo({ message: `Removed “${label}”.`, previous: day });
    setDay((d) => ({ ...d, custom: d.custom.filter((x) => x.id !== id) }));
    const nextId = day.custom[index + 1]?.id ?? day.custom[index - 1]?.id;
    focusLater(nextId ? `[data-remove="${nextId}"]` : "#today-undo");
  };

  const clearPlan = () => {
    setUndo({ message: "Cleared today’s plan.", previous: day });
    setDay((d) => ({ ...d, tasks: [], custom: [] }));
    focusLater("#today-undo");
  };

  const undoLast = () => {
    if (!undo) return;
    setDay(undo.previous);
    setUndo(null);
    focusLater("#plan-title");
  };

  // Next unchecked step in the most recently relevant journey.
  const nextStep = useMemo(() => {
    for (const journey of journeys) {
      const done = Array.isArray(progress[journey.id]) ? progress[journey.id] : [];
      if (done.length > 0 && done.length < journey.steps.length) {
        const index = journey.steps.findIndex((_, i) => !done.includes(i));
        if (index >= 0) return { journey, step: journey.steps[index] };
      }
    }
    return null;
  }, [progress]);

  // Quest detection.
  const practice = readJson<{ done: Record<string, number> }>(PRACTICE_KEY, { done: {} });
  const words = readJson<string[]>(WORDS_KEY, []);
  const knownTerms = new Set(terms.map((t) => t.term));
  const auto: Record<string, boolean> = {
    passport: hasContent(toShared(passport)),
    rehearse: Boolean(practice.done && Object.keys(practice.done).length > 0),
    words: Array.isArray(words) && words.filter((w) => knownTerms.has(w)).length >= 5,
    plan: Boolean(questState.flags.planned),
    journey: Object.values(progress).some((list) => Array.isArray(list) && list.length > 0),
    relay: Boolean(questState.flags.relay),
  };
  const isDone = (id: string) => auto[id] ?? Boolean(questState.manual[id]);
  const doneCount = quests.filter((q) => isDone(q.id)).length;

  const toggleManual = (id: string) => {
    const next = { ...questState, manual: { ...questState.manual, [id]: !questState.manual[id] } };
    setQuestState(next);
    writeJson(QUEST_KEY, next);
  };

  const questTarget: Record<string, View> = {
    passport: "passport",
    rehearse: "practice",
    words: "practice",
    journey: "navigator",
    relay: "relay",
  };

  const selectedSwaps = [
    ...day.tasks.map((id) => activities.find((a) => a.id === id)).filter((a) => a && a.swap),
  ].sort((a, b) => (b?.cost ?? 0) - (a?.cost ?? 0));

  return (
    <>
      <PageHeader
        eyebrow="Today"
        title="Plan the day you actually have."
        lede="A gentle daily check-in. There are no streaks to keep and no penalties for skipping a day. Today’s plan stays on this device and starts fresh tomorrow."
      />

      <section className="today-section" aria-labelledby="checkin-title">
        <h2 id="checkin-title" className="section-title">
          <Icon name="sun" size={24} />
          How much energy do you have today?
        </h2>
        <p className="section-lede">
          Think of your energy as <strong>spoons</strong>. Each thing you do uses some spoons. When you run out,
          you need to rest. (This idea is called “spoon theory,” by Christine Miserandino.) Pick the number that
          feels true right now.
        </p>
        <fieldset className="spoon-picker">
          <legend className="sr-only">How many spoons do you have today?</legend>
          {Array.from({ length: MAX_SPOONS - MIN_SPOONS + 1 }, (_, i) => i + MIN_SPOONS).map((n) => (
            <label key={n} className="spoon-option">
              <input
                type="radio"
                name="spoons"
                value={n}
                checked={day.spoons === n}
                onChange={() => setDay((d) => ({ ...d, spoons: n }))}
              />
              <span>
                {n}
                <span className="sr-only"> {n === 1 ? "spoon" : "spoons"}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div aria-live="polite">
        {day.spoons !== null ? (
          <p className="spoon-note">
            {day.spoons <= 4
              ? "A low-energy day. Do only the most important thing. Other things can wait."
              : day.spoons <= 8
                ? "A medium day. Pick a few things and keep some spoons spare."
                : "A good-energy day. It still helps to keep a few spoons spare."}
            {day.spoons <= 3 ? (
              <>
                {" "}
                <button type="button" className="inline-link" onClick={onBareMinimum}>
                  Bare Minimum mode
                </button>{" "}
                is there if you need it.
              </>
            ) : null}
          </p>
        ) : null}
        </div>
      </section>

      <section className="today-section" aria-labelledby="plan-title">
        <h2 id="plan-title" className="section-title" tabIndex={-1}>
          <Icon name="spoon" size={24} />
          What’s on today?
        </h2>
        <div className="spoon-meter" aria-live="polite">
          <p className={`spoon-total ${over ? "is-over" : ""}`}>
            {day.spoons === null
              ? `Planned: ${used} spoons. Pick your energy above to compare.`
              : over
                ? `Planned: ${used} spoons. You have ${budget}. Try taking 1 or 2 things off. They can wait.`
                : `Planned: ${used} of ${budget} spoons. ${budget - used} spare.`}
          </p>
          {day.spoons !== null ? (
            <div className="spoon-bar" aria-hidden="true">
              {Array.from({ length: Math.max(budget, used) }, (_, i) => (
                <span
                  key={i}
                  className={i < Math.min(used, budget) ? "spoon-used" : i < budget ? "spoon-free" : "spoon-over"}
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="filter-chips activity-chips">
          {activities.map((a) => (
            <label key={a.id} className="filter-chip">
              <input type="checkbox" checked={day.tasks.includes(a.id)} onChange={() => toggleTask(a.id)} />
              <span>
                {a.label} · {a.cost} {a.cost === 1 ? "spoon" : "spoons"}
              </span>
            </label>
          ))}
        </div>

        {day.custom.length > 0 ? (
          <ul className="custom-list">
            {day.custom.map((c) => (
              <li key={c.id}>
                <span>
                  {c.label} · {c.cost} {c.cost === 1 ? "spoon" : "spoons"}
                </span>
                <button
                  type="button"
                  className="clear-filters"
                  aria-label={`Remove ${c.label}`}
                  data-remove={c.id}
                  onClick={() => removeCustom(c.id, c.label)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <form
          className="custom-add"
          onSubmit={(event) => {
            event.preventDefault();
            addCustom();
          }}
        >
          <div className="field">
            <label htmlFor="custom-label">Add your own</label>
            <input
              id="custom-label"
              type="text"
              maxLength={60}
              value={customLabel}
              placeholder="for example, walk the dog"
              aria-describedby={customError ? "custom-error" : undefined}
              aria-invalid={customError ? true : undefined}
              onChange={(e) => {
                setCustomLabel(e.target.value);
                if (customError) setCustomError("");
              }}
            />
            {customError ? (
              <p className="field-error" id="custom-error">
                {customError}
              </p>
            ) : null}
          </div>
          <div className="field">
            <label htmlFor="custom-cost">Spoons</label>
            <select
              id="custom-cost"
              className="script-select"
              value={customCost}
              onChange={(e) => setCustomCost(Number(e.target.value))}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="button button-secondary">
            Add
          </button>
        </form>

        <div aria-live="polite">
        {over && (selectedSwaps.length > 0 || day.custom.length > 0) ? (
          <div className="swap-box">
            <p className="call-feedback-title">
              <Icon name="spark" size={20} />
              Ways to make today lighter
            </p>
            <ul>
              {selectedSwaps.slice(0, 3).map((a) => (
                <li key={a!.id}>
                  <strong>{a!.label}:</strong> {a!.swap}
                </li>
              ))}
              {day.custom.length > 0 ? (
                <li>
                  <strong>Your own items:</strong> ask yourself whether each one could wait until tomorrow.
                </li>
              ) : null}
            </ul>
          </div>
        ) : null}
        </div>

        <div className="today-actions">
          {day.tasks.length + day.custom.length > 0 ? (
            <button type="button" className="clear-filters" onClick={clearPlan}>
              Clear today’s plan
            </button>
          ) : null}
          <p className="undo-row" role="status">
            {undo ? (
              <>
                {undo.message}{" "}
                <button type="button" className="inline-link" id="today-undo" onClick={undoLast}>
                  Undo
                </button>
              </>
            ) : null}
          </p>
        </div>
      </section>

      <section className="today-section" aria-labelledby="step-title">
        <h2 id="step-title" className="section-title">
          <Icon name="compass" size={24} />
          One step, if you have it in you
        </h2>
        {nextStep ? (
          <div className="next-step">
            <p className="scenario-who">{nextStep.journey.title}</p>
            <p className="next-step-title">{nextStep.step.title}</p>
            <button type="button" className="button button-primary" onClick={() => onResume(nextStep.journey.id)}>
              Open this journey
              <Icon name="arrow-right" size={18} />
            </button>
          </div>
        ) : (
          <p className="section-lede">
            No journey in progress. When you start one, its next step shows up here. Doing nothing today is also
            a valid plan.
          </p>
        )}
      </section>

      <section className="today-section" aria-labelledby="quest-title">
        <h2 id="quest-title" className="section-title">
          <Icon name="flag" size={24} />
          Quests
        </h2>
        <p className="section-lede">
          Small, optional goals that make hard days easier later. There are no deadlines.{" "}
          {doneCount > 0 ? <strong>Done so far: {doneCount}.</strong> : null}
        </p>
        <ul className="quest-list">
          {quests.map((q) => {
            const done = isDone(q.id);
            return (
              <li key={q.id} className={`quest ${done ? "is-done" : ""}`}>
                <span className="quest-mark" aria-hidden="true">
                  <Icon name={done ? "check" : "flag"} size={20} />
                </span>
                <div className="quest-body">
                  <p className="quest-title">
                    {q.title}
                    <span className="sr-only">{done ? " (done)" : " (not done yet)"}</span>
                  </p>
                  <p className="quest-detail">{q.detail}</p>
                </div>
                {q.auto ? (
                  !done && questTarget[q.id] ? (
                    <button
                      type="button"
                      className="button button-secondary quest-go"
                      onClick={() => onNavigate(questTarget[q.id], q.id === "words" ? "words" : undefined)}
                      aria-label={`Go: ${q.title}`}
                    >
                      Go
                    </button>
                  ) : null
                ) : (
                  <label className="quest-check">
                    <input
                      type="checkbox"
                      checked={done}
                      aria-label={`Done: ${q.title}`}
                      onChange={() => toggleManual(q.id)}
                    />
                    <span aria-hidden="true">Done</span>
                  </label>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
