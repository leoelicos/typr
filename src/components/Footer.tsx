import { Icon } from './Icon.tsx'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <section aria-labelledby="shortcuts-title">
          <h2 id="shortcuts-title" className="footer-title">
            Keyboard shortcuts
          </h2>
          <dl className="shortcuts">
            <div>
              <dt>
                <kbd>Esc</kbd>
              </dt>
              <dd>New test (while typing)</dd>
            </div>
            <div>
              <dt>
                <kbd>Tab</kbd>
              </dt>
              <dd>Move focus out of the typing box</dd>
            </div>
            <div>
              <dt>
                <kbd>Enter</kbd>
              </dt>
              <dd>Activate the focused button, e.g. Next test</dd>
            </div>
            <div>
              <dt>Any key</dt>
              <dd>Jump back into the typing box when nothing else is focused</dd>
            </div>
          </dl>
        </section>
        <p className="footer-credit">
          Made by Leo Wong ·{' '}
          <a href="https://github.com/leoelicos/typr">
            <Icon name="github" width={16} height={16} /> Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  )
}
