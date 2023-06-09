import { useContext } from 'react'
import useKey from './hooks/useKey.js'
import Frame from './components/Frame/Frame.jsx'
import Keycap from './components/Keycap/Keycap.jsx'
import Keyboard from './components/Keyboard/Keyboard.jsx'
import Row from './components/Row/Row.jsx'
import Legend from './components/Legend/Legend.jsx'
import typing from './data/typing.js'
import { PressedDispatchContext } from './pressedContext/pressedContext'
import './App.scss'

export default function App() {
  const dispatch = useContext(PressedDispatchContext)
  useKey(dispatch)
  return (
    <Keyboard>
      <Frame>
        {typing.map((row) => (
          <Row key={row.rowId} location={row.location}>
            {row.keys.map((key) => (
              <Keycap key={key.code} type={key.type}>
                <Legend code={key.code} display={key.display} shiftDisplay={key.shiftDisplay} />
              </Keycap>
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
