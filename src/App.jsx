import './App.css'
import Frame from './components/Frame'
import Keycap from './components/Keycap'
import Keyboard from './components/Keyboard'
import Row from './components/Row'
import Legend from './components/Legend'
import Key from './components/Key'

import typing from './data/typing'

const stats = {
  altKey: false,
  ctrlKey: true,
  metaKey: false,
  shiftKey: false
}

export default function App() {
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
                  <Key>{key.value}</Key>
                </Legend>
              </Keycap>
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
