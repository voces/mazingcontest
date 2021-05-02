import type { PlayerState as webcraftPlayerState } from "webcraft";
import { Player as webcraftPlayer, releaseColor, takeColor } from "webcraft";

import type { MazingContest } from "../MazingContest";
import type { Resource } from "../types";

interface PlayerStateMC extends webcraftPlayerState {
	resources: Player["resources"];
}

export class Player extends webcraftPlayer<Resource> {
	ready = false;

	toJSON(): PlayerStateMC {
		return {
			...super.toJSON(),
			resources: this.resources,
		};
	}
}
export const patchInState = (
	game: MazingContest,
	playersState: PlayerStateMC[],
): void => {
	playersState.forEach(({ color, id, ...playerData }) => {
		const player =
			game.players.find((p) => p.id === id) ??
			new Player({ ...playerData, id, game });

		if (
			color !== undefined &&
			(!player.color || player.color.index !== color)
		) {
			if (player.color) releaseColor(player.color);
			player.color = takeColor(color);
		}

		player.resources = playerData.resources;
	});
	game.players.sort((a, b) => a.id - b.id);
};
