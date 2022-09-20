import { useState } from "react";

const useToggle = (initialValue: boolean) => {
    const [ value, setValue ] = useState(initialValue);

    const toggleValue = (force?:boolean) => {
        setValue(currentValue => (force ?? !currentValue));
    } 
    return [value, toggleValue] as const
}

export default useToggle