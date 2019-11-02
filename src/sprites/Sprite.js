
import { PATHING_TYPES, WORLD_TO_GRAPHICS_RATIO } from "../constants.js";
import dragSelect from "./dragSelect.js";
import game from "../index.js";
import emitter from "../emitter.js";
import { document } from "../util/globals.js";

// TODO: abstract dom into a class
const arenaElement = document.getElementById( "arena" );

export default emitter( class Sprite {

	static radius = 1;
	static maxHealth = 1;
	static armor = 0;
	static requiresPathing = PATHING_TYPES.WALKABLE;
	static blocksPathing = PATHING_TYPES.WALKABLE | PATHING_TYPES.BUILDABLE;
	static priority = 0;

	radius = this.radius || this.constructor.radius;
	requiresPathing = this.requiresPathing || this.constructor.requiresPathing;
	blocksPathing = this.blocksPathing || this.constructor.blocksPathing;
	armor = this.constructor.armor;
	action;
	priority = this.priority || this.constructor.priority;
	effects = [];

	constructor( { x, y, selectable = true, id, color, ...rest } ) {

		emitter( this );
		Object.assign( this, rest );

		this.id = id === undefined ? game.round.spriteId ++ : id;
		this.x = x;
		this.y = y;
		this.health = this.health || this.constructor.maxHealth;

		// Display
		this.elem = document.createElement( "div" );
		this.elem.classList.add( this.constructor.name.toLowerCase(), "sprite" );
		this.elem.style.left = ( x - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";
		this.elem.style.top = ( y - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";
		this.elem.style.width = this.radius * WORLD_TO_GRAPHICS_RATIO * 2 + "px";
		this.elem.style.height = this.radius * WORLD_TO_GRAPHICS_RATIO * 2 + "px";
		this.elem.sprite = this;
		arenaElement.appendChild( this.elem );
		if ( selectable ) dragSelect.addSelectables( [ this.elem ] );
		else this.elem.classList.add( "doodad" );

		if ( this.owner ) {

			if ( ! color && this.owner.color )
				this.elem.style.backgroundColor = this.owner.color.hex;
			this.elem.setAttribute( "owner", this.owner.id );

		} else this.elem.style.backgroundColor = color || "white";

		// Lists
		if ( this.owner ) this.owner.sprites.push( this );
		if ( game.round ) game.round.sprites.push( this );

		// TODO: move this into getters and setters
		let action;
		Object.defineProperty( this, "action", {
			set: value => {

				if ( action && action.cleanup ) action.cleanup();
				action = value;

			},
			get: () => action,
		} );

	}

	setPosition( pos, y ) {

		this._setPosition( pos, y );
		if ( this.elem ) {

			this.elem.style.left = ( this._x - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";
			this.elem.style.top = ( this._y - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";

		}

	}

	_setPosition( pos, y ) {

		const { x: xBefore, y: yBefore } = this;

		const x = typeof pos === "object" ? pos.x : pos;
		if ( typeof pos === "object" ) y = pos.y;

		const { x: newX, y: newY } = game.round.pathingMap.withoutEntity(
			this,
			() => game.round.pathingMap.nearestPathing( x, y, this )
		);

		this._x = newX;
		this._y = newY;
		if ( game.round && game.round.pathingMap.entities.has( this ) )
			game.round.pathingMap.updateEntity( this );
		this.facing = Math.atan2( this.y - yBefore, this.x - xBefore );

	}

	set x( x ) {

		if ( isNaN( x ) ) throw new Error( "Cannot set Sprite#x to NaN" );

		this._x = x;
		if ( this.elem )
			this.elem.style.left = ( x - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";

	}

	get x() {

		return this._x;

	}

	set y( y ) {

		if ( isNaN( y ) ) throw new Error( "Cannot set Sprite#y to NaN" );

		this._y = y;
		if ( this.elem )
			this.elem.style.top = ( y - this.radius ) * WORLD_TO_GRAPHICS_RATIO + "px";

	}

	get y() {

		return this._y;

	}

	set selected( value ) {

		this._selected = value;

		if ( this.elem && value )
			this.elem.classList.add( "selected" );
		else
			this.elem.classList.remove( "selected" );

	}

	get selected() {

		return this._selected;

	}

	damage( amount ) {

		const ignoreArmor = isNaN( this.buildProgress ) || this.buildProgress < 1;
		const effectiveArmor = ignoreArmor ? this.armor : 0;
		const actualDamage = amount * ( 1 - effectiveArmor );

		if ( this.health <= 0 ) return actualDamage;
		this.health -= actualDamage;

		return actualDamage;

	}

	kill( { removeImmediately = false } = {} ) {

		if ( removeImmediately )
			this._death( { removeImmediately: true } );
		else
			this.health = 0;

	}

	set health( value ) {

		this._health = Math.min( Math.max( value, 0 ), this.constructor.maxHealth );

		if ( this.elem && this._health )
			this.elem.style.opacity = Math.max( this._health / this.constructor.maxHealth, 0.1 );

		if ( value <= 0 && this.isAlive ) {

			this.isAlive = false;
			this._death();

		} else
			this.isAlive = true;

	}

	get health() {

		return this._health;

	}

	_death( { removeImmediately = false } = {} ) {

		if ( removeImmediately ) this._health = 0;

		this.action = undefined;
		dragSelect.removeSelectables( [ this.elem ] );
		if ( this._selected )
			dragSelect.setSelection(
				dragSelect.selection.filter( u => u !== this )
			);
		if ( this.owner ) {

			const index = this.owner.sprites.indexOf( this );
			if ( index >= 0 ) this.owner.sprites.splice( index, 1 );

		}
		if ( game.round ) {

			game.round.pathingMap.removeEntity( this );
			const index = game.round.sprites.indexOf( this );
			if ( index >= 0 ) game.round.sprites.splice( index, 1 );

		}
		this.dispatchEvent( "death" );

		// Death antimation
		if ( removeImmediately ) this.remove();
		else {

			this.elem.classList.add( "death" );
			game.round.setTimeout( () => this.remove(), 0.125 );

		}

	}

	remove() {

		this.removeEventListeners();
		if ( game.round ) game.round.pathingMap.removeEntity( this );

		if ( arenaElement.contains( this.elem ) )
			arenaElement.removeChild( this.elem );

	}

	toJSON() {

		return {
			action: this.action,
			constructor: this.constructor.name,
			health: this.health,
			owner: this.owner && this.owner.id,
			x: this.x,
			y: this.y,

		};

	}

} );
