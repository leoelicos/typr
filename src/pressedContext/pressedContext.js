import { createContext, useReducer } from 'react'
import typing from '../data/typing'

export const PressedContext = createContext(false)
export const PressedDispatchContext = createContext(null)

export default function PressedProvider({ children }) {
  /* library created from the typing data array */
  const initialState = typing.reduce((a, b) => {
    b.keys.forEach(({ code }) => {
      a[code] = false
    })
    return a
  }, {})

  const [state, dispatch] = useReducer(PressedReducer, initialState)

  return (
    <PressedContext.Provider value={state}>
      <PressedDispatchContext.Provider value={dispatch}>{children}</PressedDispatchContext.Provider>
    </PressedContext.Provider>
  )
}

function PressedReducer(state, { type, action }) {
  switch (type) {
    case 'setPressed': {
      const { code, isPressed } = action
      return { ...state, [code]: isPressed }
    }
    default: {
      return new Error('Action not found')
    }
  }
}
