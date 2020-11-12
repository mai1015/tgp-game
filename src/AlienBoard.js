import React, {useState} from 'react';
import {CardComponent} from "./Card";
import {ChooseUFOComponent} from "./ChooseUfo";

export const AlienBoard = (props) => {
    const [tg, setTg] = useState(-1);
    const [current, setCurrent] = useState(-1);
    const isTrading = () => {
        return props.ctx.activePlayers && props.ctx.activePlayers[props.playerID] && props.ctx.activePlayers[props.playerID] === 'trade';
    }
    const tradeBack = () => {
        if (current === -1) {
            alert("pls select a card");
        } else {
            props.moves.choose(current);
        }
    };
    const trade = () => {
        if (current === -1) {
            alert("pls select a card");
        } else if (tg === -1) {
            alert("pls select a player");
        } else {
            props.moves.trade(tg, current)
        }
    }
    // console.log(props);
    return (
        <div className="player board">
            <p>{props.playerID}: now is {props.isActive ? "your turn" : props.ctx.currentPlayer + " turn"}</p>
            {props.ctx.phase ? <p>my resource- Stone: <span>{props.G.resource[props.playerID].Stone}</span> Steel: <span>{props.G.resource[props.playerID].Steel}</span> Fuel: <span>{props.G.resource[props.playerID].Fuel}</span></p> : null}
            <div className="cards">
                {props.G.hand[props.playerID] ?
                    props.G.hand[props.playerID].map((v, i) => <CardComponent {...v} onClick={v => {
                        setCurrent(i);
                    }} key={i} selected={i === current}/>) :
                    null}
            </div>
            <div className="ant">
                {props.G.antHand[props.playerID] ?
                    props.G.antHand[props.playerID].map((v, i) => <CardComponent {...v} onClick={v => {
                    }} key={i}/>) :
                    null}
            </div>
            {/*{props.G.ufo[props.playerID] !== 0 &&*/}
            {/*(props.G.completed[props.playerID] !== -1 ?*/}
            {/*    <img src={"./cards/ufo-" + props.G.ufo[props.playerID] + ".png"} alt="ufo"/> :*/}
            {/*    <img src={"./cards/ufo-" + props.G.ufo[props.playerID] + "-back.png"} alt="ufo"/>)*/}
            {/*}*/}
            {props.isActive
            && props.G.ufo[props.playerID] === 0
            && <ChooseUFOComponent onClick={props.moves.choose}/>}
            {props.G.ufo[props.playerID] !== 0 &&
            <div className="action">
                <button onClick={tradeBack} disabled={!isTrading() || !props.isActive}>Trade Back</button>
                <button onClick={() => props.moves.drawAnt()}
                        disabled={props.G.draws[props.playerID] || !props.isActive}>Draw Ant
                </button>
                <button onClick={() => props.moves.drawJunk()}
                        disabled={props.G.draws[props.playerID] || !props.isActive}>Draw Junk
                </button>
                <button onClick={() => props.moves.buildTrade()}
                        disabled={isTrading() || props.G.trade[props.playerID] || !props.isActive}>Build Trade
                </button>

                <select id="player" onChange={(e) => setTg(e.target.value)}>
                    <option value="-1">Select Player</option>
                    {props.playerID !== '0' && <option value="0">P1</option>}
                    {props.playerID !== '1' && <option value="1">P2</option>}
                    {props.playerID !== '2' && <option value="2">P3</option>}
                </select>
                <button onClick={trade}
                        disabled={!props.G.trade[props.playerID] || isTrading() || !props.isActive}>Trade
                </button>
                {props.G.completed[props.playerID] !== -1 ?
                    <button onClick={() => props.moves.useSkill()} disabled={isTrading() || !props.isActive}>Use
                        Skill</button> : null}
                <button onClick={() => props.events.endTurn()} disabled={isTrading() || !props.isActive}>End Turn
                </button>
            </div>
            }
        </div>
    );
}
