import React from 'react';
import {AlienBoard} from "./AlienBoard";
import {CatBoard} from "./CatBoard";

export class GameBoard extends React.Component {
    // onClick(id) {
    //     this.props.moves.clickCell(id);
    // }

    render() {
        // console.log(this.props);
        let winner = '';
        if (this.props.ctx.gameover) {
            winner =
                this.props.ctx.gameover.winner !== undefined ? (
                    <div id="winner">Winner: {this.props.ctx.gameover.winner}</div>
                ) : (
                    <div id="winner">Draw!</div>
                );
        }
        return (
            <div>
                {winner}
                {this.props.playerID !== '3' ? <AlienBoard {...this.props} /> : <CatBoard {...this.props} />}
            </div>
        );
    }
}
