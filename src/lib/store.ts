import { useSyncExternalStore } from 'react'

export interface PersistentStore<T> {
  get: () => T
  set: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: () => void) => () => void
}

function safeRead(key: string): unknown {
  try {
    const raw = globalThis.localStorage?.getItem(key)
    return raw === null || raw === undefined ? undefined : (JSON.parse(raw) as unknown)
  } catch {
    return undefined
  }
}

function safeWrite(key: string, value: unknown): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value))
  } catch {
    // Private mode / quota exceeded: keep working in memory.
  }
}

/**
 * A tiny localStorage-backed store for useSyncExternalStore. Values are sanitised
 * on read (storage is user-editable) and synced across tabs via the storage event.
 */
export function createPersistentStore<T>(
  key: string,
  sanitize: (raw: unknown) => T,
): PersistentStore<T> {
  let value = sanitize(safeRead(key))
  const listeners = new Set<() => void>()
  const emit = () => listeners.forEach((l) => l())

  const store: PersistentStore<T> = {
    get: () => value,
    set: (next) => {
      value = typeof next === 'function' ? (next as (prev: T) => T)(value) : next
      safeWrite(key, value)
      emit()
    },
    subscribe: (listener) => {
      listeners.add(listener)
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return
        value = sanitize(safeRead(key))
        emit()
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(listener)
        window.removeEventListener('storage', onStorage)
      }
    },
  }
  return store
}

/** Subscribe a component to a persistent store. */
export function useStore<T>(store: PersistentStore<T>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get)
}

export function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function oneOf<T extends string>(v: unknown, options: readonly T[], fallback: T): T {
  return typeof v === 'string' && (options as readonly string[]).includes(v) ? (v as T) : fallback
}

export function bool(v: unknown, fallback: boolean): boolean {
  return typeof v === 'boolean' ? v : fallback
}

export function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}
