import { Icon } from './Icon.tsx'
import './Header.css'

export function Header({
  theme,
  onToggleTheme,
  onOpenSettings,
}: {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onOpenSettings: () => void
}) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  return (
    <header className="site-header">
      <div className="wrap site-header-inner">
        <a className="brand" href="#main" aria-label="typr home">
          <span className="brand-mark" aria-hidden="true">
            typr
            <span className="brand-caret" />
          </span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav-list">
            <li>
              <a href="#practice">Practice</a>
            </li>
            <li>
              <a href="#history">History</a>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <button type="button" className="icon-button" onClick={onToggleTheme}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            <span className="sr-only">Switch to {nextTheme} theme</span>
          </button>
          <button
            type="button"
            className="icon-button"
            onClick={onOpenSettings}
            aria-haspopup="dialog"
          >
            <Icon name="settings" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </div>
    </header>
  )
}
