import './key.scss'
export default function Key({ value, composite, underscore }) {
  if (composite)
    // split the value into spans
    value = value.split('').map((character) => (
      <span
        key={character}
        className={`${character === '@' ? 'atsign' : ''}`}>
        {character}
      </span>
    ))
  // if (value === 'SPACE') console.log('render space')

  return <div className={`key ${composite ? 'composite' : ''} ${underscore ? 'underscore' : ''}`}>{value}</div>
}
