import { useEffect, useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { PageHeader } from "../components/PageHeader";
import { SpeakButton } from "../components/SpeakButton";
import { journeyById, journeys } from "../data/journeys";
import { sanitizeProgress, useProgress } from "../lib/progress";
import { focusLater } from "../lib/focus";

export function Navigator({
  initialJourney = null,
}: {
  initialJourney?: string | null;
}) {
  const [selected, setSelected] = useState<string | null>(initialJourney);
  const [progress, setProgress] = useProgress();
  const detailRef = useRef<HTMLDivElement>(null);
  const [undoSteps, setUndoSteps] = useState<{ id: string; steps: number[] } | null>(null);
  const journey = selected ? journeyById(selected) : undefined;

  useEffect(() => {
    if (!selected) return;
    window.scrollTo({ top: 0 });
    detailRef.current?.querySelector<HTMLElement>("h1")?.focus();
  }, [selected]);

  if (journey) {
    const done = progress[journey.id] ?? [];
    const total = journey.steps.length;
    const percent = Math.round((done.length / total) * 100);

    const toggle = (index: number) => {
      setProgress((stored) => {
        const current = sanitizeProgress(stored);
        const currentDone = current[journey.id] ?? [];
        const nextDone = currentDone.includes(index)
          ? currentDone.filter((item) => item !== index)
          : [...currentDone, index].sort((a, b) => a - b);
        return { ...current, [journey.id]: nextDone };
      });
    };

    const resetJourney = () => {
      setUndoSteps({ id: journey.id, steps: done });
      setProgress((stored) => ({ ...sanitizeProgress(stored), [journey.id]: [] }));
      focusLater("#journey-undo");
    };

    const undoReset = () => {
      if (!undoSteps) return;
      const { id, steps } = undoSteps;
      setProgress((stored) => ({ ...sanitizeProgress(stored), [id]: steps }));
      setUndoSteps(null);
    };

    return (
      <div ref={detailRef}>
        <button
          type="button"
          className="back-button"
          onClick={() => {
            const from = journey.id;
            setSelected(null);
            focusLater(`[data-journey="${from}"]`);
          }}
        >
          <Icon name="arrow-right" size={17} className="flip" />
          All care journeys
        </button>

        <PageHeader
          eyebrow={`Care journey · ${journey.time}`}
          title={journey.title}
          lede={journey.blurb}
        >
          <div className="progress-wrap">
            <div className="progress-labels">
              <span>
                {done.length} of {total} steps done
              </span>
              <span>{percent}%</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={total}
              aria-valuenow={done.length}
              aria-valuetext={`${done.length} of ${total} steps complete`}
            >
              <span className="progress-fill" style={{ width: `${percent}%` }} />
            </div>
          </div>
        </PageHeader>

        <ol className="steps">
          {journey.steps.map((step, index) => {
            const isDone = done.includes(index);
            const inputId = `${journey.id}-step-${index}`;
            return (
              <li key={step.title} className={isDone ? "step done" : "step"}>
                <div className="step-marker" aria-hidden="true">
                  {isDone ? <Icon name="check" size={18} /> : index + 1}
                </div>
                <div className="step-body">
                  <div className="step-title-row">
                    <input
                      id={inputId}
                      type="checkbox"
                      className="step-check"
                      checked={isDone}
                      onChange={() => toggle(index)}
                    />
                    <label htmlFor={inputId} className="step-title">
                      {step.title}
                    </label>
                  </div>
                  <p className="step-detail">{step.detail}</p>
                  {step.say ? (
                    <blockquote className="say">
                      <span className="say-label">Say it like this</span>
                      <p>“{step.say}”</p>
                    </blockquote>
                  ) : null}
                  <div className="step-actions">
                    <SpeakButton
                      id={`journey-${journey.id}-step-${index}`}
                      text={`Step ${index + 1}: ${step.title}. ${step.detail}${
                        step.say ? ` You can say: ${step.say}` : ""
                      }`}
                      label="Read this step"
                      context={`step ${index + 1}, ${step.title}`}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="journey-foot">
          {done.length > 0 ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={resetJourney}
            >
              Start this journey over
            </button>
          ) : null}
          <p className="undo-row" role="status">
            {undoSteps && undoSteps.id === journey.id ? (
              <>
                Your checkmarks were cleared.{" "}
                <button type="button" className="inline-link" id="journey-undo" onClick={undoReset}>
                  Undo
                </button>
              </>
            ) : null}
          </p>
          <p className="field-help">
            Progress is saved in this browser only. You can stop and come back.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Care journeys"
        title="Pick the situation you're in."
        lede="Each journey is a short, ordered list of what to do next. Check off steps as you go — Wayfinder remembers where you stopped."
      />

      <div className="journey-grid">
        {journeys.map((item) => {
          const done = progress[item.id]?.length ?? 0;
          return (
            <button
              key={item.id}
              type="button"
              className="journey-card"
              data-journey={item.id}
              onClick={() => setSelected(item.id)}
            >
              <span className="journey-icon">
                <Icon name={item.icon} size={26} />
              </span>
              <span className="journey-card-body">
                <span className="journey-title">{item.title}</span>
                <span className="journey-blurb">{item.blurb}</span>
                <span className="journey-meta">
                  <span className="pill">{item.steps.length} steps</span>
                  <span className="pill">{item.time}</span>
                  {done > 0 ? (
                    <span className="pill pill-done">
                      {done} done
                    </span>
                  ) : null}
                </span>
              </span>
              <span className="journey-arrow" aria-hidden="true">
                <Icon name="arrow-right" size={20} />
              </span>
            </button>
          );
        })}
      </div>

      <p className="journey-footnote">
        <Icon name="lock" size={16} />
        Your checkmarks live in this browser, not on a server. Nothing is sent
        anywhere.
      </p>
    </>
  );
}
