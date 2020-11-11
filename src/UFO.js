import React from 'react';

export const UFOComponent = (props) => {
    const list = [];
    // props.req.forEach(v => <li key={v}>{v + ": " + props.req[v]}</li>);
    for (const p in props.req) {
        list.push(<li key={p}>{p + ": " + props.req[p]}</li>);
    }
    const choose = () => {
        props.onClick(props.id)
    }
    return (
        <div className="ufo-card">
            <div className="image">
                <img src={"./cards/ufo-" + props.id + ".png"} alt="ufo-front"/>
                <img src={"./cards/ufo-" + props.id + "-back.png"} alt="ufo-front"/>
            </div>
            <button onClick={choose}>Choose</button>
        </div>
    )
};
