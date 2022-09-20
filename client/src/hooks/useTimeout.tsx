import { useCallback, useEffect, useRef, useState } from "react";

const useTimeout = (callback: () => void, ms: number) => {    
    const callbackRef = useRef(callback);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const [ timeStarted, setTimeStarted ] = useState(Date.now())
    const [ remaining, setRemaining ] = useState(ms)

    useEffect(() => {
        callbackRef.current = callback
    }, [callback])

    const set = useCallback(():void => {
        timeoutRef.current = setTimeout(() => callbackRef.current(), ms)
    }, [ms])

    const clear = useCallback(():void => {
        timeoutRef.current && clearTimeout(timeoutRef.current)
    }, [])

    // useEffect(() => {
    //     console.log("In UseEffect! :)")
    //     start();
    //     return clear;
    // }, [ms, start, clear])

    const start = useCallback(() => {
        clear()
        set()
    }, [clear, set])

    const pause = useCallback(():void => {
        setRemaining(remaining - (Date.now() - timeStarted))
        clearTimeout(timeoutRef.current)
    }, [remaining, timeStarted])

    const resume = useCallback((increment?:number, max?:number):void => {        
        let newRemaining = (remaining > 0 ? remaining : 0) + (increment ?? 0)
        if (max && max < newRemaining) newRemaining = max
        setRemaining(newRemaining)
        setTimeStarted(Date.now())
        timeoutRef.current = setTimeout(() => callbackRef.current(), newRemaining)
    }, [remaining])

    return { clear, pause, resume, start }
}

export default useTimeout