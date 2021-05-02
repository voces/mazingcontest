import type { Action } from "webcraft";
import type { UnitProps } from "webcraft";
import { Unit } from "webcraft";
import { destroyLast } from "../actions/destroyLast";
import { readyAction } from "../actions/ready";
import { Block } from "./Block";
import { registerEntity } from "./registry";
import { Thunder } from "./Thunder";

export class Builder extends Unit {
	static defaults = {
		...Unit.defaults,
		builds: [Block, Thunder],
		collisionRadius: 0.5,
		requiresPathing: 0,
		blocksPathing: 0,
		speed: 25,
		zOffset: 2,
	};

	isBuilder = true;

	constructor(props: UnitProps) {
		super({ ...Builder.clonedDefaults, ...props });
	}

	get actions(): Action[] {
		const actions = super.actions.filter(
			// Not interesting in MC
			(a) => a.name !== "Hold Position" && a.name !== "Stop",
		);
		actions.push(destroyLast);
		actions.push(readyAction);
		return actions;
	}
}

registerEntity(Builder);
