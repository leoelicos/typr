import './keycap.scss'
export default function Keycap({ children, type }) {
  return <kbd className={`keycap ${type}`}>{children}</kbd>
}
