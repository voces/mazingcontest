import type { Mutable } from "webcraft";
import { Component } from "webcraft";

export class IsDone extends Component<[time: number]> {
	static argMap = ["time"];
	readonly time!: number;

	initialize(time: number): void {
		const mutable: Mutable<IsDone> = this;
		mutable.time = time;
	}
}
