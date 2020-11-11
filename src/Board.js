import React from 'react';
import {AlienBoard} from "./AlienBoard";
import {CatBoard} from "./CatBoard";
import {CardComponent} from "./Card";

export const GameBoard = (props) => {
        let winner = '';
        if (props.ctx.gameover) {
            winner =
                props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }

        return (
            <div id="main">
                <div id="info">
                    {winner}
                    <p>Round: {props.G.catRound} -- {props.G.turns[0] + props.G.turns[1] + props.G.turns[2] + props.G.turns[3]}</p>
                    <p>Junk Card: {props.G.matCard.length} left</p>
                    <p>Ant Card: {props.G.antCard.length} left</p>
                    <p>App Card: {props.G.appCard.length} left</p>
                    <p><b>ufo list:</b></p>
                    <ul>
                        {props.G.ufo.map((v, i) => v !== 0 && i !== 3 ?
                            <li>{props.G.completed[i] !== -1 ? <img src={"./cards/ufo-" + v + ".png"} alt="ufo"/> :
                                <img src={"./cards/ufo-" + v + "-back.png"} alt="ufo"/>}</li> : null)}
                    </ul>
                    <p><b>other player's card</b></p>
                    <div className="otherplayer">
                        {props.G.hand.map((v, i) => i != props.playerID && i !== 3 ?
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
                        {props.G.antHand.map((v, i) => i != props.playerID && i !== 3 ?
                            (<>
                                <p>player: {i}</p>
                                {v.length > 0 ?
                                    <div className="cards">{v.map((c) => <CardComponent {...c} />)}</div> : "no card yet"
                                }
                            </>) : null
                        )}
                    </div>
                </div>
                {props.playerID !== '3' ? <AlienBoard {...props} /> : <CatBoard {...props} />}
            </div>
        );
}
