import './key.scss'
export default function Key({ value, composite }) {
  if (composite)
    // split the value into spans
    value = value.split('').map((character) => <span key={character}>{character}</span>)
  // if (value === 'SPACE') console.log('render space')
  return <div className={`key ${composite ? 'composite' : ''}`}>{value}</div>
}
