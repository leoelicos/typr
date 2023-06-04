import { useCallback, useEffect, useState } from 'react'
import typing from '../data/typing'

const keys = typing.reduce((a, b) => a.concat(b.keys.map(({ code }) => ({ code, pressed: false }))), [])

export default function useKey() {
  const [pressed, setPressed] = useState(keys)

  const handleDown = useCallback((event) => {
    const { repeat, code } = event
    if (repeat) return

    if (code === 'Tab' || code === 'Control' || code === 'Alt' || code === 'Meta') return

    // console.log({ down: code })
    setPressed((prev) => prev.map((o) => (o.code === code ? { ...o, pressed: true } : o)))
  }, [])

  const handleUp = useCallback((event) => {
    const { repeat, code } = event
    if (repeat) return

    if (code === 'Tab' || code === 'Control' || code === 'Alt' || code === 'Meta') return

    // console.log({ up: code })
    setPressed((prev) => prev.map((o) => (o.code === code ? { ...o, pressed: false } : o)))
  }, [])

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
