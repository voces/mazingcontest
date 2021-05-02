import type {
	Action,
	ObstructionProps as WebcraftObstructionProps,
} from "webcraft";
import { Obstruction as WebcraftObstruction } from "webcraft";

import { selfDestructAction } from "../actions/selfDestruct";
import { currentMazingContest } from "../mazingContestContext";
import type { Resource } from "../types";

export type ObstructionProps = WebcraftObstructionProps<Resource>;

export class Obstruction extends WebcraftObstruction<Resource> {
	get actions(): Action[] {
		const mazingContest = currentMazingContest();
		if (mazingContest.mainLogic.round?.runnerStart) return [];
		const actions = super.actions;
		actions.push(
			this.owner === mazingContest.localPlayer
				? selfDestructAction
				: { ...selfDestructAction, cost: { tnt: 1 } },
		);
		return actions;
	}
}
