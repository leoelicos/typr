import { ALL_KEYS, KEYBOARD_ROWS, keyForChar } from './keyboard.ts'

describe('keyboard layout', () => {
  it('every row is exactly 15 key units wide', () => {
    for (const row of KEYBOARD_ROWS) {
      expect(row.reduce((sum, k) => sum + k.width, 0)).toBeCloseTo(15)
    }
  })

  it('has unique key codes and homing bumps on F and J', () => {
    const codes = ALL_KEYS.map((k) => k.code)
    expect(new Set(codes).size).toBe(codes.length)
    expect(ALL_KEYS.filter((k) => k.homing).map((k) => k.code)).toEqual(['KeyF', 'KeyJ'])
  })

  it('maps characters to keys, using the opposite-hand Shift', () => {
    expect(keyForChar('a')).toEqual({ code: 'KeyA', shift: false })
    expect(keyForChar('A')).toEqual({ code: 'KeyA', shift: true, shiftCode: 'ShiftRight' })
    expect(keyForChar('P')).toEqual({ code: 'KeyP', shift: true, shiftCode: 'ShiftLeft' })
    expect(keyForChar('?')).toEqual({ code: 'Slash', shift: true, shiftCode: 'ShiftLeft' })
    expect(keyForChar(' ')).toEqual({ code: 'Space', shift: false })
    expect(keyForChar('é')).toBeUndefined()
  })
})
