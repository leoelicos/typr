import './key.scss'

export default function Key({ display, underscore }) {
  return <div className={`key  ${underscore ? 'underscore' : ''}`}>{display}</div>
}
