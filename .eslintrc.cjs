module.exports = {
	extends: ["verit"],
	parserOptions: { project: "tsconfig.json", tsconfigRootDir: __dirname },
	settings: { react: { pragma: "h", version: "16.2" } },
	rules: {
		"@typescript-eslint/no-this-alias": [
			"error",
			{ allowedNames: ["mutable"] },
		],
		"@typescript-eslint/prefer-nullish-coalescing": "error",
		"@typescript-eslint/consistent-type-imports": [
			"error",
			{ prefer: "type-imports" },
		],
		"no-duplicate-imports": "off",
		"@typescript-eslint/no-duplicate-imports": ["error"],
		"react/react-in-jsx-scope": "off",
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{ ignoreRestSiblings: true },
		],
		"no-restricted-syntax": [
			"error",
			{
				selector: "ExportDefaultDeclaration",
				message:
					"Default exports are disallowed. Prefer named exports.",
			},
			{
				selector:
					"CallExpression[callee.object.name=Math][callee.property.name=random]",
				message:
					"Using `Math.random()` can result in desyncs. Prefer `game.random()`.",
			},
		],
		// "no-restricted-imports": [
		// 	"error",
		// 	{
		// 		patterns: [
		// 			"**/engine/Game",
		// 			"**/engine/Network",
		// 			"**/engine/players/Player",
		// 			"**/katma",
		// 		],
		// 	},
		// ],
	},
};
