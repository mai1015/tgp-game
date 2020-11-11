import React from 'react';

export const CatCardComponent = (props) => {
    // console.log(props);
    return (
        <div onClick={() => props.onClick(props.key)} className={props.selected ? "selected" : ""}>
            <img src={"/cards/app-" + props.id  + ".png"} alt="png"/>
        </div>
    )
};
