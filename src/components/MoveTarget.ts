import { Point } from "../pathing/PathingMap";
import { Sprite } from "../entities/sprites/Sprite";
import {
	PathTweener,
	tweenPoints,
	distanceBetweenPoints,
	shortenPath,
	calcAndTweenShortenedPath,
} from "../util/tweenPoints";
import { DeprecatedComponent } from "../core/Component";
import { DeprecatedComponentManager } from "../core/DeprecatedComponentManager";

export class MoveTarget extends DeprecatedComponent<Sprite> {
	// The entity with the MoveTarget component.
	target: Point | Sprite;

	path: PathTweener;

	// How clost to the target we're trying to get. This is a radial distance.
	distance: number;

	// Number of update ticks that have occured since the path was calculated.
	ticks = 0;

	/**
	 * How far along the path the entity has moved. This allows for accounting
	 * for unit speed changes.
	 */
	progress = 0;

	/**
	 * How far along the path the entity is rendered to have moved. This allows
	 * for accounting for unit speed changes.
	 */
	renderProgress = 0;

	constructor({
		entity,
		target,
		distance = 0,
		path,
	}: {
		entity: Sprite;
		target: Point | Sprite;
		distance?: number;
		path?: PathTweener;
	}) {
		super(entity);
		this.target = target;
		this.distance = distance;

		if (!path) path = calcAndTweenShortenedPath(entity, target, distance);
		else if (
			distance > 0 &&
			Math.abs(
				distanceBetweenPoints(
					path.target,
					"x" in target && "y" in target ? target : target.position,
				) - distance,
			) < 1e-7
		)
			path = tweenPoints(shortenPath(path.points, distance));

		this.path = path;
	}

	recalc(): void {
		this.path = calcAndTweenShortenedPath(
			this.entity,
			this.target,
			this.distance,
		);

		this.progress = 0;
		this.renderProgress = 0;
		this.ticks = 0;
	}
}

export const MoveTargetManager = new DeprecatedComponentManager<MoveTarget>(
	MoveTarget,
);