import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function Podium(){
    const loc = useLocation();

    const [podium, setPodium] = useState()

    useEffect(() => {
        
    })

    return <><div><div><div><div>{
        podium.map(team => {
            
        })
    }</div></div></div></div></>
}