import './key.scss'
export default function Key({ display, underscore }) {
  return (
    <div className={`key  ${underscore ? 'underscore' : ''}`}>
      <span key={display} className={`${display === '@' ? 'atsign' : ''}`}>
        {display}
      </span>
    </div>
  )
}
