import { useCallback, useEffect, useState } from 'react'

const keys = [
  { code: 'Tab', pressed: false },
  { code: 'KeyQ', pressed: false },
  { code: 'KeyW', pressed: false },
  { code: 'KeyE', pressed: false },
  { code: 'KeyR', pressed: false },
  { code: 'KeyT', pressed: false },
  { code: 'KeyY', pressed: false },
  { code: 'KeyU', pressed: false },
  { code: 'KeyI', pressed: false },
  { code: 'KeyO', pressed: false },
  { code: 'KeyP', pressed: false },
  { code: 'BracketLeft', pressed: false },
  { code: 'BracketRight', pressed: false },
  { code: 'Backslash', pressed: false },
  { code: 'CapsLock', pressed: false },
  { code: 'KeyA', pressed: false },
  { code: 'KeyS', pressed: false },
  { code: 'KeyD', pressed: false },
  { code: 'KeyF', pressed: false },
  { code: 'KeyG', pressed: false },
  { code: 'KeyH', pressed: false },
  { code: 'KeyJ', pressed: false },
  { code: 'KeyK', pressed: false },
  { code: 'KeyL', pressed: false },
  { code: 'Semicolon', pressed: false },
  { code: 'Quote', pressed: false },
  { code: 'Enter', pressed: false },
  { code: 'ShiftLeft', pressed: false },
  { code: 'KeyZ', pressed: false },
  { code: 'KeyX', pressed: false },
  { code: 'KeyC', pressed: false },
  { code: 'KeyV', pressed: false },
  { code: 'KeyB', pressed: false },
  { code: 'KeyN', pressed: false },
  { code: 'KeyM', pressed: false },
  { code: 'Comma', pressed: false },
  { code: 'Period', pressed: false },
  { code: 'Slash', pressed: false },
  { code: 'ShiftRight', pressed: false },
  { code: 'ControlLeft', pressed: false },
  { code: 'MetaLeft', pressed: false },
  { code: 'AltLeft', pressed: false },
  { code: 'Space', pressed: false },
  { code: 'AltRight', pressed: false },
  { code: 'MetaRight', pressed: false },
  { code: 'ContextMenu', pressed: false },
  { code: 'ControlRight', pressed: false }
]

export default function useKey() {
  const [pressed, setPressed] = useState(keys)

  const handleDown = useCallback(
    (event) => {
      const { repeat, code } = event
      if (repeat) return

      if (code === 'Tab' || code === 'Control' || code === 'Alt' || code == 'Meta') return

      console.log({ down: code })
      setPressed((prev) => prev.map((o) => (o.code === code ? { ...o, pressed: true } : o)))
    },
    [pressed]
  )

  const handleUp = useCallback(
    (event) => {
      const { repeat, code } = event
      if (repeat) return

      if (code === 'Tab' || code === 'Control' || code === 'Alt' || code == 'Meta') return

      console.log({ up: code })
      setPressed((prev) => prev.map((o) => (o.code === code ? { ...o, pressed: false } : o)))
    },
    [pressed]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleDown)
    return () => {
      window.removeEventListener('keydown', handleDown)
    }
  }, [handleDown])

  useEffect(() => {
    window.addEventListener('keyup', handleUp)
    return () => {
      window.removeEventListener('keyup', handleUp)
    }
  }, [handleUp])

  return { pressed }
}
