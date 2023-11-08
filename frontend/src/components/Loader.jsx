import React from 'react'

const Loader = ({ progress }) => {
    return (
        <div className='flex p-5 text-xl'>
            <p className=''>
                Progreso:  {progress}%
            </p>
        </div>
    )
}

export default Loader