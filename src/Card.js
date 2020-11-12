import React from 'react';

export const CardComponent = (props) => {
    // console.log(props);
    return (
        <div onClick={() => props.onClick(props.key)} className={props.selected ? "selected card" : "card"}>
            {props.modify ? <p>Amount: <span>{props.value}</span></p> : null}
            <img src={"/cards/" + ((props.type === "MAT" ? (props.name.toLowerCase() + "-") : "ant-") + props.rarity.toLowerCase())  + ".png"} alt=""/>
        </div>
    )
};
