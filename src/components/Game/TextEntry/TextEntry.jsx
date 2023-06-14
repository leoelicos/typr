import { forwardRef } from 'react'
import './textentry.scss'
const TextEntry = forwardRef(function TextEntryComponent(props, ref) {
  return (
    <div className="text-entry-wrapper">
      <textarea type="text" className="text-entry" ref={ref} />
    </div>
  )
})
export default TextEntry
