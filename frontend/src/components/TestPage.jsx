import React, { useEffect, useState } from 'react'
import DrawingCanvas from './DrawingCanvas'
import AppBar from './AppBar'

const TestPage = ({ screen, setScreen }) => {


    const [loading, setLoading] = useState(false)
    const [prediction, setPrediction] = useState('')
    const [trainings, setTrainings] = useState([])
    const [selectedTraining, setSelectedTraining] = useState(null)

    const loadTrainings = async () => {
        const response = await fetch('http://localhost:8000/api/trainings/')
        const data = await response.json()
        setTrainings(data)
        console.log(data)
    }

    useEffect(() => {
        loadTrainings()
    }, [])

    const handleTrainingChange = (e) => {
        const selectedId = e.target.value
        const selectedTraining = trainings.find(t => t.idBackPropagation === Number(selectedId))
        console.log('selectedTraining', selectedTraining)
        setSelectedTraining(selectedTraining)
    }

    const handlePredict = async (inputs) => {
        try {
            setLoading(true)
            const response = await fetch('http://localhost:8000/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    networkId: selectedTraining.idBackPropagation,
                    inputs: inputs
                })
            });
            const data = await response.json();
            console.log(data)
            setPrediction(data.prediction)
        } catch (err) {
            console.log('error: ', err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <AppBar screen={screen} setScreen={setScreen} />
            <div className='flex flex-col flex-1'>
                <h2 className='px-8 pt-5 text-3xl font-bold'>Probar una Red Neuronal</h2>
                <p className='px-8 py-2 text-lg italic'>
                    * Selecciona una red que quieras probar
                </p>
                <div className='flex h-full'>
                    <div className='flex flex-col w-full px-8 pt-2'>
                        <select
                            id="selectTraining"
                            className='w-56 h-10 px-2 rounded-md'
                            onChange={handleTrainingChange}>
                            <option value={null}> -- </option>
                            {trainings.map(t => (
                                <option key={t.idBackPropagation} value={t.idBackPropagation}>
                                    {t.classA} - {t.classB}
                                </option>
                            ))}
                        </select>
                        <div className='flex flex-col w-full h-full pt-5'>
                            {selectedTraining && (
                                <div className='flex flex-col'>
                                    <h3 className='pb-2 text-xl font-bold'>Datos del Entrenamiento</h3>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Nombre de la red:</p>
                                        <p className='text-xl'>{selectedTraining.name}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Fecha de Creacion:</p>
                                        <p className='text-xl'>{new Date(selectedTraining.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Clase A:</p>
                                        <p className='text-xl'>{selectedTraining.classA}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Clase B:</p>
                                        <p className='text-xl'>{selectedTraining.classB}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Tamaño de la entrada</p>
                                        <p className='text-xl'>{selectedTraining.input_size}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Porcentaje para entrenamiento</p>
                                        <p className='text-xl'>{(selectedTraining.training_percentage * 100)}%</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Porcentaje para pruebas</p>
                                        <p className='text-xl'>{Math.round((1 - selectedTraining.training_percentage) * 100)}%</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Ratio de aprendizaje:</p>
                                        <p className='text-xl'>{selectedTraining.learning_rate}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Épocas:</p>
                                        <p className='text-xl'>{selectedTraining.epochs}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Ejemplos por iteracion:</p>
                                        <p className='text-xl'>{selectedTraining.batch_size}</p>
                                    </div>
                                    <div className='flex justify-between'>
                                        <p className='text-lg'>Precisión:</p>
                                        <p className='text-xl'>{(selectedTraining.accuracy * 100).toFixed(4)}%</p>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col items-center justify-center w-full h-full'>
                        <DrawingCanvas
                            handlePredict={handlePredict}
                        />
                        <div className='flex items-center h-10'>
                            { !loading ? (
                                <>
                                    <p className='px-2 text-lg'>
                                        predicción:
                                    </p>
                                    <p className='text-[2rem] font-bold'>
                                        {prediction}
                                    </p>
                                </>

                            ) : (
                                <p className='px-2 text-lg'>
                                    prediciendo...
                                </p>
                            )
                            }
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default TestPage
