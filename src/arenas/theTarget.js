
import { stringMap } from "./util.js";

const base = {
	name: "The Target",
	// For jumping
	layers: stringMap( `
		3333333333333333333333333333333333333333
		3333333333333333333333333333333333333333
		33        333333331111111133333333    33
		33        333331311111111113133333    33
		33           333111111111111333       33
		33           33111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33         33331111111111111133       33
		33         3333111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            1111111111111111        33
		33            3311111111111133        33
		33        333333311111111113333333    33
		33        333333331111111133313333    33
		3333333333333333333333333333333333333333
		3333333333333333333333333333333333333333
    ` ),
	// 0 = open space
	// 1 = crosser spawn
	// 2 = crosser target
	// 3 = defender spawn
	tiles: stringMap( `
		0000000000000000000000000000000000000000
		0000000000000000000000000000000000000000
		0000000000000000000000000000000000000000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000333300022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0001100000000000000000000000000000022000
		0000000000000000000000000000000000000000
		0000000000000000000000000000000000000000
		0000000000000000000000000000000000000000
    ` ),
};

// This makes it easy to develop a new arena, so leaving it here
// base.tiles = base.layers.map( r => r.map( () => 0 ) );
// base.tiles[ Math.floor( base.tiles.length / 2 ) ][ Math.floor( base.tiles[ 0 ].length / 2 ) ] = 1;

export default base;
