import React, { useState } from 'react'
import AppBar from '../components/AppBar'
import Inpt from '../components/Inpt'
import { useFormik } from 'formik'

const NewNetworkPage = ({setShowTraining, setTraining, screen, setScreen }) => {

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

  const trainingFormik = useFormik({
    initialValues: {
      name: '',
      input_size: 950,
      training_percentage: 0.8,
      learning_rate: 0.1,
      epochs: 2,
      batch_size: 5,

    },
    validate: (values) => {
      const errors = {}
      if (!values.name) {
        errors.name = 'Requerido'
      }
      if (!values.input_size) {
        errors.input_size = 'Requerido'
      }
      if (!values.training_percentage) {
        errors.training_percentage = 'Requerido'
      }
      if (!values.learning_rate) {
        errors.learning_rate = 'Requerido'
      }
      if (!values.epochs) {
        errors.epochs = 'Requerido'
      }
      if (!values.batch_size) {
        errors.batch_size = 'Requerido'
      }

      return errors
    },
    onSubmit: async (values) => {
      try {
        setTraining(true)
        setShowTraining(true)
        const clases = classes.filter(c => c.checked).map(c => c.clase + 30)
        let response = await fetch('http://localhost:8000/api/train/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ clases: clases, ...values })
        })

        if (response.ok) {
          let data = await response.json()
          console.log(data)
        }

      } catch (e) {

      } finally {
        setTraining(false)
      }
    }
  })

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

      //setTraining(true)
      //setScreen('3')
      console.log(trainingFormik.values)

      return
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
      setTraining(false)
      setClasess(p => p.map(c => ({ ...c, checked: false })))
    }
  }

  const [loading, setLoading] = useState(false)


  return (
    <>
      <AppBar screen={screen} setScreen={setScreen} />
      <div className='flex flex-col flex-1'>

        <h2 className='px-8 pt-5 text-3xl font-bold'>Nueva Red Neuronal</h2>
        <p className='px-8 py-2 text-lg italic'>
          * Selecciona 2 clases que quieres diferenciar
        </p>
        <div className='flex justify-between h-full'>
          {/* Clasess and Examples */}
          <div className='flex flex-col w-1/2'>
            {/* Clases */}
            <div className='flex flex-wrap px-2'>
              {classes.map((clase, i) =>
                <div key={`C_${i}`} className={`relative group flex flex-row w-1/5 p-1 items-center `}>
                  <button
                    disabled={classes.filter(c => c.checked).length >= 2 && !clase.checked}
                    type="button"
                    onClick={() => handleChange(i)}
                    className={
                      `flex  flex-col w-full p-1 items-center justify-center rounded-lg px-5 border h-20
                            ${clase.checked ? 'bg-neutral-700  border-purple-400' : 'bg-neutral-800 border-transparent'} 
                            disabled:opacity-40
                            `}>
                    <p className='text-md'>
                      {`clase:`}
                    </p>
                    <p className='text-2xl'>
                      {`${clase.clase}`}
                    </p>
                  </button>
                  <div className={`opacity-0 absolute right-0  bottom-0 duration-200  group-hover:opacity-100 ${clase.visible ? 'opacity-100' : ''}`}>
                    <button
                      //disabled={classes.filter(c => c.checked).length >= 2 && !clase.checked}
                      type="button"
                      onClick={() => showExamples(i)}
                      className={
                        `flex p-1 items-center justify-around rounded-lg border 
                        ${clase.visible ? 'bg-neutral-700  border-purple-400' : 'bg-neutral-800'}
                              disabled:opacity-70
                              `}>
                      {clase.visible ? '</>' : '👁️'}
                    </button>
                  </div>
                </div>)}
            </div>
            {/* Ejemplos */}
            <div className=''>
              <div className='flex flex-wrap items-center p-5'>
                {classes.filter(c => c.visible).length > 0 &&
                  getUrls(classes.find(c => c.visible).clase).map((url, i) =>
                    <img key={`IMG_${i}`} src={url} />)
                }
              </div>
            </div>
          </div>

          {/* Detalles del Entrenamiento */}
          <form onSubmit={trainingFormik.handleSubmit} className='relative flex flex-col w-1/2 h-full'>

            <div className='relative w-full h-full overflow-y-scroll '>
              <div className='absolute flex flex-wrap'>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Nombre de la Red'}
                    name='name'
                  />
                </div>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Tamaño de la Entrada'}
                    name='input_size'
                    type='number'
                    max={1000}
                    min={0}
                  />
                </div>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Porcentaje para Entrenamiento'}
                    name='training_percentage'
                    type='number'
                    max={100}
                    min={0}
                  />
                </div>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Ratio de Aprendizaje'}
                    name='learning_rate'
                    type='number'
                    max={1}
                    min={0}
                  />
                </div>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Épocas'}
                    name='epochs'
                    type='number'
                    max={1000}
                    min={0}
                  />
                </div>
                <div className='flex-grow w-full px-12 '>
                  <Inpt
                    formik={trainingFormik}
                    label={'Ejemplos por Iteración'}
                    name='batch_size'
                    type='number'
                    max={1000}
                    min={0}
                  />
                </div>
              </div>
            </div>

            <div className='h-12 px-8'>
              {
                // Boton Entrenar
                classes.filter(c => c.checked).length >= 2 &&
                <input
                  type='submit'
                  value="Entrenar"
                  className='w-full h-12 px-10 duration-150 bg-purple-500 rounded-lg hover:shadow-purple-700 hover:shadow-md active:opacity-70 active:duration-0' />
              }
            </div>
          </form>


        </div>
      </div>
    </>
  )
}

export default NewNetworkPage