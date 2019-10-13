
import { stringMap } from "./util.js";

export default {
	name: "The Rock",
	// For jumping
	layers: stringMap( `
        2222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222
        2222                                    2222            22
        2222                                    2222            22
        2222                                     22             22
        2222                                     22             22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                                         2          22
        2222            2                           2           22
        2222            2           2222           2            22
        2222        22222           2222          2 2           22
        2222            2           2222         2 2            22
        2222                        2222        2 2             22
        2222                                   2 2              22
        2222                                  2                 22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                                                    22
        2222                    22                              22
        2222                    2222                            22
        22  222222222222222222222222222222222222222222222222222222
        22  222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222
        2222222222222222222222222222222222222222222222222222222222
    ` ),
	// 0 = open space
	// 1 = crosser spawn
	// 2 = crosser target
	// 3 = defender spawn
	tiles: stringMap( `
          00000000000000000000000000000000000000000000000000000000
          00000000000000000000000000000000000000000000000000000000
          00000000000000000000000000000000000000000000000000000000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000333333000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
          00011000000000000000000000000000000000000000000000220000
        0000011000000000000000000000000000000000000000000000220000
        0000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000
        0000000000000000000000000000000000000000000000000000000000
        000000
        000000
    ` ),
};