import type { Ref } from 'react'
import {
  ACCENT_LABELS,
  ACCENTS,
  updateSettings,
  type Accent,
  type Settings,
} from '../lib/settings.ts'
import { Icon } from './Icon.tsx'
import { Segmented, Toggle } from './Segmented.tsx'
import './SettingsDialog.css'

/** React 19: `ref` is a plain prop, no forwardRef needed. */
export function SettingsDialog({
  settings,
  ref,
}: {
  settings: Settings
  ref: Ref<HTMLDialogElement>
}) {
  return (
    <dialog ref={ref} className="dialog dialog--settings" aria-labelledby="settings-title">
      <div className="dialog-header">
        <h2 id="settings-title">Settings</h2>
        <form method="dialog">
          <button type="submit" className="icon-button">
            <Icon name="close" />
            <span className="sr-only">Close settings</span>
          </button>
        </form>
      </div>

      <div className="settings-body">
        <section aria-labelledby="s-appearance">
          <h3 id="s-appearance">Appearance</h3>
          <Segmented
            legend="Theme"
            value={settings.theme}
            onChange={(theme) => updateSettings({ theme })}
            options={[
              { value: 'system', label: 'System' },
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
          />
          <fieldset className="swatches">
            <legend className="segmented-legend">Accent colour</legend>
            <div className="swatch-row">
              {ACCENTS.map((a: Accent) => (
                <label key={a} className="swatch" data-accent-swatch={a}>
                  <input
                    type="radio"
                    name="accent"
                    value={a}
                    checked={settings.accent === a}
                    onChange={() => updateSettings({ accent: a })}
                  />
                  <span className="swatch-dot" aria-hidden="true" />
                  <span>{ACCENT_LABELS[a]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <Segmented
            legend="Text size"
            value={settings.textSize}
            onChange={(textSize) => updateSettings({ textSize })}
            options={[
              { value: 'sm', label: 'S', srLabel: 'Small' },
              { value: 'md', label: 'M', srLabel: 'Medium' },
              { value: 'lg', label: 'L', srLabel: 'Large' },
              { value: 'xl', label: 'XL', srLabel: 'Extra large' },
            ]}
          />
          <Segmented
            legend="Caret"
            value={settings.caret}
            onChange={(caret) => updateSettings({ caret })}
            options={[
              { value: 'line', label: 'Line' },
              { value: 'block', label: 'Block' },
              { value: 'underline', label: 'Underline' },
            ]}
          />
        </section>

        <section aria-labelledby="s-motion">
          <h3 id="s-motion">Motion</h3>
          <Segmented
            legend="Animations"
            value={settings.motion}
            onChange={(motion) => updateSettings({ motion })}
            options={[
              { value: 'system', label: 'Follow system' },
              { value: 'reduce', label: 'Reduced' },
              { value: 'full', label: 'Full' },
            ]}
          />
        </section>

        <section aria-labelledby="s-keyboard">
          <h3 id="s-keyboard">Keyboard</h3>
          <Toggle
            label="Show on-screen keyboard"
            checked={settings.showKeyboard}
            onChange={(showKeyboard) => updateSettings({ showKeyboard })}
          />
          <Toggle
            label="Highlight the next key"
            description="Includes which Shift to use for capitals and symbols."
            checked={settings.highlightNextKey}
            onChange={(highlightNextKey) => updateSettings({ highlightNextKey })}
          />
          <Toggle
            label="Colour keys by finger"
            description="Touch-typing zones: each finger owns a colour."
            checked={settings.fingerColours}
            onChange={(fingerColours) => updateSettings({ fingerColours })}
          />
        </section>

        <section aria-labelledby="s-a11y">
          <h3 id="s-a11y">Screen reader</h3>
          <Toggle
            label="Announce time remaining"
            description="At 30, 10 and 5 seconds left in timed tests."
            checked={settings.announceTime}
            onChange={(announceTime) => updateSettings({ announceTime })}
          />
        </section>
      </div>
    </dialog>
  )
}
