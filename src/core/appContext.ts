import { Context } from "./Context";
import { App } from "./App";

const context = new Context<App | undefined>(undefined);

export const withApp = context.with.bind(context);
export const wrapApp = context.wrap.bind(context);
export const currentApp = (): App => {
	const app = context.current;
	if (!app) throw new Error("Expected an App context");
	return app;
};
