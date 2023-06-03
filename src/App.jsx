import './App.css'
import Frame from './components/Frame'
import Keycap from './components/Keycap'
import Keyboard from './components/Keyboard'
import Row from './components/Row'
import Legend from './components/Legend'
import Key from './components/Key'

import typing from './data/typing'

import useKeyPress from './hooks/useKeyPress.js'

export default function App() {
  const { lastKeyPress, setLastKeyPress } = useKeyPress()
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
                <Legend>
                  <Key value={key.value} />
                </Legend>
              </Keycap>
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
