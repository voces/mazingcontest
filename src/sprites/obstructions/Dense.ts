import { Obstruction, ObstructionProps } from "./Obstruction.js";

export class Dense extends Obstruction {
	static defaults = {
		...Obstruction.defaults,
		maxHealth: 240,
		armor: 0.25,
		cost: { essence: 4 },
		buildHotkey: "g" as const,
	};

	constructor(props: ObstructionProps) {
		super({ ...Dense.clonedDefaults, ...props });

		if (this.html?.htmlElement)
			this.html.htmlElement.style.boxShadow =
				"inset 0 0 16px rgba(0,0,0,0.75)";
	}
}
