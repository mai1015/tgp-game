import React, {useState} from 'react';
import {CatCardComponent} from "./CatCard";
import {UFOComponent} from "./UFO";
import {CardComponent} from "./Card";

export const CatBoard = (props) => {
    const [tg, setTg] = useState(-1);
    const [current, setCurrent] = useState(-1);
    const playCard = () => {
        props.moves.playApp(current, tg);
        setCurrent(-1);
    }
    const canUse = () => {
        let i = 0;
        if (props.G.completed['0'] !== -1 ) i++;
        if (props.G.completed['1'] !== -1 ) i++;
        if (props.G.completed['2'] !== -1 ) i++;
        return i >= 2;
    }
    const dropCard = () => {
        if (current === -1) {
            alert("pls select a card");
        } else {
            props.moves.replaceCard(current);
        }
    }
    // console.log(props);
    return (
        <div className="board">
            <p>{props.playerID}</p>
            <p>{props.isActive ? "your turn" : "wait"}</p>

            <div className="cards">
                {props.G.hand[props.playerID] ?
                    props.G.hand[props.playerID].map((v,i) => <CatCardComponent {...v} onClick={() => {
                        setCurrent(i);
                    }} key={i} selected={i === current} />) :
                    null}
            </div>
            <div className="action">
                <button onClick={()=>props.moves.playMaster()} disabled={!canUse() || props.G.completed[props.playerID] || !props.isActive}>Use Master</button>
                <select id="player" onChange={(e) => setTg(e.target.value)}>
                    <option value="-1">Select Player</option>
                    <option value="0">P1</option>
                    <option value="1">P2</option>
                    <option value="2">P3</option>
                </select>
                <button onClick={playCard} disabled={!props.isActive || current === -1 || tg === -1 || props.G.draws[props.playerID]}>Play Card</button>
                <button onClick={dropCard} disabled={!props.isActive}>Replace Card</button>
                <button onClick={()=>props.events.endTurn()} disabled={!props.isActive}>End Turn</button>
            </div>
        </div>
    );
}
