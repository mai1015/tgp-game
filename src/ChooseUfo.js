import React from 'react';
import {UFO} from './data';
import {UFOComponent} from "./UFO";

export const ChooseUFOComponent = (props) => {
    return (
        <div id="ufos">
            {UFO.map((v,i) => <UFOComponent {...v} key={i} onClick={props.onClick} />)}
        </div>
    )
};
