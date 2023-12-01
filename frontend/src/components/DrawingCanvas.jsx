import React, { useState, useRef, useEffect } from 'react';

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const DrawingCanvas = ({ handlePredict }) => {
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        context.lineCap = 'round';
        context.strokeStyle = 'white';
        context.lineWidth = 8;
        contextRef.current = context;
    }, []);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };

    const handleTestNetwork = async () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Find the drawing boundaries
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
        for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
                const alpha = imageData.data[(y * 4 * imageData.width) + (x * 4) + 3];
                if (alpha > 0) {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
        }

        // Create a new canvas
        const trimmedCanvas = document.createElement('canvas');
        trimmedCanvas.width = 28;
        trimmedCanvas.height = 28;
        const trimmedCtx = trimmedCanvas.getContext('2d');

        // Draw the trimmed and scaled image
        let difX = maxX - minX;
        let difY = maxY - minY;
        let midX = (minX + maxX) * 0.5;
        let midY = (minY + maxY) * 0.5;
        let maxSize = Math.max(difX, difY);
        trimmedCtx.drawImage(canvas, midX - maxSize * 0.5, midY - maxSize * 0.5, maxSize, maxSize, 0, 0, 28, 28);

        const scaledImageData = trimmedCtx.getImageData(0, 0, trimmedCanvas.width, trimmedCanvas.height);
        const pixels = scaledImageData.data
        let grayscaleArray = [];

        for (let i = 0; i < pixels.length; i += 4) {
            let grayscale = 0.3 * pixels[i] + 0.59 * pixels[i + 1] + 0.11 * pixels[i + 2];
            grayscaleArray.push(grayscale);
        }

        handlePredict(grayscaleArray);

    }


    return (
        <div>
            <canvas
                height={'224'}
                width={'224'}
                className='w-56 h-56 bg-black'
                onMouseDown={startDrawing}
                onMouseUp={finishDrawing}
                onMouseMove={draw}
                ref={canvasRef}
            />


            <div className='flex'>
                <button
                    onClick={clearCanvas}
                    className={`flex mx-1 p-1 items-center justify-around rounded-lg px-5 border w-full h-8 mt-2  active:border-purple-400 bg-neutral-800 border-transparent disabled:opacity-40`} >
                    Limpiar
                </button>
                <button
                    onClick={handleTestNetwork}
                    className={`flex mx-1 p-1 items-center justify-around rounded-lg px-5 border w-full h-8 mt-2  active:border-purple-400 bg-neutral-800 border-transparent disabled:opacity-40`} >
                    Probar
                </button>
            </div>

        </div>
    );
};

export default DrawingCanvas;