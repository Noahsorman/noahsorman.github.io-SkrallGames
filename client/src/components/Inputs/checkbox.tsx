import React, { useState, FC } from "react";
import "../../assets/style/Checkbox.css"

type Props = {
    checked: boolean
}

const Checkbox: FC<Props> = ({checked}) => {
    return <>
        <label>
            <input type="checkbox"/>
                <div className="icon-box checkbox">
                    <i className="fa fa-bar-chart" aria-hidden="true">
                    </i>
                </div>
        </label>
    </>    
}

export default Checkbox