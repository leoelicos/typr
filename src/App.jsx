import './App.css'
import Frame from './components/Frame'
import Key from './components/Key'
import Keyboard from './components/Keyboard'
import Row from './components/Row'

const stats = {
  key: 'c',
  keyCode: 67,
  which: 67,
  code: 'KeyC',
  location: 0,
  altKey: false,
  ctrlKey: true,
  metaKey: false,
  shiftKey: false,
  repeat: false
}
const typing = [
  {
    rowId: 0,
    keys: [
      { type: 'long-56', value: '↹', code: 'Tab', key: 'Tab' },
      { type: 'regular', value: 'Q', code: 'KeyQ', key: 'q' },
      { type: 'regular', value: 'W', code: 'KeyW', key: 'w' },
      { type: 'regular', value: 'E', code: 'KeyE', key: 'e' },
      { type: 'regular', value: 'R', code: 'KeyR', key: 'r' },
      { type: 'regular', value: 'T', code: 'KeyT', key: 't' },
      { type: 'regular', value: 'Y', code: 'KeyY', key: 'y' },
      { type: 'regular', value: 'U', code: 'KeyU', key: 'u' },
      { type: 'regular', value: 'I', code: 'KeyI', key: 'i' },
      { type: 'regular', value: 'O', code: 'KeyO', key: 'o' },
      { type: 'regular', value: 'P', code: 'KeyP', key: 'p' },
      { type: 'regular', value: '[{', code: 'BracketLeft', key: '[' },
      { type: 'regular', value: ']}', code: 'BracketRight', key: ']' },
      { type: 'long-56', value: '\\|', code: 'Backslash', key: '\\' }
    ]
  },
  {
    rowId: 1,
    keys: [
      { type: 'long-66', value: '⇩', code: 'CapsLock', key: 'CapsLock' },
      { type: 'regular', value: 'A', code: 'KeyA', key: 'a' },
      { type: 'regular', value: 'S', code: 'KeyS', key: 's' },
      { type: 'regular', value: 'D', code: 'KeyD', key: 'd' },
      { type: 'regular', value: 'F', code: 'KeyF', key: 'f' },
      { type: 'regular', value: 'G', code: 'KeyG', key: 'g' },
      { type: 'regular', value: 'H', code: 'KeyH', key: 'h' },
      { type: 'regular', value: 'J', code: 'KeyJ', key: 'j' },
      { type: 'regular', value: 'K', code: 'KeyK', key: 'k' },
      { type: 'regular', value: 'L', code: 'KeyL', key: 'l' },
      { type: 'regular', value: ';:', code: 'Semicolon', key: ';' },
      { type: 'regular', value: `'"`, code: 'Quote', key: `'` },
      { type: 'long-84', value: '↵', code: 'Enter', key: 'Enter' }
    ]
  },
  {
    rowId: 2,
    keys: [
      { type: 'long-84', value: '⇧', code: 'ShiftLeft', key: 'Shift' },
      { type: 'regular', value: 'Z', code: 'KeyZ', key: 'z' },
      { type: 'regular', value: 'X', code: 'KeyX', key: 'x' },
      { type: 'regular', value: 'C', code: 'KeyC', key: 'c' },
      { type: 'regular', value: 'V', code: 'KeyV', key: 'v' },
      { type: 'regular', value: 'B', code: 'KeyB', key: 'b' },
      { type: 'regular', value: 'N', code: 'KeyN', key: 'n' },
      { type: 'regular', value: 'M', code: 'KeyM', key: 'm' },
      { type: 'regular', value: ',<', code: 'Comma', key: ',' },
      { type: 'regular', value: '.>', code: 'Period', key: '.' },
      { type: 'regular', value: '/?', code: 'Slash', key: '/' },
      { type: 'long-104', value: `⇩`, code: 'ShiftRight', key: 'Shift' }
    ]
  },
  {
    rowId: 3,
    keys: [
      { type: 'long-47', value: 'Ctrl', code: 'ControlLeft', key: 'Control' },
      { type: 'long-47', value: '⊞', code: 'MetaLeft', key: 'Meta' },
      { type: 'long-47', value: 'Alt', code: 'AltLeft', key: 'Alt' },
      { type: 'long-238', value: '', code: 'Space', key: ' ' },
      { type: 'long-47', value: 'Alt', code: 'AltRight', key: 'Alt' },
      { type: 'long-47', value: '⊞', code: 'MetaRight', key: 'Meta' },
      { type: 'long-47', value: '≣', code: 'ContextMenu', key: 'ContextMenu' },
      { type: 'long-47', value: 'Ctrl', code: 'ControlRight', key: 'Control' }
    ]
  }
]

export default function App() {
  return (
    <Keyboard>
      <Frame>
        {typing.map((row) => (
          <Row key={row.rowId}>
            {row.keys.map((key) => (
              <Key
                type={key.type}
                value={key.value}
                code={key.code}
              />
            ))}
          </Row>
        ))}
      </Frame>
    </Keyboard>
  )
}
