import type { Action } from "webcraft";
import type { ObstructionProps as webcraftObstructionProps } from "webcraft";
import { Obstruction as webcraftObstruction } from "webcraft";
import { selfDestructAction } from "../actions/selfDestruct";
import { currentMazingContest } from "../mazingContestContext";
import type { Resource } from "../types";

export type ObstructionProps = webcraftObstructionProps<Resource>;

export class Obstruction extends webcraftObstruction<Resource> {
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
