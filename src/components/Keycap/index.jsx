import './style/keycap.css'
export default function Keycap({ type, children }) {
  return <kbd className={`keycap ${type}`}>{children}</kbd>
}
