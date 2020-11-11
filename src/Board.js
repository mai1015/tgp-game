import React from 'react';
import {AlienBoard} from "./AlienBoard";
import {CatBoard} from "./CatBoard";

export class GameBoard extends React.Component {
    // onClick(id) {
    //     this.props.moves.clickCell(id);
    // }

    render() {
        // console.log(this.props);

        return (
            <div>
                {this.props.playerID !== '3' ? <AlienBoard {...this.props} /> : <CatBoard {...this.props} />}
            </div>
        );
    }
}
