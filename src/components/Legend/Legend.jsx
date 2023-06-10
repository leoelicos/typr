import './legend.scss'

export default function Legend({ isBlank, isPressed, children }) {
  return <div className={`legend ${isBlank ? 'blank' : ''} ${isPressed ? 'pressed' : ''}`}>{children}</div>
}
