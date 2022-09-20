import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/style/skrallgaming/navbar.css"

export default function Navbar(){
    return <>
        <nav>
            <ul>
                <li>
                    <label>
                        <input type="checkbox" name=""/>
                            <div className="icon-box">
                            <i className="fa fa-bar-chart" aria-hidden="true">
                                <Link to="/skrallgaming/ratings">Ratings</Link>
                            </i>
                            </div>
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" name="" />
                        <div className="icon-box">
                            <i className="fa fa-calculator" aria-hidden="true">
                                <Link to="/skrallgaming/calculator" >Calculator</Link>
                            </i>
                        </div>
                    </label>
                </li>
                <li>
                    <label>
                        <input type="checkbox" name="" />
                        <div className="icon-box">
                            <i className="fa fa-calculator" aria-hidden="true">
                                <Link to="/skrallgaming/CreateThornament" >Create Thornament</Link>
                            </i>
                        </div>
                    </label>
                </li>                        
            </ul>
        </nav>
    </>
}