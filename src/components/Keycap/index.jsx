import Legend from '../Legend'
import './style/keycap.css'
export default function Keycap({ type, value }) {
  return (
    <kbd className={`keycap ${type}`}>
      <Legend>{value}</Legend>
    </kbd>
  )
}
