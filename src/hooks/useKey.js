import { useCallback, useEffect } from 'react'

export default function useKey(dispatch) {
  const handleDown = useCallback(
    (event) => {
      const { repeat, code, key } = event
      if (repeat) return

      if (key === 'Tab' || key === 'Control' || key === 'Alt' || key === 'Meta') return

      if (key === 'CapsLock') dispatch({ type: 'toggleCaps' })
      else dispatch({ type: 'setPressed', action: { code, isPressed: true } })
    },
    [dispatch]
  )

  const handleUp = useCallback(
    (event) => {
      const { repeat, code, key } = event
      if (repeat) return

      if (key === 'CapsLock') return

      if (key === 'Tab' || key === 'Control' || key === 'Alt' || key === 'Meta') return
      else dispatch({ type: 'setPressed', action: { code, isPressed: false } })
    },
    [dispatch]
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
}
