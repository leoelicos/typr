import { DURATIONS, WORD_COUNTS, type TestConfig } from '../lib/session.ts'
import { SOURCE_LABELS, type TextSource } from '../lib/text.ts'
import { Segmented } from './Segmented.tsx'
import './TestConfigBar.css'

const SOURCES = Object.entries(SOURCE_LABELS).map(([value, label]) => ({
  value: value as TextSource,
  label,
}))

export function TestConfigBar({
  config,
  onChange,
}: {
  config: TestConfig
  onChange: (patch: Partial<TestConfig>) => void
}) {
  const canPunctuate = config.source === 'words'
  return (
    <fieldset className="config-bar">
      <legend className="sr-only">Test options</legend>
      <Segmented
        legend="Mode"
        value={config.mode}
        onChange={(mode) => onChange({ mode })}
        options={[
          { value: 'time', label: 'Timed' },
          { value: 'words', label: 'Words' },
        ]}
      />
      {config.mode === 'time' ? (
        <Segmented
          legend="Duration"
          value={config.duration}
          onChange={(duration) => onChange({ duration })}
          options={DURATIONS.map((d) => ({
            value: d,
            label: d >= 60 ? `${d / 60}m` : `${d}s`,
            srLabel: d >= 60 ? `${d / 60} minute${d === 60 ? '' : 's'}` : `${d} seconds`,
          }))}
        />
      ) : (
        <Segmented
          legend="Length"
          value={config.wordCount}
          onChange={(wordCount) => onChange({ wordCount })}
          options={WORD_COUNTS.map((n) => ({ value: n, label: n, srLabel: `${n} words` }))}
        />
      )}
      <Segmented
        legend="Text"
        value={config.source}
        onChange={(source) => onChange({ source })}
        options={SOURCES}
      />
      <fieldset className="segmented">
        <legend className="segmented-legend">Extras</legend>
        <div className="segmented-track">
          <label className="segmented-option" data-disabled={!canPunctuate || undefined}>
            <input
              type="checkbox"
              checked={config.punctuation && canPunctuate}
              disabled={!canPunctuate}
              onChange={(e) => onChange({ punctuation: e.currentTarget.checked })}
            />
            <span>Punctuation</span>
          </label>
          <label
            className="segmented-option"
            data-disabled={config.source === 'quote' || undefined}
          >
            <input
              type="checkbox"
              checked={config.numbers && config.source !== 'quote'}
              disabled={config.source === 'quote'}
              onChange={(e) => onChange({ numbers: e.currentTarget.checked })}
            />
            <span>Numbers</span>
          </label>
        </div>
      </fieldset>
    </fieldset>
  )
}
