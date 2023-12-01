import { useState } from 'react'
import TestPage from './components/TestPage'
import NewNetworkPage from './pages/NewNetworkPage'
import TrainingPage from './pages/TrainingPage'

function App() {

  /**
   * 1: Nueva Red
   * 2: Probar
   * 3: Entrenando
   */
  const [screen, setScreen] = useState('1')
  const [showTraining, setShowTraining] = useState(false)
  const [training, setTraining] = useState(false)

  return (
    <div className='relative flex flex-col w-full h-screen'>
      {
        screen === '1' &&
        <NewNetworkPage
          screen={screen}
          setScreen={setScreen}
          setShowTraining={setShowTraining}
          setTraining={setTraining}
        />
      }
      {
        screen === '2' &&
        <TestPage
          screen={screen}
          setScreen={setScreen} />
      }
      {
        showTraining &&
        <TrainingPage
          training={training}
          setShowTraining={setShowTraining}
          screen={screen}
          setScreen={setScreen} />
      }

    </div>
  )
}

export default App
