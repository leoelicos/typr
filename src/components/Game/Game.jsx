/* framework */
import { forwardRef, useContext, useMemo } from 'react'

/* data */
import typing from '../../data/typing.js'

/* context */
import { PressedContext, PressedDispatchContext } from '../../pressedContext/pressedContext.js'

/* hooks */
import useKey from '../../hooks/useKey.js'

/* components */
import TextEntry from './TextEntry/TextEntry.jsx'

/* keyboard components */
import Frame from './Keyboard/Frame/Frame.jsx'
import Keycap from './Keyboard/Frame/Row/Keycap/Keycap.jsx'
import Keyboard from './Keyboard/Keyboard.jsx'
import Row from './Keyboard/Frame/Row/Row.jsx'
import Legend from './Keyboard/Frame/Row/Keycap/Legend/Legend.jsx'
import Key from './Keyboard/Frame/Row/Keycap/Legend/Key/Key.jsx'

/* style */
import './game.scss'

const Game = forwardRef(function GameComponent(props, ref) {
  const dispatch = useContext(PressedDispatchContext)
  const state = useContext(PressedContext)
  useKey(state, dispatch)
  const shifted = state.ShiftLeft || state.ShiftRight
  const blanks = useMemo(() => ['Tab', 'ControlLeft', 'MetaLeft', 'AltLeft', 'AltRight', 'MetaRight', 'ContextMenu', 'ControlRight'], [])

  return (
    <div className="game">
      <TextEntry ref={ref} />
      <Keyboard>
        <Frame>
          {typing.map((row) => {
            return (
              <Row key={row.rowId} location={row.location}>
                {row.keys.map((key) => {
                  return (
                    <Keycap key={key.code} type={key.type}>
                      <Legend isBlank={blanks.includes(key.code)} isPressed={state[key.code]} underscore={['KeyF', 'KeyJ'].includes(key.code)}>
                        <Key display={shifted ? key.shiftDisplay : key.display} />
                      </Legend>
                    </Keycap>
                  )
                })}
              </Row>
            )
          })}
        </Frame>
      </Keyboard>
    </div>
  )
})
export default Game
