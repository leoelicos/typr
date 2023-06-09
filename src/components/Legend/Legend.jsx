import Key from '../Key/Key'
import './legend.scss'
import { useContext, useMemo } from 'react'
import { PressedContext } from '../../pressedContext/pressedContext'

const Legend = ({ code, display, shiftDisplay }) => {
  const state = useContext(PressedContext)

  const shifted = state['ShiftLeft'] || state['ShiftRight']
  const isPressed = state[code]
  const pressedClass = useMemo(() => (isPressed ? 'pressed' : ''), [isPressed])
  return (
    <div className={`legend ${display ? '' : 'blank'} ${pressedClass}`}>
      <Key
        display={shifted ? shiftDisplay : display}
        underscore={display === 'F' || display === 'J'}
      />
    </div>
  )
}

export default Legend
