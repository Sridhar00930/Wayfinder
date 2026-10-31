import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { SpeakButton } from "../components/SpeakButton";
import { Icon } from "../components/Icon";
import { scriptById, scripts } from "../data/scripts";
import { copyToClipboard } from "../lib/clipboard";
import { focusLater } from "../lib/focus";

export function Scripts() {
  const [scriptId, setScriptId] = useState(scripts[0].id);
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [cleared, setCleared] = useState<Record<string, string> | null>(null);
  const template = scriptById(scriptId);
  const paragraphs = template.build(values);
  const scriptText = paragraphs.join("\n\n");


  const updateValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const copyScript = async () => {
    const copied = await copyToClipboard(scriptText);
    setStatus(
      copied
        ? "Script copied to clipboard."
        : "Couldn’t copy automatically. Select the text and copy it.",
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Call scripts"
        title="Know what to say before you call."
        lede="Pick a script, fill in what you know, and read it word for word. The blanks stay marked until you fill them in."
      />

      <div className="script-layout">
        <div className="script-form">
          <div className="field">
            <label htmlFor="script-choice">Which script do you need?</label>
            <select
              id="script-choice"
              className="script-select"
              value={template.id}
              onChange={(event) => {
                setScriptId(event.target.value);
                setValues({});
                setCleared(null);
                setStatus("");
              }}
            >
              {scripts.map((script) => (
                <option key={script.id} value={script.id}>
                  {script.title}
                </option>
              ))}
            </select>
            <p className="field-help">{template.when}</p>
          </div>

          <div className="tip-box">
            <Icon name="spark" size={18} />
            <p>{template.tip}</p>
          </div>

          <div className="field-grid">
            {template.fields.map((field) => {
              const inputId = `script-field-${field.key}`;
              return (
                <div className="field" key={field.key}>
                  <label htmlFor={inputId}>
                    {field.label}
                    {field.optional ? " (optional)" : ""}
                  </label>
                  <input
                    id={inputId}
                    type="text"
                    value={values[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(event) =>
                      updateValue(field.key, event.target.value)
                    }
                  />
                </div>
              );
            })}
          </div>

          <p className="field-help">
            Nothing you type is saved or sent anywhere.
          </p>
        </div>

        <section
          className="script-output"
          aria-labelledby="script-preview-title"
        >
          <div className="script-output-head">
            <h2 id="script-preview-title">Your script</h2>
            <span className="pill">Read it out loud</span>
          </div>
          <div className="script-text">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="script-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => void copyScript()}
            >
              <Icon name="copy" size={17} />
              Copy script
            </button>
            <SpeakButton
              id={`script-${template.id}`}
              text={scriptText}
              label="Read script aloud"
            />
            {Object.values(values).some((value) => value.trim()) ? (
              <button
                type="button"
                className="clear-filters"
                onClick={() => {
                  setCleared(values);
                  setValues({});
                  setStatus("");
                  focusLater("#script-undo");
                }}
              >
                Clear answers
              </button>
            ) : null}
          </div>
          <p className="copy-status" role="status" aria-live="polite">
            {status}
            {cleared && !Object.values(values).some((v) => v.trim()) ? (
              <>
                Answers cleared.{" "}
                <button
                  type="button"
                  className="inline-link"
                  id="script-undo"
                  onClick={() => {
                    setValues(cleared);
                    setCleared(null);
                    focusLater(".script-form input");
                  }}
                >
                  Undo
                </button>
              </>
            ) : null}
          </p>
          <p className="field-help">
            You can ask the person on the phone to slow down or repeat
            something. You can also ask them to send their answer in writing.
          </p>
        </section>
      </div>

      <p className="journey-footnote">
        <Icon name="phone" size={16} />
        These scripts are starting points, not legal or insurance advice. Add
        your own words where they fit better — the point is that you do not have
        to invent them on the spot.
      </p>
    </>
  );
}
