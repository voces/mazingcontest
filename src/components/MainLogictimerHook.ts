import { Component } from "webcraft";

import { currentMazingContest } from "../mazingContestContext";

export class MainLogicTimerHook extends Component {
	initialize(): void {
		currentMazingContest().mainLogic.timer = this.entity;
	}
}
