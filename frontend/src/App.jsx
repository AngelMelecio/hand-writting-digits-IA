import { useState } from 'react'
import useWebSocket from './context/WebSocketsContext'
import Loader from './components/Loader'

function App() {

  const { 
    trainingData, setTrainingData,
    trainingProgress, setTrainingProgress,
  } = useWebSocket('ws://localhost:8000/ws/back_prop/')

  const [screen, setScreen] = useState('1')

  const [training, setTraining] = useState(false)
  const [trainingFinished, setTrainingFinished] = useState(false)

  const [classes, setClasess] = useState([
    { clase: 0, visible: false, checked: false },
    { clase: 1, visible: false, checked: false },
    { clase: 2, visible: false, checked: false },
    { clase: 3, visible: false, checked: false },
    { clase: 4, visible: false, checked: false },
    { clase: 5, visible: false, checked: false },
    { clase: 6, visible: false, checked: false },
    { clase: 7, visible: false, checked: false },
    { clase: 8, visible: false, checked: false },
    { clase: 9, visible: false, checked: false },
  ])

  const handleChange = i => {
    setClasess(p => p.map((c, j) =>
      j === i ? { ...c, checked: !c.checked } : c
    )
    )
  }

  const showExamples = i => {
    setClasess(p => p.map((c, j) =>
      j === i ? { ...c, visible: !c.visible } : { ...c, visible: false }
    )
    )
  }

  function getUrls(clase) {
    clase = Number(clase) + 30
    const urls = []
    for (let i = 1; i <= 100; i++) {
      let ceros = "00000"
      let num = i
      while (num) {
        ceros = ceros.slice(0, -1)
        num = Math.floor(num / 10)
      }
      urls.push(`examples/${clase}/${clase}_${ceros}${i}.png`)
    }
    return urls
  }

  const handleTrain = async () => {
    const clases = classes.filter(c => c.checked).map(c => c.clase + 30)
    try {
      setTraining(true)
      let response = await fetch('http://localhost:8000/api/train/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ clases })
      })

      if (response.ok) {
        let data = await response.json()
        console.log(data)
      }

    } catch (e) {
      console.log(e)
    } finally {
      setClasess(p => p.map(c => ({ ...c, checked: false })))
      setTrainingFinished(true)
    }
  }

  const handleFinishTraining = async () => {
    
    setTrainingFinished(false); 
    setTraining(false)
    setTrainingData([])
    setTrainingProgress(0)
  }

  const Tab = ({ title, value }) => {
    return (
      <button
        onClick={() => setScreen(value)}
        className={`p-5 border-b border-transparent font-bold ${value === screen ? 'border-b-purple-400' : 'text-gray-400'}`}>
        {title}
      </button>
    )
  }

  return (
    <div className='relative flex flex-col'>
      {
        !training ?
          <>
            <h1 className='px-4 pt-4'>Clasificador de clases</h1>
            {/* Tabs */}
            <div className='flex border-b border-neutral-700'>
              <Tab
                title='Entrenar'
                value='1'
              />
              <Tab
                title='Probar'
                value='2'
              />
            </div>
            {
              screen === '1' ?
                <>
                  <p className='p-3 text-lg'>
                    Selecciona 2 clases que quieres diferenciar
                  </p>
                  <div className='flex justify-between'>

                    {/* Clases */}
                    <div className='w-1/2'>
                      {classes.map((clase, i) =>
                        <div key={`C_${i}`} className={`group flex flex-row p-1 items-center `}>
                          <button
                            disabled={classes.filter(c => c.checked).length >= 2 && !clase.checked}
                            type="button"
                            onClick={() => handleChange(i)}
                            className={
                              `flex p-1 items-center justify-around rounded-lg px-5 border 
                            ${clase.checked ? 'bg-neutral-700  border-purple-400' : 'bg-neutral-800 border-transparent'} 
                            disabled:opacity-40
                            `}>
                            <div>
                              {`clase: ${clase.clase}`}
                            </div>
                          </button>
                          <div className={`opacity-0 duration-200  group-hover:opacity-100 ${clase.visible ? 'opacity-100' : ''}`}>
                            <button
                              //disabled={classes.filter(c => c.checked).length >= 2 && !clase.checked}
                              type="button"
                              onClick={() => showExamples(i)}
                              className={
                                `flex p-1 items-center justify-around rounded-lg px-5 ml-2 
                              ${clase.visible ? 'bg-neutral-700' : 'bg-neutral-800'} 
                              disabled:opacity-70
                              `}>
                              {clase.visible ? 'Ocultar ejemplos' : 'Mostrar ejemplos'}
                            </button>
                          </div>
                        </div>)}
                    </div>
                    {/* Ejemplos */}
                    <div className='w-1/2 '>
                      <div className='flex flex-wrap items-center'>
                        {classes.filter(c => c.visible).length > 0 &&
                          getUrls(classes.find(c => c.visible).clase).map((url, i) =>
                            <img key={`IMG_${i}`} src={url} />)
                        }
                      </div>
                    </div>
                  </div>
                </>
                :
                <>

                </>
            }
          </>
          :
          // Entrenando
          <>
            <div className='flex flex-col items-center justify-center h-screen'>
              <h1 className='p-5'>Entrenando</h1>
              <div className='flex flex-col items-center justify-center w-full h-full'>

                <Loader progress={trainingProgress} />
                <div className='relative flex justify-center w-1/2 h-full overflow-y-scroll'>
                  <div className='absolute w-full'>

                    <table>
                      <thead>
                        <tr>
                          <th>Epochs</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          trainingData.map((d, i) =>
                            <tr key={`R_${i}`}>
                              <td>{d.epoch}</td>
                              <td>{d.error}</td>
                            </tr>
                          )
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
      }

      {
        // Boton Entrenar
        !training &&
        classes.filter(c => c.checked).length >= 2 &&
        <button
          onClick={handleTrain}
          className='absolute h-12 px-10 duration-150 bg-purple-500 rounded-lg hover:shadow-purple-700 hover:shadow-md active:opacity-70 active:duration-0 right-4 bottom-2'>
          Entrenar
        </button>
      }
      {
        // Boton Finalizar
        trainingFinished &&
        <button
          onClick={handleFinishTraining}
          className='absolute h-12 px-10 duration-150 bg-purple-500 rounded-lg hover:shadow-purple-700 hover:shadow-md active:opacity-70 active:duration-0 right-4 bottom-2'>
          Finalizar
        </button>
      }
    </div>
  )
}

export default App
