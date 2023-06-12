/* react */
import { useContext, useMemo } from 'react'

/* context */
import PressedProvider from './pressedContext/pressedContext'

/* style */
import './App.scss'

/* components */
import Game from './components/Game/Game.jsx'

export default function App() {
  return (
    <PressedProvider>
      <Game />
    </PressedProvider>
  )
}
