import {
	EventHandler,
	EventMap,
	Emitter
} from '../../types/components/base/eventEmitter';

export class EventEmitter<Events extends EventMap> implements Emitter<Events> {
	private handlers: Map<keyof Events, Set<(data: any) => void>>;

	constructor() {
		this.handlers = new Map();
	}

	on<E extends keyof Events>(eventName: E, handler: EventHandler<Events[E]>): void {
		if (!this.handlers.has(eventName)) {
			this.handlers.set(eventName, new Set());
		}
		this.handlers.get(eventName)!.add(handler as (data: any) => void);
	}

	off<E extends keyof Events>(eventName: E, handler: EventHandler<Events[E]>): void {
		const set = this.handlers.get(eventName);
		if (set) {
			set.delete(handler as (data: any) => void);
			if (set.size === 0) this.handlers.delete(eventName);
		}
	}

	emit<E extends keyof Events>(eventName: E, data?: Events[E]): void {
		const set = this.handlers.get(eventName);
		if (set) {
			for (const handler of set) {
				handler(data);
			}
		}
	}

	reset(): void {
		this.handlers.clear();
	}

	bindEmitter(handlersMap: Map<keyof Events, Set<(data: any) => void>>): void {
		this.handlers = handlersMap;
	}
}
