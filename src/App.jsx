import './App.scss'
import Frame from './components/Frame'
import Keycap from './components/Keycap'
import Keyboard from './components/Keyboard'
import Row from './components/Row'
import Legend from './components/Legend'

import typing from './data/typing'

import useKey from './hooks/useKey.js'
import { PressedDispatchContext } from './pressedContext/pressedContext'
import { useContext } from 'react'
export default function App() {
  const dispatch = useContext(PressedDispatchContext)
  useKey(dispatch)
  return (
    <Keyboard>
      <Frame>
        {typing.map((row) => (
          <Row
            key={row.rowId}
            location={row.location}>
            {row.keys.map((key) => (
              <Keycap
                key={key.code}
                type={key.type}>
                <Legend
                  code={key.code}
                  display={key.display}
                  shiftDisplay={key.shiftDisplay}
                />
              </Keycap>
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
