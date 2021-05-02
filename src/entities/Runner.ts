import type { UnitProps } from "webcraft";
import { Component, Unit } from "webcraft";

export class Runner extends Unit {
	static defaults = {
		...Unit.defaults,
		collisionRadius: 0.5,
		speed: 4,
	};

	isRunner = true;

	constructor(props: UnitProps) {
		super({ ...Runner.clonedDefaults, ...props });
		// TODO: Pure systems should be able to detect componentless entities
		new Component(this);
	}
}
