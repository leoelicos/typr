import { useCallback, useEffect, useState } from 'react'

export default function useKeyPress() {
  const [lastKeyPress, setLastKeyPress] = useState(undefined)

  const printEventInfo = ({ altKey, code, ctrlKey, key, location, metaKey, repeat, shiftKey, timeStamp }) => {
    const modifiers = { altKey, ctrlKey, metaKey, shiftKey }
    console.log({ code, key, repeat, modifiers, timeStamp, location })
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
