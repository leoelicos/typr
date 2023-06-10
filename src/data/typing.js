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
  faA,
  faS,
  faD,
  faF,
  faG,
  faH,
  faJ,
  faK,
  faL,
  faZ,
  faX,
  faC,
  faV,
  faB,
  faN,
  faM,
  faQuoteRight,
  faChevronLeft,
  faChevronRight,
  faQuestion,
  faArrowDown,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons'
import { faWindows } from '@fortawesome/free-brands-svg-icons'

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
      { type: 'regular', display: <FontAwesomeIcon icon={fa7} />, shiftDisplay: '&', code: 'Digit7', key: '7' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa8} />, shiftDisplay: <FontAwesomeIcon icon={faAsterisk} />, code: 'Digit8', key: '8' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa9} />, shiftDisplay: '(', code: 'Digit9', key: '9' },
      { type: 'regular', display: <FontAwesomeIcon icon={fa0} />, shiftDisplay: ')', code: 'Digit0', key: '0' },
      { type: 'regular', display: <FontAwesomeIcon icon={faMinus} />, shiftDisplay: '_', code: 'Minus', key: '-' },
      { type: 'regular', display: <FontAwesomeIcon icon={faEquals} />, shiftDisplay: <FontAwesomeIcon icon={faPlus} />, code: 'Equal', key: '=' },
      { type: 'long-76', display: <FontAwesomeIcon icon={faDeleteLeft} />, shiftDisplay: <FontAwesomeIcon icon={faDeleteLeft} />, code: 'Backspace', key: '\\' }
    ]
  },
  {
    rowId: 1,
    location: 0,
    keys: [
      { type: 'long-56', display: 'T', shiftDisplay: '', code: 'Tab', key: 'Tab' },
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
      { type: 'long-56', display: '\\', shiftDisplay: '|', code: 'Backslash', key: '\\' }
    ]
  },
  {
    rowId: 2,
    location: 0,
    keys: [
      { type: 'long-66', display: <FontAwesomeIcon icon={faArrowDown} />, shiftDisplay: <FontAwesomeIcon icon={faArrowDown} />, code: 'CapsLock', key: 'CapsLock' },
      { type: 'regular', display: <FontAwesomeIcon icon={faA} />, shiftDisplay: <FontAwesomeIcon icon={faA} />, code: 'KeyA', key: 'a' },
      { type: 'regular', display: <FontAwesomeIcon icon={faS} />, shiftDisplay: <FontAwesomeIcon icon={faS} />, code: 'KeyS', key: 's' },
      { type: 'regular', display: <FontAwesomeIcon icon={faD} />, shiftDisplay: <FontAwesomeIcon icon={faD} />, code: 'KeyD', key: 'd' },
      { type: 'regular', display: <FontAwesomeIcon icon={faF} />, shiftDisplay: <FontAwesomeIcon icon={faF} />, code: 'KeyF', key: 'f' },
      { type: 'regular', display: <FontAwesomeIcon icon={faG} />, shiftDisplay: <FontAwesomeIcon icon={faG} />, code: 'KeyG', key: 'g' },
      { type: 'regular', display: <FontAwesomeIcon icon={faH} />, shiftDisplay: <FontAwesomeIcon icon={faH} />, code: 'KeyH', key: 'h' },
      { type: 'regular', display: <FontAwesomeIcon icon={faJ} />, shiftDisplay: <FontAwesomeIcon icon={faJ} />, code: 'KeyJ', key: 'j' },
      { type: 'regular', display: <FontAwesomeIcon icon={faK} />, shiftDisplay: <FontAwesomeIcon icon={faK} />, code: 'KeyK', key: 'k' },
      { type: 'regular', display: <FontAwesomeIcon icon={faL} />, shiftDisplay: <FontAwesomeIcon icon={faL} />, code: 'KeyL', key: 'l' },
      { type: 'regular', display: ';', shiftDisplay: ':', code: 'Semicolon', key: ';' },
      { type: 'regular', display: `'`, shiftDisplay: <FontAwesomeIcon icon={faQuoteRight} />, code: 'Quote', key: `'` },
      { type: 'long-84', display: 'ENTER', shiftDisplay: 'ENTER', code: 'Enter', key: 'Enter' }
    ]
  },
  {
    rowId: 3,
    location: 0,
    keys: [
      { type: 'long-84', display: <FontAwesomeIcon icon={faArrowUp} />, shiftDisplay: <FontAwesomeIcon icon={faArrowUp} />, code: 'ShiftLeft', key: 'Shift' },
      { type: 'regular', display: <FontAwesomeIcon icon={faZ} />, shiftDisplay: <FontAwesomeIcon icon={faZ} />, code: 'KeyZ', key: 'z' },
      { type: 'regular', display: <FontAwesomeIcon icon={faX} />, shiftDisplay: <FontAwesomeIcon icon={faX} />, code: 'KeyX', key: 'x' },
      { type: 'regular', display: <FontAwesomeIcon icon={faC} />, shiftDisplay: <FontAwesomeIcon icon={faC} />, code: 'KeyC', key: 'c' },
      { type: 'regular', display: <FontAwesomeIcon icon={faV} />, shiftDisplay: <FontAwesomeIcon icon={faV} />, code: 'KeyV', key: 'v' },
      { type: 'regular', display: <FontAwesomeIcon icon={faB} />, shiftDisplay: <FontAwesomeIcon icon={faB} />, code: 'KeyB', key: 'b' },
      { type: 'regular', display: <FontAwesomeIcon icon={faN} />, shiftDisplay: <FontAwesomeIcon icon={faN} />, code: 'KeyN', key: 'n' },
      { type: 'regular', display: <FontAwesomeIcon icon={faM} />, shiftDisplay: <FontAwesomeIcon icon={faM} />, code: 'KeyM', key: 'm' },
      { type: 'regular', display: ',', shiftDisplay: <FontAwesomeIcon icon={faChevronLeft} />, code: 'Comma', key: ',' },
      { type: 'regular', display: '.', shiftDisplay: <FontAwesomeIcon icon={faChevronRight} />, code: 'Period', key: '.' },
      { type: 'regular', display: '/', shiftDisplay: <FontAwesomeIcon icon={faQuestion} />, code: 'Slash', key: '/' },
      { type: 'long-104', display: <FontAwesomeIcon icon={faArrowUp} />, shiftDisplay: <FontAwesomeIcon icon={faArrowUp} />, code: 'ShiftRight', key: 'Shift' }
    ]
  },
  {
    rowId: 4,
    location: 0,
    keys: [
      { type: 'long-47', display: 'C', shiftDisplay: 'C', code: 'ControlLeft', key: 'Control' },
      {
        type: 'long-47',
        display: <FontAwesomeIcon icon={faWindows} />,
        shiftDisplay: <FontAwesomeIcon icon={faWindows} />,
        code: 'MetaLeft',
        key: 'Meta'
      },
      { type: 'long-47', display: 'A', shiftDisplay: 'A', code: 'AltLeft', key: 'Alt' },
      { type: 'long-238', display: 'SPACE', shiftDisplay: 'SPACE', code: 'Space', key: ' ' },
      { type: 'long-47', display: 'A', shiftDisplay: 'A', code: 'AltRight', key: 'Alt' },
      {
        type: 'long-47',
        display: <FontAwesomeIcon icon={faWindows} />,
        shiftDisplay: <FontAwesomeIcon icon={faWindows} />,
        code: 'MetaRight',
        key: 'Meta'
      },
      { type: 'long-47', display: 'M', shiftDisplay: 'M', code: 'ContextMenu', key: 'ContextMenu' },
      { type: 'long-47', display: 'C', shiftDisplay: 'C', code: 'ControlRight', key: 'Control' }
    ]
  }
]

export default typing
