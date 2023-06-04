import './App.scss'
import Frame from './components/Frame'
import Keycap from './components/Keycap'
import Keyboard from './components/Keyboard'
import Row from './components/Row'
import Legend from './components/Legend'
import Key from './components/Key'

import typing from './data/typing'

import useKey from './hooks/useKey.js'

export default function App() {
  const { pressed } = useKey()
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
                  render={key.render}
                  pressed={pressed.find((k) => k.code === key.code).pressed}>
                  <Key
                    value={key.value}
                    composite={key.composite}
                  />
                </Legend>
              </Keycap>
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
