import { Color } from "three";
import type { Effect, Sprite, Weapon } from "webcraft";
import { isUnit } from "webcraft";

import { currentMazingContest } from "../mazingContestContext";
import type { ObstructionProps } from "./Obstruction";
import { Obstruction } from "./Obstruction";
import { registerEntity } from "./registry";

const black = new Color("#000");

const thunderTimeout = (target: Sprite) =>
	currentMazingContest().setTimeout(() => {
		const effectIndex = target.effects.findIndex((e) => e.type === "slow");
		const effect = target.effects[effectIndex];

		if (isUnit(target)) target.speed = effect.oldSpeed;

		target.effects.splice(effectIndex, 1);
	}, 5);

type ThunderProps = ObstructionProps & {
	weapon?: Weapon;
	autoAttack?: boolean;
};

export class Thunder extends Obstruction {
	static defaults = {
		...Obstruction.defaults,
		buildHotkey: "n" as const,
		cost: { gold: 1, lumber: 1 },
		meshBuilder: {
			...Obstruction.defaults.meshBuilder,
			colorFilter: (color: Color): Color => color.lerp(black, 0.75),
		},
		autoAttack: true,
		weapon: {
			enabled: true,
			damage: 0,
			cooldown: 5,
			last: 0,
			range: 2.5,
			projectile: "instant" as const,
			onDamage: (target: Sprite): void => {
				if (!isUnit(target)) return;

				const existingEffect = target.effects.find(
					(e) => e.type === "slow",
				);
				if (existingEffect) {
					currentMazingContest().clearTimeout(existingEffect.timeout);
					existingEffect.timeout = thunderTimeout(target);
					return;
				}

				// todo: add a SlowEffect component?

				const effect: Effect = {
					type: "slow",
					oldSpeed: target.speed,
					timeout: thunderTimeout(target),
				};

				target.speed = target.speed * 0.6;

				target.effects.push(effect);
			},
		},
	};

	readonly isThunder = true;

	constructor(props: ThunderProps) {
		super({ ...Thunder.clonedDefaults, ...props });
	}
}

registerEntity(Thunder);
