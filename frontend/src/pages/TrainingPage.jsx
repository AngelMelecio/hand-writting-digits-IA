import React, { useState } from 'react'
import useWebSocket from '../context/WebSocketsContext'
import Loader from '../components/Loader'

const TrainingPage = ({ setShowTraining, training, setScreen }) => {

    const {
        trainingData, setTrainingData,
        trainingProgress, setTrainingProgress,
    } = useWebSocket('ws://localhost:8000/ws/back_prop/')

    const handleFinishTraining = async () => {
        setScreen('2')
        setShowTraining(false)
        setTrainingData([])
        setTrainingProgress(0)
    }

    return (
        <div style={{ backgroundColor: '#1a1a1a', }}
            className='absolute w-full h-full'>
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
            {
                // Boton Finalizar
                !training &&
                <button
                    onClick={handleFinishTraining}
                    className='absolute h-12 px-10 duration-150 bg-purple-500 rounded-lg hover:shadow-purple-700 hover:shadow-md active:opacity-70 active:duration-0 right-4 bottom-2'>
                    Finalizar
                </button>
            }
        </div>
    )
}

export default TrainingPage