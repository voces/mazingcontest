// https://github.com/voces/mvp-bd-client/issues/44
/* eslint-disable no-restricted-imports */
import { arenas } from "../katma/arenas/index";
import { Round } from "../katma/Round";
import { Arena } from "../katma/arenas/types";
/* eslint-enable no-restricted-imports */
import { emitter, Emitter } from "../core/emitter";
import { Player, patchInState } from "./players/Player";
import { alea } from "./lib/alea";
import { Settings } from "./types";
import { Network, NetworkEventCallback } from "./network";
import { UI } from "../ui/index";
// import { initObstructionPlacement } from "./entities/sprites/obstructionPlacement";
import { initPlayerLogic } from "./players/playerLogic";
import { initSpriteLogicListeners } from "../entities/sprites/spriteLogic";
import { App } from "../core/App";
import { MoveSystem } from "./systems/MoveSystem";
import { AttackSystem } from "./systems/AttackSystem";
import { BlueprintSystem } from "./systems/BlueprintSystem";
import { ProjectileSystem } from "./systems/ProjectileSystem";
import { GerminateSystem } from "./systems/GerminateSystem";
import { AutoAttackSystem } from "./systems/AutoAttackSystem";
import { AnimationSystem } from "./systems/AnimationSystem";
import { SelectedSystem } from "./systems/SelectedSystem";
import { MeshBuilder } from "./systems/MeshBuilder";
import { Terrain } from "../entities/Terrain";
import { ThreeGraphics } from "./systems/ThreeGraphics";
import { ObstructionPlacement } from "./mechanisms/ObstructionPlacement";
import { circleSystems } from "./systems/MovingCircles";
import { Entity } from "../core/Entity";
import { Hotkeys } from "../ui/hotkeys";
import { Mouse } from "./systems/Mouse";
import { withGame, wrapGame } from "./gameContext";
import { isSprite } from "./typeguards";
import { GraphicMoveSystem } from "./systems/GraphicMoveSystem";
import { GraphicTrackPosition } from "./systems/GraphicTrackPosition";

class Game extends App {
	private network!: Network;
	addNetworkListener!: Network["addEventListener"];
	removeNetworkListener!: Network["removeEventListener"];
	connect!: Network["connect"];

	ui!: UI;

	localPlayer!: Player;
	host?: Player;
	players: Player[] = [];
	arena: Arena = arenas[0];
	receivedState: false | "init" | "state" | "host" = false;
	newPlayers = false;
	random = alea("");
	round?: Round;
	lastUpdate = 0;
	lastRoundEnd?: number;
	terrain?: Terrain;

	mouse!: Mouse;
	actions!: Hotkeys;

	settings: Settings = {
		arenaIndex: -1,
		crossers: 1,
		duration: 120,
		mode: "bulldog",
		resources: {
			crossers: { essence: { starting: 100, rate: 1 } },
			defenders: { essence: { starting: 0, rate: 0 } },
		},
	};

	constructor(network: Network) {
		super();
		withGame(this, () => {
			emitter(this);

			this.addSystem(new MoveSystem());
			this.addSystem(new AttackSystem());
			this.addSystem(new BlueprintSystem());
			this.addSystem(new ProjectileSystem());
			this.addSystem(new GerminateSystem());
			this.addSystem(new AutoAttackSystem());
			this.addSystem(new AnimationSystem());
			this.addSystem(new MeshBuilder());
			this.addSystem(new ThreeGraphics(this));
			this.addSystem(new GraphicMoveSystem());
			this.addSystem(new GraphicTrackPosition());
			circleSystems.forEach((CircleSystem) =>
				this.addSystem(new CircleSystem()),
			);
			this.actions = new Hotkeys();
			this.addMechanism(this.actions);

			this.network = network;
			this.addNetworkListener = (event, callback) =>
				this.network.addEventListener(
					event,
					// IDK why this is busted...
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					wrapGame(this, callback as any) as any,
				);
			this.removeNetworkListener = (event, callback) =>
				this.network.removeEventListener(
					event,
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					wrapGame(this, callback as any) as any,
				);
			this.connect = this.network.connect.bind(this.network);
			this.addNetworkListener("init", (e) => this.onInit(e));
			this.addNetworkListener("update", (e) => this.update(e));

			this.ui = new UI();
			this.mouse = new Mouse(this.graphics, this.ui);
			this.addSystem(this.mouse);
			this.addMechanism(new ObstructionPlacement(this));
			this.addSystem(new SelectedSystem());
			initPlayerLogic(this);
			initSpriteLogicListeners(this);

			this.setArena(Math.floor(this.random() * arenas.length));
		});
	}

	/* This should only be used by servers that need to rewrite bits. */
	public get __UNSAFE_network(): Network {
		return this.network;
	}

	transmit<T extends Record<string, unknown>>(data: T): void {
		this.network.send(data);
	}

	get isHost(): boolean {
		return this.network.isHost;
	}

	private onInit: NetworkEventCallback["init"] = ({
		connections,
		state: { players: inputPlayers, arena },
	}) => {
		if (connections === 0) this.receivedState = "init";

		this.setArena(arena);

		patchInState(this, inputPlayers);
	};

	setArena(arenaIndex: number): void {
		if (this.settings.arenaIndex === arenaIndex) return;

		this.settings.arenaIndex = arenaIndex;
		this.arena = arenas[arenaIndex];

		if (this.terrain) this.remove(this.terrain);
		this.terrain = new Terrain(this.arena);
		this.add(this.terrain);

		this.graphics.panTo(
			{
				x: this.arena.tiles[0].length / 2,
				y: this.arena.tiles.length / 2,
			},
			0,
		);
	}

	nextArena(): void {
		this.settings.arenaIndex =
			(this.settings.arenaIndex + 1) % arenas.length;
	}

	previousArena(): void {
		this.settings.arenaIndex = this.settings.arenaIndex
			? this.settings.arenaIndex - 1
			: arenas.length - 1;
	}

	get graphics(): ThreeGraphics {
		const sys = this.systems.find((s) => ThreeGraphics.isThreeGraphics(s));
		if (!sys) throw new Error("expected a ThreeGraphics");
		return sys as ThreeGraphics;
	}

	get obstructionPlacement(): ObstructionPlacement {
		const mech = this.mechanisms.find((m) =>
			ObstructionPlacement.isObstructionPlacement(m),
		);
		if (!mech) throw new Error("expected a ObstructionPlacement");
		return mech as ObstructionPlacement;
	}

	get selectionSystem(): SelectedSystem {
		const sys = this.systems.find((s) =>
			SelectedSystem.isSelectedSystem(s),
		);
		if (!sys) throw new Error("expected a SelectedSystem");
		return sys as SelectedSystem;
	}

	start({ time }: { time: number }): void {
		if (this.round) throw new Error("A round is already in progress");

		const plays = this.players[0].crosserPlays;
		const newArena =
			plays >= 3 &&
			this.players.every(
				(p) => p.crosserPlays === plays || p.crosserPlays >= 5,
			);

		if (newArena) {
			this.setArena(Math.floor(this.random() * arenas.length));
			this.players.forEach((p) => (p.crosserPlays = 0));
		}

		this.settings.crossers =
			this.players.length === 3
				? 1 // hardcode 1v2
				: Math.ceil(this.players.length / 2); // otherwise just do 1v0, 1v1, 1v2, 2v2, 3v2, 3v3, 4v3, etc

		this.round = new Round({
			time,
			settings: this.settings,
			players: this.players,
		});
	}

	render(): void {
		withGame(this, () => this._render());
	}

	remove(entity: Entity): Game {
		for (const system of this.systems) system.remove(entity);

		entity.clear();
		if (isSprite(entity)) entity.remove(true);

		return this;
	}

	protected _update(e: { time: number }): void {
		super._update(e);

		const time = e.time / 1000;
		this.lastUpdate = time;

		// Update is called for people who have recently joined
		if (this.round) {
			this.round.update(time);
			this.dispatchEvent("update", time);
			return;
		}

		if (
			this.players.length &&
			this.receivedState &&
			(!this.lastRoundEnd || time > this.lastRoundEnd + 2)
		)
			this.start({ time });
	}

	update(e: { time: number }): void {
		withGame(this, () => this._update(e));
	}

	toJSON(): {
		arena: number;
		lastRoundEnd: number | undefined;
		lastUpdate: number;
		players: ReturnType<typeof Player.prototype.toJSON>[];
		round: ReturnType<typeof Round.prototype.toJSON> | undefined;
	} {
		return {
			arena: this.settings.arenaIndex,
			lastRoundEnd: this.lastRoundEnd,
			lastUpdate: this.lastUpdate,
			players: this.players.map((p) => p.toJSON()),
			round: this.round?.toJSON(),
		};
	}
}

export type GameEvents = {
	update: (time: number) => void;
	selection: (selection: Entity[]) => void;
};

interface Game extends Emitter<GameEvents>, App {}

export { Game };