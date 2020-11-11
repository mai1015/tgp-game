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

    }
    // console.log(props);
    return (
        <div>
            <p>{props.playerID}</p>
            <p>{props.isActive ? "your turn" : "wait"}</p>

            <p>Junk Card: {props.G.matCard.length} left</p>
            <p>Ant Card: {props.G.antCard.length} left</p>
            <p>App Card: {props.G.appCard.length} left</p>
            {/*<p>card list:</p>*/}
            {/*<ul>*/}
            {/*    {props.G.hand.map((v,i) => <li>{i} has {v.length} cards</li>)}*/}
            {/*</ul>*/}
            {/*<p>ant list:</p>*/}
            {/*<ul>*/}
            {/*    {props.G.antHand.map((v,i) => <li>{i} has {v.length} cards</li>)}*/}
            {/*</ul>*/}
            <p><b>ufo list:</b></p>
            <ul>
                {props.G.ufo.map((v, i) => v !== 0 ? <li>{props.G.completed[i] !== -1 ? <img src={"./cards/ufo-" + v + ".png"} alt="ufo"/> : <img src={"./cards/ufo-" + v + "-back.png"} alt="ufo"/>}</li> : null)}
            </ul>
            <p><b>other player's card</b></p>
            <div className="otherplayer">
                {props.G.hand.map((v, i) => i !== 3 ?
                    (<>
                        <p>player: {i}</p>
                        {v.length > 0 ?
                            <div className="cards">{v.map((c) => <CardComponent {...c} />)}</div> : "no card yet"
                        }
                    </>) : null
                )}
            </div>
            <p><b>ant card list:</b></p>
            <div className="otherplayer">
                {props.G.antHand.map((v, i) => i !== 3 ?
                    (<>
                        <p>player: {i}</p>
                        {v.length > 0 ?
                            <div className="cards">{v.map((c) => <CardComponent {...c} />)}</div> : "no card yet"
                        }
                    </>) : null
                )}
            </div>

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
                <button onClick={()=>props.events.endTurn()} disabled={!props.isActive}>End Turn</button>
            </div>
        </div>
    );
}
