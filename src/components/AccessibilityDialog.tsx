import { useEffect, useRef } from "react";
import {
  defaultSettings,
  textSizes,
  type Settings,
} from "../lib/settings";
import { Icon } from "./Icon";

export function AccessibilityDialog({
  open,
  settings,
  onChange,
  onClose,
}: {
  open: boolean;
  settings: Settings;
  onChange: (next: Settings) => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="settings-dialog"
      aria-labelledby="settings-title"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          event.currentTarget.close();
        }
      }}
    >
      <div className="dialog-head">
        <div>
          <p className="eyebrow">Make it yours</p>
          <h2 id="settings-title">Accessibility settings</h2>
        </div>
        <button
          type="button"
          className="dialog-close"
          aria-label="Close accessibility settings"
          onClick={() => dialogRef.current?.close()}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className="dialog-body">
        <fieldset className="control-group">
          <legend>Text size</legend>
          <div className="segmented">
            {textSizes.map((size) => (
              <label key={size.value} className="segment">
                <input
                  type="radio"
                  name="text-size"
                  value={size.value}
                  checked={settings.scale === size.value}
                  onChange={() => onChange({ ...settings, scale: size.value })}
                />
                <span>{size.label}</span>
              </label>
            ))}
          </div>
          <p className="field-help">
            Every page scales immediately. The choice is saved on this device.
          </p>
        </fieldset>

        <div className="control-group">
          <label className="switch-row">
            <span className="switch-copy">
              <strong>High contrast</strong>
              <span className="field-help">
                Black background, white text, yellow highlights.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.contrast}
              onChange={(event) =>
                onChange({ ...settings, contrast: event.target.checked })
              }
            />
          </label>

          <label className="switch-row">
            <span className="switch-copy">
              <strong>Reading-friendly spacing</strong>
              <span className="field-help">
                More space between letters, words, and lines.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.reading}
              onChange={(event) =>
                onChange({ ...settings, reading: event.target.checked })
              }
            />
          </label>

          <label className="switch-row">
            <span className="switch-copy">
              <strong>Reduce motion</strong>
              <span className="field-help">
                Stops all movement, including the background pictures and the breathing circle.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.reduceMotion}
              onChange={(event) =>
                onChange({ ...settings, reduceMotion: event.target.checked })
              }
            />
          </label>
        </div>

        <p className="settings-note">
          <Icon name="lock" size={16} />
          Settings live only in this browser. No account, no tracking.
        </p>
      </div>

      <div className="dialog-foot">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => onChange(defaultSettings)}
        >
          Reset to defaults
        </button>
        <button
          type="button"
          className="button button-primary"
          onClick={() => dialogRef.current?.close()}
        >
          Done
        </button>
      </div>
    </dialog>
  );
}
