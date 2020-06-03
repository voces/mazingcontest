import network, { activeHost } from "./network.js";

import { Game } from "./Game.js";
// import Random from "./lib/alea.js";
import { document, window } from "./util/globals.js";
import { patchInState } from "./players/Player.js";
// import Player from "./players/Player.js";
// import {
// 	take as takeColor,
// 	release as releaseColor,
// } from "./players/colors.js";
// import { updateDisplay } from "./players/elo.js";
import "./players/playerLogic.js";
import "./sprites/spriteLogic.js";
import "./players/camera.js";
import "./ui/index.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const game = ((globalThis as any).game = new Game());

Object.assign(document.getElementById("arena")!, { x: 0, y: 0, scale: 1 });

// We receive this upon connecting; the only state we get is the number of connections
network.addEventListener(
	"init",
	({ connections, state: { players: inputPlayers, arena } }) => {
		if (connections === 0) game.receivedState = "init";

		game.setArena(arena);

		patchInState(inputPlayers);
	},
);
// network.addEventListener( "init", ( { time, state: { arena, players: inputPlayers, lastRoundEnd } } ) => {

// 	game.update( { time } );

// 	inputPlayers.forEach( ( { color, id, ...playerData } ) => {

// 		const player = game.players.find( p => p.id === id ) || new Player( { ...playerData, id } );

// 		if ( ! player.color || player.color.index !== color ) {

// 			if ( player.color ) releaseColor( player.color );
// 			player.color = takeColor( color );

// 		}

// 		player.score = playerData.score;

// 	} );
// 	game.players.sort( ( a, b ) => a.id - b.id );

// 	game.setArena( arena );
// 	game.receivedState = "state";
// 	game.lastRoundEnd = lastRoundEnd;
// 	game.random = new Random( time );

// 	updateDisplay();

// } );

network.addEventListener("update", (e) => {
	game.update(e);
});

window.addEventListener("contextmenu", (e: Event) => {
	e.preventDefault();
});

let remainingErrors = 3;
window.addEventListener("error", (event: { error: Error }) => {
	if (remainingErrors === 0) return;
	remainingErrors--;

	fetch(`http://${activeHost}/error`, {
		method: "POST",
		body: JSON.stringify({ stack: event.error.stack }),
		headers: { "Content-Type": "application/json" },
	});
});
setInterval(() => (remainingErrors = Math.min(3, remainingErrors + 1)), 5000);

export default game;