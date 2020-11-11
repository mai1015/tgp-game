import { INVALID_MOVE, TurnOrder } from 'boardgame.io/core';
import * as d from './data';
import {APPLIANCES, MASTER_CARD, UFO} from "./data";

function removeResource(arr, type, value) {
  let v = value;
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i].name === type && v <= arr[i].value) {
      arr[i].value -= v;
      arr[i].modify = true;
      if (arr[i].value === 0)
        arr.splice(i, 1);
      return true;
    }
  }
  return false;
}

function takeCard(arr, type, value) {
  let v = value;
  let cards = [];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === type && v >= arr[i].value) {
      v -= arr[i].value;
      cards.push(arr.splice(i, 1)[0]);
    }
    if (v === 0) break;
  }
  if (v !== 0) {
    let add = false;
    if (arr.length > 0) {
      add = !removeResource(arr, type, v);
    }
    if (add) {
      for (let i = 0; i < cards.length; i++) {
        arr.push(cards[i]);
      }
      arr.sort(v => v.value);
      return false;
    }
  }
  console.log(cards);
  return cards;
}

function takeAll(arr, reqs) {
  let req = [];
  for (let r of reqs) {
    let ret = takeCard(arr, r.type, r.value);
    if (ret === null) {
      for (let q of req) {
        arr.push(q);
      }
      return null;
    }
    req.concat(ret);
  }
  return req;
}

function shuffle(arr) {
  arr.sort(() => Math.random() - 0.5);
}

function genCards(names, num, rarity, value, meta) {
  let arr = [];
  for (let n of names) {
    for (let i = 0; i < rarity.length; i++) {
      for (let j = 0; j < num[i]; j++) {
        arr.push({
          ...meta,
          name: n,
          value: value[i],
          rarity: rarity[i],
        })
      }
      // TODO: remove fuel
      if (n === "Fuel") {
        arr.splice(arr.length - 11, 10);
      }
    }
  }
  shuffle(arr);
  return arr;
}

function genCatCard() {
  let arr = [];
  for (let c of APPLIANCES) {
    for (let i = 0; i < c.count; i++) {
      arr.push(c);
    }
  }
  shuffle(arr);
  return arr;
}

function antEffect(G, ctx) {
  let ants = G.antHand[ctx.currentPlayer];
  G.antHand[ctx.currentPlayer] = [];
  while (ants.length > 0) {
    let a = ants.pop();
    switch (a.value) {
      case 1:
        G.hand[ctx.currentPlayer].push(G.matCard.pop());
        break;
      case 2:
        G.hand[ctx.currentPlayer].push(G.matCard.pop());
        G.hand[ctx.currentPlayer].push(G.matCard.pop());
        break;
      case 3:
        G.hand[ctx.currentPlayer].push(G.matCard.pop());
        G.antHand[ctx.currentPlayer].push(G.antCard.pop());
        break;
      case 4:
        const c = G.matCard.pop();
        c.value *= 2;
        c.modify = true;
        G.hand[ctx.currentPlayer].push(c);
        break;
      case 5:
        for (let i = 0; i < 3; i++) {
          const c = G.antCard.pop();
          G.antHand[ctx.currentPlayer].push(c);
          if (c.value === 3) i--;
        }
        break;
    }
  }
  updateResource(G.hand[ctx.currentPlayer]);
}

function playApp(G, ctx, card, target) {
  switch (card.id) {
    case 1:
      return takeCard(G.hand[target], 'Steel', 2);
    case 2:
      return takeCard(G.hand[target], 'Steel', 4);
    case 3:
      console.log(G.matCard.pop());
      break;
    case 4:
      G.antHand[target] = [];
      break;
    case 5:
      G.skip[target] = true;
      break;
  }
  return true;
}

function updateResource(hand) {
  let ret = {'Fuel': 0, 'Steel': 0, 'Stone': 0};
  for (let i = 0; i < hand.length; i++) {
    ret[hand[i].name] += hand[i].value;
  }
  return ret;
}

export const TGP = {
  setup: (ctx) => ({
    matCard: genCards(d.MAT, d.NUM_MAT, d.TYPE_MAT, d.CARD_MAT, {type: 'MAT'}),
    antCard: genCards(d.ANT, d.NUM_ANT, d.TYPE_ANT, d.DRAW_ANT, {type: 'ANT'}),
    appCard: genCatCard(),
    hand: Array(ctx.numPlayers).fill([]),
    antHand: Array(ctx.numPlayers).fill([]),
    trade: Array(ctx.numPlayers).fill(false),
    draws: Array(ctx.numPlayers).fill(false),
    completed: Array(ctx.numPlayers).fill(-1),
    ufo: Array(ctx.numPlayers).fill(0),
    ufoBuild: false,
    resource: Array(ctx.numPlayers).fill({'Fuel': 0, 'Steel': 0, 'Stone': 0}),
    catTurn: 0,
    catRound: 0,
    master: MASTER_CARD,
    tradeNum: 30,
    skip: Array(ctx.numPlayers).fill(false),
    skillUsed: Array(ctx.numPlayers).fill(0)
  }),

  events: {
    onTurnBegin: (G, ctx) => {
      // console.log("triggered global");
    }
  },
  phases: {
    chooseUfo: {
      turn: {
        order: TurnOrder.CUSTOM(['0', '1', '2']),
        moveLimit: 1,
      },
      onBegin: (G, ctx) => {G.ufo[3] = -1},
      moves: {
        choose: (G, ctx, id) => {
          G.ufo[ctx.currentPlayer] = id;
        }
      },
      endIf: (G, ctx) => G.ufo.every(v => v !== 0),
      next: 'phasePlay',
      start: true
    },
    phasePlay: {
      turn: {
        order: TurnOrder.CUSTOM(['0', '3', '1', '3', '2', '3']),
        moveLimit: 0,
        onBegin: (G, ctx) => {
          // if (G.skip[ctx.currentPlayer]) {
          //   G.skip[ctx.currentPlayer] = false;
          //   // ctx.events.endTurn();
          //   // ctx.events.endTurn();
          //   return;
          // }
          if (G.antHand[ctx.currentPlayer].length !== 0) {
            antEffect(G, ctx);
          }
          G.draws[ctx.currentPlayer] = false;
        },
        onEnd: (G, ctx) => {
          const next = ctx.playOrder[(ctx.playOrderPos + 1) % ctx.playOrder.length];
          if (ctx.currentPlayer === '3') {
            G.catTurn++;
            if (G.skip[next]) {
              let nt = ctx.playOrder;
              nt.push(nt.shift());
              nt.push(nt.shift());
              console.log("moved");
              G.skip[next] = false;
            }
          } else {
            G.resource[ctx.currentPlayer] = updateResource(G.hand[ctx.currentPlayer]);
          }
        },
        stages: {
          trade: {
            moves: {
              choose: (G, ctx, id) => {
                console.log(ctx);
                let c = G.hand[ctx.playerID].splice(id, 1)[0];
                G.resource[ctx.playerID] = updateResource(G.hand[ctx.playerID]);
                G.hand[ctx.currentPlayer].push(c);
              }
            }
          }
        },
      },
      onBegin: (G, ctx) => {
        G.hand['3'].push(G.appCard.pop());
        G.hand['3'].push(G.appCard.pop());
        G.hand['3'].push(G.appCard.pop());
      },
      moves: {
        playApp: (G, ctx, i, t) => {
          // if (G.draws[ctx.currentPlayer] || ctx.currentPlayer !== '3' || G.hand[ctx.currentPlayer].length < 3) return INVALID_MOVE;
          if (ctx.currentPlayer !== '3' || G.draws[ctx.currentPlayer]) return INVALID_MOVE;
          const c = G.hand['3'].splice(i, 1)[0];
          playApp(G, ctx, c, t);
          // if (playApp(G, ctx, c, t)) {
          //   G.hand[ctx.currentPlayer].push(G.appCard.pop());
          //   G.draws[ctx.currentPlayer] = true;
          // } else {
          //   return INVALID_MOVE;
          // }
          G.hand[ctx.currentPlayer].push(G.appCard.pop());
          G.draws[ctx.currentPlayer] = true;
        },
        drawAnt: (G, ctx) => {
          if (G.draws[ctx.currentPlayer] || ctx.currentPlayer === '3') return INVALID_MOVE;
          G.antHand[ctx.currentPlayer].push(G.antCard.pop());
          G.draws[ctx.currentPlayer] = true;
          ctx.events.endTurn();
        },
        drawJunk: (G, ctx) => {
          if (G.draws[ctx.currentPlayer] || ctx.currentPlayer === '3') return INVALID_MOVE;
          G.hand[ctx.currentPlayer].push(G.matCard.pop())
          G.hand[ctx.currentPlayer].sort(v => v.value);
          G.draws[ctx.currentPlayer] = true;
          G.resource[ctx.currentPlayer] = updateResource(G.hand[ctx.currentPlayer]);
        },
        buildTrade: (G, ctx) => {
          if (G.trade[ctx.currentPlayer] || ctx.currentPlayer === '3') return INVALID_MOVE;
          const result = takeAll(G.hand[ctx.currentPlayer], [{type: 'Steel', value: 10}, {type: 'Stone', value: 10}]);
          if (result === null) return INVALID_MOVE;
          G.trade[ctx.currentPlayer] = true;
          G.resource[ctx.currentPlayer] = updateResource(G.hand[ctx.currentPlayer]);
        },
        buildUfo: (G, ctx) => {
          if (G.completed[ctx.currentPlayer] !== -1 || ctx.currentPlayer === '3') return INVALID_MOVE;
          const req = UFO[G.ufo[ctx.currentPlayer]].req;
          if (G.resource[ctx.currentPlayer].Fuel > req.Fuel &&
              (req.Stone && G.resource[ctx.currentPlayer].Stone > req.Stone) &&
              (req.Steel && G.resource[ctx.currentPlayer].Steel > req.Steel)) {
            G.completed[ctx.currentPlayer] = 0;
          }
        },
        useSkill: (G, ctx) => {
          if (!G.completed[ctx.currentPlayer] || ctx.currentPlayer === '3') return INVALID_MOVE;
          // switch (G.ufo[ctx.currentPlayer]) {
          //
          // }
        },
        trade: (G, ctx, id, card) => {
          // if (G.tradeNum < 1) return INVALID_MOVE;
          // if (!G.trade[ctx.currentPlayer] || ctx.currentPlayer === '3') return INVALID_MOVE;
          const c = G.hand[ctx.currentPlayer].splice(card, 1);
          G.hand[id].push(c[0]);
          ctx.events.setActivePlayers({value: {[id]: 'trade'}, moveLimit: 1});
          G.resource[ctx.currentPlayer] = updateResource(G.hand[ctx.currentPlayer]);
        },
        playMaster: (G, ctx) => {
          G.antCard = [];
        }
      }
    }
  },

  turn: {
    moveLimit: 1,
    stages: {
      trade: {
        moves: {
          choose: (G, ctx, id) => {
            console.log(ctx);
            let c = G.hands[ctx.currentPlayer].splice(id, 1)[0];
            G.resource[ctx.currentPlayer] = updateResource(G.hand[ctx.currentPlayer]);
            G.hands[ctx.playOrder[ctx.playOrderPos]].push(c);
          }
        }
      }
    }
  },
  endIf: (G, ctx) => {
    if (G.catTurn === 33) {
      G.catTurn = 0;
      G.catRound++;
      if (!G.ufoBuild) return { winner: '3' };
      G.ufoBuild = false;
    }
    if (G.completed[0] !== -1 && G.completed[1] !== -1 && G.completed[2] !== -1)
      return {winner: ['0', '1', '2'] };
    if (G.catRound === 3) {
      return {winner: ['3']};
    }
    // if (IsVictory(G.cells)) {
    //   return { winner: ctx.currentPlayer };
    // }
    // if (IsDraw(G.cells)) {
    //   return { draw: true };
    // }
  },
  ai: {
    enumerate: (G, ctx) => {
      let moves = [];
      for (let i = 0; i < 9; i++) {
        if (G.cells[i] === null) {
          moves.push({ move: 'clickCell', args: [i] });
        }
      }
      return moves;
    },
  }
};
