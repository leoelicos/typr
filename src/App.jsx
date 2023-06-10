import { useContext, useMemo } from 'react'
import useKey from './hooks/useKey.js'
import Frame from './components/Frame/Frame.jsx'
import Keycap from './components/Keycap/Keycap.jsx'
import Keyboard from './components/Keyboard/Keyboard.jsx'
import Row from './components/Row/Row.jsx'
import Legend from './components/Legend/Legend.jsx'
import typing from './data/typing.js'
import { PressedContext, PressedDispatchContext } from './pressedContext/pressedContext'
import './App.scss'
import Key from './components/Key/Key.jsx'

export default function App() {
  const dispatch = useContext(PressedDispatchContext)
  useKey(dispatch)
  const state = useContext(PressedContext)
  const shifted = state.ShiftLeft || state.ShiftRight
  const blanks = useMemo(() => ['Tab', 'ControlLeft', 'MetaLeft', 'AltLeft', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'], [])
  return (
    <Keyboard>
      <Frame>
        {typing.map((row) => {
          return (
            <Row key={row.rowId} location={row.location}>
              {row.keys.map((key) => {
                return (
                  <Keycap key={key.code} type={key.type}>
                    <Legend isBlank={blanks.includes(key.code)} isPressed={state[key.code]}>
                      <Key display={shifted ? key.shiftDisplay : key.display} underscore={['KeyF', 'KeyJ'].includes(key.code)} />
                    </Legend>
                  </Keycap>
                )
              })}
            </Row>
          )
        })}
      </Frame>
    </Keyboard>
  )
}
