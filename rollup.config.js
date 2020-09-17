import typescript from "rollup-plugin-typescript2";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
	input: ["src/index.ts", "src/server.ts"],
	output: [{ dir: "public/js", format: "es" }],
	plugins: [
		typescript({
			tsconfig: "tsconfig.build.json",
			tsconfigOverride: {
				compilerOptions: { declaration: true, incremental: true },
			},
		}),
		nodeResolve(),
		commonjs(),
	],
};
