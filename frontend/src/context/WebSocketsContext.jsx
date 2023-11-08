import { useState, useEffect, useRef, useCallback } from 'react';

function useWebSocket(url) {

    const [trainingProgress, setTrainingProgress] = useState(0)
    const [trainingData, setTrainingData] = useState([])

    const [status, setStatus] = useState('DISCONNECTED');
    const webSocket = useRef(null);

    const connect = useCallback(() => {
        setStatus('CONNECTING');
        webSocket.current = new WebSocket(url);

        webSocket.current.onopen = () => {
            setStatus('CONNECTED');
        };

        webSocket.current.onmessage = (message) => {
            let { details } = JSON.parse(message.data)
            setTrainingData(p => ([...p, details]))
            setTrainingProgress(details.progress)
            console.log(details)
            //setMessages( consumerMessage )
        };

        webSocket.current.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        webSocket.current.onclose = (event) => {
            setStatus(event.wasClean ? 'DISCONNECTED' : 'DISCONNECTED (unclean)');
            webSocket.current = null;

            // You might want to automatically reconnect here if the disconnection was unclean
            // Beware of infinite reconnection loops, though
        };
    }, [url]);

    useEffect(() => {
        connect();

        // Clean up function on unmount
        return () => {
            if (webSocket.current) {
                webSocket.current.close();
            }
        };
    }, [connect]);

    const sendMessage = (message) => {
        if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN) {
            webSocket.current.send(message);
        } else {
            console.error('WebSocket is not open. Message was not sent');
        }
    };

    return {
        trainingProgress, setTrainingProgress,
        trainingData, setTrainingData,
        status,
        sendMessage
    };
}

export default useWebSocket;