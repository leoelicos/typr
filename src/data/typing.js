import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  fa1,
  faExclamation,
  fa2,
  faAt,
  fa3,
  faHashtag,
  fa4,
  faDollar,
  fa5,
  faPercent,
  fa6,
  faChevronUp,
  fa7,
  fa8,
  faAsterisk,
  fa9,
  fa0,
  faMinus,
  faUnderline,
  faEquals,
  faPlus,
  faDeleteLeft,
  faQ,
  faW,
  faE,
  faR,
  faT,
  faY,
  faU,
  faI,
  faO,
  faP,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons'

const typing = [
  {
    rowId: 0,
    location: 0,
    keys: [
      { type: 'regular', display: '`', shiftDisplay: '~', code: 'Backquote', key: '`' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa1} />, shiftDisplay: <FontAwesomeIcon icon={faExclamation} />, code: 'Digit1', key: '1' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa2} />, shiftDisplay: <FontAwesomeIcon icon={faAt} />, code: 'Digit2', key: '2' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa3} />, shiftDisplay: <FontAwesomeIcon icon={faHashtag} />, code: 'Digit3', key: '3' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa4} />, shiftDisplay: <FontAwesomeIcon icon={faDollar} />, code: 'Digit4', key: '4' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa5} />, shiftDisplay: <FontAwesomeIcon icon={faPercent} />, code: 'Digit5', key: '5' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa6} />, shiftDisplay: <FontAwesomeIcon icon={faChevronUp} />, code: 'Digit6', key: '6' },
      {
        type: 'regular',
        display: <FontAwesomeIcon icon={fa7} />,
        shiftDisplay: '&',
        code: 'Digit7',
        key: '7'
      },
      { type: 'regular', display: <FontAwesomeIcon icon={fa8} />, shiftDisplay: <FontAwesomeIcon icon={faAsterisk} />, code: 'Digit8', key: '8' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa9} />, shiftDisplay: '(', code: 'Digit9', key: '9' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa0} />, shiftDisplay: ')', code: 'Digit0', key: '0' },
      { type: 'regular', display: <FontAwesomeIcon icon={faMinus} />, shiftDisplay: '_', code: 'Minus', key: '-' },
      { type: 'regular', display: <FontAwesomeIcon icon={faEquals} />, shiftDisplay: <FontAwesomeIcon icon={faPlus} />, code: 'Equal', key: '=' },
      {
        type: 'long-76',
        display: <FontAwesomeIcon icon={faDeleteLeft} />,
        shiftDisplay: <FontAwesomeIcon icon={faDeleteLeft} />,
        code: 'Backspace',
        key: '\\'
      }
    ]
  },
  {
    rowId: 1,
    location: 0,
    keys: [
      { type: 'long-56', display: 'Tab', shiftDisplay: '', code: 'Tab', key: 'Tab' },
      { type: 'regular', display: <FontAwesomeIcon icon={faQ} />, shiftDisplay: <FontAwesomeIcon icon={faQ} />, code: 'KeyQ', key: 'q' },
      { type: 'regular', display: <FontAwesomeIcon icon={faW} />, shiftDisplay: <FontAwesomeIcon icon={faW} />, code: 'KeyW', key: 'w' },
      { type: 'regular', display: <FontAwesomeIcon icon={faE} />, shiftDisplay: <FontAwesomeIcon icon={faE} />, code: 'KeyE', key: 'e' },
      { type: 'regular', display: <FontAwesomeIcon icon={faR} />, shiftDisplay: <FontAwesomeIcon icon={faR} />, code: 'KeyR', key: 'r' },
      { type: 'regular', display: <FontAwesomeIcon icon={faT} />, shiftDisplay: <FontAwesomeIcon icon={faT} />, code: 'KeyT', key: 't' },
      { type: 'regular', display: <FontAwesomeIcon icon={faY} />, shiftDisplay: <FontAwesomeIcon icon={faY} />, code: 'KeyY', key: 'y' },
      { type: 'regular', display: <FontAwesomeIcon icon={faU} />, shiftDisplay: <FontAwesomeIcon icon={faU} />, code: 'KeyU', key: 'u' },
      { type: 'regular', display: <FontAwesomeIcon icon={faI} />, shiftDisplay: <FontAwesomeIcon icon={faI} />, code: 'KeyI', key: 'i' },
      { type: 'regular', display: <FontAwesomeIcon icon={faO} />, shiftDisplay: <FontAwesomeIcon icon={faO} />, code: 'KeyO', key: 'o' },
      { type: 'regular', display: <FontAwesomeIcon icon={faP} />, shiftDisplay: <FontAwesomeIcon icon={faP} />, code: 'KeyP', key: 'p' },
      { type: 'regular', display: '[', shiftDisplay: '{', code: 'BracketLeft', key: '[' },
      { type: 'regular', display: ']', shiftDisplay: '}', code: 'BracketRight', key: ']' },
      { type: 'long-56', display: '|', shiftDisplay: '\\', code: 'Backslash', key: '\\' }
    ]
  },
  {
    rowId: 2,
    location: 0,
    keys: [
      { type: 'long-66', display: 'CAPS', shiftDisplay: 'CAPS', code: 'CapsLock', key: 'CapsLock' },
      { type: 'regular', display: 'a', shiftDisplay: 'A', code: 'KeyA', key: 'a' },
      { type: 'regular', display: 's', shiftDisplay: 'S', code: 'KeyS', key: 's' },
      { type: 'regular', display: 'd', shiftDisplay: 'D', code: 'KeyD', key: 'd' },
      { type: 'regular', display: 'f', shiftDisplay: 'F', code: 'KeyF', key: 'f' },
      { type: 'regular', display: 'g', shiftDisplay: 'G', code: 'KeyG', key: 'g' },
      { type: 'regular', display: 'h', shiftDisplay: 'H', code: 'KeyH', key: 'h' },
      { type: 'regular', display: 'j', shiftDisplay: 'J', code: 'KeyJ', key: 'j' },
      { type: 'regular', display: 'k', shiftDisplay: 'K', code: 'KeyK', key: 'k' },
      { type: 'regular', display: 'l', shiftDisplay: 'L', code: 'KeyL', key: 'l' },
      { type: 'regular', display: ';', shiftDisplay: ':', code: 'Semicolon', key: ';' },
      { type: 'regular', display: `'`, shiftDisplay: '"', code: 'Quote', key: `'` },
      { type: 'long-84', display: 'ENTER', shiftDisplay: 'ENTER', code: 'Enter', key: 'Enter' }
    ]
  },
  {
    rowId: 3,
    location: 0,
    keys: [
      { type: 'long-84', display: 'SHIFT', shiftDisplay: 'SHIFT', code: 'ShiftLeft', key: 'Shift' },
      { type: 'regular', display: 'z', shiftDisplay: 'Z', code: 'KeyZ', key: 'z' },
      { type: 'regular', display: 'x', shiftDisplay: 'X', code: 'KeyX', key: 'x' },
      { type: 'regular', display: 'c', shiftDisplay: 'C', code: 'KeyC', key: 'c' },
      { type: 'regular', display: 'v', shiftDisplay: 'V', code: 'KeyV', key: 'v' },
      { type: 'regular', display: 'b', shiftDisplay: 'B', code: 'KeyB', key: 'b' },
      { type: 'regular', display: 'n', shiftDisplay: 'N', code: 'KeyN', key: 'n' },
      { type: 'regular', display: 'm', shiftDisplay: 'M', code: 'KeyM', key: 'm' },
      { type: 'regular', display: ',', shiftDisplay: <FontAwesomeIcon icon={faChevronLeft} />, code: 'Comma', key: ',' },
      { type: 'regular', display: '.', shiftDisplay: <FontAwesomeIcon icon={faChevronRight} />, code: 'Period', key: '.' },
      { type: 'regular', display: '/', shiftDisplay: '?', code: 'Slash', key: '/' },
      { type: 'long-104', display: `SHIFT`, shiftDisplay: 'SHIFT', code: 'ShiftRight', key: 'Shift' }
    ]
  },
  {
    rowId: 4,
    location: 0,
    keys: [
      { type: 'long-47', display: 'Ctrl', shiftDisplay: 'Ctrl', code: 'ControlLeft', key: 'Control' },
      { type: 'long-47', display: 'Win', shiftDisplay: 'Win', code: 'MetaLeft', key: 'Meta' },
      { type: 'long-47', display: 'Alt', shiftDisplay: 'Alt', code: 'AltLeft', key: 'Alt' },
      { type: 'long-238', display: 'SPACE', shiftDisplay: 'SPACE', code: 'Space', key: ' ' },
      { type: 'long-47', display: 'Alt', shiftDisplay: 'Alt', code: 'AltRight', key: 'Alt' },
      { type: 'long-47', display: 'Win', shiftDisplay: 'Win', code: 'MetaRight', key: 'Meta' },
      { type: 'long-47', display: 'Fn', shiftDisplay: 'Fn', code: 'ContextMenu', key: 'ContextMenu' },
      { type: 'long-47', display: 'Ctrl', shiftDisplay: 'Ctrl', code: 'ControlRight', key: 'Control' }
    ]
  }
]

export default typing
