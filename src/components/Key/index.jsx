import Keycap from '../Keycap'
import './style/key.css'
export default function Key({ type, value }) {
  return (
    <div className={`key ${type}`}>
      <Keycap>{value}</Keycap>
    </div>
  )
}
