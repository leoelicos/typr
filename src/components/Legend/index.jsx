import './legend.scss'
export default function Legend({ children, render, pressed }) {
  return <div className={`legend ${render ? '' : 'blank'} ${pressed ? 'pressed' : ''}`}>{children}</div>
}
