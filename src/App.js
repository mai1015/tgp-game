import React from "react";
import { Client } from 'boardgame.io/react';
import { TGP } from './Game';
import { GameBoard } from './Board';
import { SocketIO } from 'boardgame.io/multiplayer';
import './App.css';

const { protocol, hostname, port } = window.location;
let server = `${protocol}//${hostname}`;
if (port) server += `:${port}`;
if (process.env.NODE_ENV !== 'production')
    server = "localhost:8000";

const Board = Client({ game: TGP, board: GameBoard, numPlayers: 4, multiplayer: SocketIO({ server })});

function App(props) {
    let query = new URLSearchParams(window.location.search);
    console.log(new URLSearchParams(window.location.search).get('test'));
    return (
        <div className="App">
            <Board playerID={query.get('id')} matchID={query.get('mid')}/>
        </div>
    );
}

export default App;
