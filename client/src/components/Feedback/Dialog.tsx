import React, { useRef, FC } from "react";
import "../../assets/style/Dialog.css"

type Props = {
    options: {
        title?: string,
        message?: string,
        noCancel?: boolean,
        type?: 'info' | 'success' | 'delete' | 'warning',
        onOk?: () => void,
        onCancel?: () => void,
        okText?: string,
        cancelText?: string
    }
}

const ConfirmDialog: FC<Props> = ({options}) => {
    const ref = useRef<any>(null);
    
    if (!options || Object.keys(options).length === 0) return <></>;

    return <div className="shadowOverlay" onClick={() => {
        ref?.current?.focus && ref.current.focus();
    }}>
        <div className="dialogContainer">
            <h1>{options?.title ?? ''}</h1>
            <div className="dialogMessage">
                <p>{options?.message}</p>
            </div>
            <hr />
            <div className="dialogButtons">
                <button onClick={options.onOk} autoFocus ref={ref}
                    className={options.type}
                >{options.okText ?? "Ok"}</button>
                {options.noCancel ||
                    <button onClick={options.onCancel}>
                        {options.cancelText ?? "Cancel"}
                    </button>
                }
            </div>
        </div>
    </div>
}

export default ConfirmDialog