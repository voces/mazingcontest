import type {
	Emitter,
	EntityID,
	InitEvent,
	PlayerEvent,
	StateEvent,
} from "webcraft";
import { activeHost, ConnectionEvent, Network } from "webcraft";

import type { MazingContest } from "./MazingContest";

interface MazingContestInitEvent extends InitEvent {
	state: ReturnType<MazingContest["toJSON"]>;
}

interface MazingContestStateEvent extends StateEvent {
	state: ReturnType<MazingContest["toJSON"]>;
}

export type SelfDestructEvent = PlayerEvent & {
	type: "selfDestruct";
	sprites: EntityID[];
};

export type ReadyEvent = PlayerEvent & {
	type: "ready";
};

/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
const networkEvents = {
	...Network.networkEvents,
	init: (data: MazingContestInitEvent) => {},
	state: (data: MazingContestStateEvent) => {},
	selfDestruct: (data: SelfDestructEvent) => {},
	ready: (data: ReadyEvent) => {},
} as const;
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */

export type NetworkEventCallback = typeof networkEvents;

class MazingContestNetwork
	extends Network
	implements Emitter<NetworkEventCallback> {
	static networkEvents = networkEvents;

	// These are implemented via calling emitter(this)
	addEventListener!: Emitter<NetworkEventCallback>["addEventListener"];
	removeEventListener!: Emitter<NetworkEventCallback>["removeEventListener"];
	removeEventListeners!: Emitter<NetworkEventCallback>["removeEventListeners"];
	dispatchEvent!: Emitter<NetworkEventCallback>["dispatchEvent"];
}

export { activeHost, ConnectionEvent, MazingContestNetwork };
