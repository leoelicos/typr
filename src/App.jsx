/* context */
import PressedProvider from './pressedContext/pressedContext'

/* style */
import './App.scss'

/* components */
import Game from './components/Game/Game.jsx'
import Train from './pages/Train/Train'
console.log(Game)
export default function App() {
  return (
    <PressedProvider>
      {/* <Game /> */}
      <Train />
    </PressedProvider>
  )
}
