import './legend.scss'

export default function Legend({ isBlank, isPressed, isUnderscore, children }) {
  let classes = 'legend'
  if (isBlank) classes += ' blank'
  if (isPressed) classes += ' pressed'
  if (isUnderscore) classes += ' underscore'
  return <div className={classes}>{children}</div>
}
