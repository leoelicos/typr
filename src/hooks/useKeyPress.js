import { useCallback, useEffect, useState } from 'react'

export default function useKeyPress() {
  const [lastKeyPress, setLastKeyPress] = useState(undefined)

  const printEventInfo = ({ code, key, location, repeat, shiftKey, timeStamp }) => {
    const modifiers = []
    if (shiftKey) modifiers.push('shift')
    console.log(code, key, repeat, modifiers.join(' '), timeStamp, location)
  }

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === lastKeyPress) return
      printEventInfo(e)
      setLastKeyPress(e.key)
    },
    [lastKeyPress]
  )

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress)
    return () => {
      window.removeEventListener('keypress', handleKeyPress)
    }
  }, [handleKeyPress])

  return { lastKeyPress, setLastKeyPress }
}
