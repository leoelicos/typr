import './key.scss'
export default function Key({ display, shiftDisplay, underscore }) {
  // if (value === 'SPACE') console.log('display space')

  return (
    <div className={`key  ${underscore ? 'underscore' : ''}`}>
      <span
        key={display}
        className={`${display === '@' ? 'atsign' : ''}`}>
        {display}
      </span>
    </div>
  )
}
