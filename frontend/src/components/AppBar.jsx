import React from 'react'

const AppBar = ({ screen, setScreen }) => {

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
        <div>
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
        </div>
    )

}

export default AppBar