import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from 'react'
import { newSeed } from './random.ts'
import { createSession, sessionReducer, type SessionState, type TestConfig } from './session.ts'
import type { Settings } from './settings.ts'

type Subscribe = (onChange: () => void) => () => void
const mediaSubscribers = new Map<string, Subscribe>()

function subscribeMedia(query: string): Subscribe {
  let subscribe = mediaSubscribers.get(query)
  if (!subscribe) {
    subscribe = (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }
    mediaSubscribers.set(query, subscribe)
  }
  return subscribe
}

/** Live media-query match, SSR/test safe. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    subscribeMedia(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export function useSystemReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}

export function useSystemDark(): boolean {
  return useMediaQuery('(prefers-color-scheme: dark)')
}

export interface Appearance {
  theme: 'light' | 'dark'
  reducedMotion: boolean
}

/** Resolves settings + OS preferences and mirrors them onto <html> for CSS. */
export function useAppearance(settings: Settings): Appearance {
  const systemDark = useSystemDark()
  const systemReduced = useSystemReducedMotion()
  const theme = settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme
  const reducedMotion = settings.motion === 'system' ? systemReduced : settings.motion === 'reduce'

  useEffect(() => {
    const root = document.documentElement
    root.dataset['theme'] = theme
    root.dataset['accent'] = settings.accent
    root.dataset['motion'] = reducedMotion ? 'reduce' : 'full'
    root.dataset['textSize'] = settings.textSize
    root.style.colorScheme = theme
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = theme === 'dark' ? '#0b0d12' : '#f7f6f2'
  }, [theme, reducedMotion, settings.accent, settings.textSize])

  return { theme, reducedMotion }
}

/** Smoothly animates a number towards `target` (instant with reduced motion). */
export function useCountUp(target: number, reduced: boolean, duration = 900): number {
  const [value, setValue] = useState(reduced ? target : 0)
  const valueRef = useRef(value)
  useEffect(() => {
    if (reduced) return
    const from = valueRef.current
    const t0 = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration)
      const eased = 1 - Math.pow(1 - t, 4)
      const v = from + (target - from) * eased
      valueRef.current = v
      setValue(v)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, reduced])
  return reduced ? target : value
}

export interface PressedKeys {
  pressed: ReadonlySet<string>
  capsLock: boolean
}

/** Tracks physical keys held down (by KeyboardEvent.code) for the on-screen keyboard. */
export function usePressedKeys(): PressedKeys {
  const [state, setState] = useState<PressedKeys>({ pressed: new Set(), capsLock: false })

  useEffect(() => {
    const update = (e: KeyboardEvent, down: boolean) => {
      const caps = e.getModifierState?.('CapsLock') ?? false
      setState((prev) => {
        const has = prev.pressed.has(e.code)
        if (has === down && prev.capsLock === caps) return prev
        const pressed = new Set(prev.pressed)
        if (down) pressed.add(e.code)
        else pressed.delete(e.code)
        // Some OSes swallow the keyup of the other Shift; release both together.
        if (!down && e.key === 'Shift') {
          pressed.delete('ShiftLeft')
          pressed.delete('ShiftRight')
        }
        return { pressed, capsLock: caps }
      })
    }
    const onDown = (e: KeyboardEvent) => update(e, true)
    const onUp = (e: KeyboardEvent) => update(e, false)
    // Releasing keys while the window is unfocused never fires keyup: reset.
    const clear = () => setState((prev) => ({ ...prev, pressed: new Set() }))
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') clear()
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    window.addEventListener('blur', clear)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('blur', clear)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return state
}

export interface TypingSession {
  state: SessionState
  /** performance.now() of the latest tick, for live stats. */
  now: number
  input: (value: string) => void
  restart: (opts?: { sameText?: boolean }) => void
}

const TICK_MS = 100

/** Owns one typing test: text, keystrokes, timer and per-second samples. */
export function useTypingSession(config: TestConfig): TypingSession {
  const [state, dispatch] = useReducer(sessionReducer, config, (c) => createSession(c, newSeed()))
  const [now, setNow] = useState(0)

  // A new configuration means a fresh test.
  const configRef = useRef(config)
  useEffect(() => {
    if (configRef.current === config) return
    configRef.current = config
    dispatch({ type: 'reset', seed: newSeed(), config })
  }, [config])

  useEffect(() => {
    if (state.phase !== 'running') return
    const id = window.setInterval(() => {
      const t = performance.now()
      setNow(t)
      dispatch({ type: 'tick', now: t })
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [state.phase])

  return {
    state,
    now,
    input: (value) => {
      const t = performance.now()
      setNow(t)
      dispatch({ type: 'input', value, now: t })
    },
    restart: ({ sameText = false } = {}) =>
      dispatch({ type: 'reset', seed: sameText ? state.seed : newSeed() }),
  }
}

/** Cursor spotlight for any [data-spot] card (pointer devices only). */
export function useSpotlight(): void {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>('[data-spot]')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - r.left}px`)
      el.style.setProperty('--my', `${e.clientY - r.top}px`)
    }
    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])
}
