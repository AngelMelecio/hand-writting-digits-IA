import React, { useEffect, useState } from 'react'
const Inpt = ({ label, name, formik, max=1e9, min=0, ...props }) => {

    const [isFocus, setIsFocus] = useState(false)
    const [hasValue, setHasValue] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setError(formik?.errors[name] && formik?.touched[name])
        setHasValue(formik?.values[name])
    }, [formik])

    const handleFocus = (e) => {
        setIsFocus(true)
    }
    const handleBlur = (e) => {
        setIsFocus(false)
        if (e.target.value) {
            setHasValue(true);
        } else {
            setHasValue(false);
        }
    }

    const handleChange = (e) => {
        if( props.type === 'number' ){
            e.target.value = Math.min(e.target.value, max)
            e.target.value = Math.max(e.target.value, min)
        }
        formik?.handleChange(e)
    }
    return (
        <div >
            <div className="relative">
                <label htmlFor={name}
                    className={` px-1 pointer-events-none left-2
                            ${error ? 'text-rose-400' : isFocus && !props.readOnly ? 'text-purple-300' : 'text-gray-300'} -top-2
                             transition-all duration-200 `}>{label}</label>
                <input
                    id={name}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    value={formik?.values[name] || ""}
                    onBlur={(e) => { handleBlur(e); formik?.handleBlur(e) }}
                    className={`w-full px-4 py-2 text-base text-white border rounded-lg outline-none  duration-200 font-medium ${error ? 'border-rose-400' : isFocus && !props.readOnly ? 'border-purple-300' : 'border-gray-600 hover:border-purple-300'}`}
                    {...props} />
            </div>
            <div className={`flex pl-1 text-sm h-9 text-rose-400 ${error ? 'opacity-100' : 'opacity-0'} duration-200`}>
                {error && <>{formik.errors[name]}</>}
            </div>
        </div>
    )
}

export default Inpt