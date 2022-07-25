declare type EventHandler = (...args: any[]) => void;
export default class Emittr {
    private _handlers;
    private _maxHandlers;
    constructor(maxHandlers?: number);
    private static _callEventHandlers;
    private static _addHandler;
    private static _onceWrapper;
    private static _removeHandler;
    setMaxHandlers(count: number): this;
    getMaxHandlers(): number;
    emit(name: string, ...args: any[]): boolean;
    on(name: string, handler: EventHandler): this;
    prependOn(name: string, handler: EventHandler): this;
    once(name: string, handler: EventHandler): this;
    prependOnce(name: string, handler: EventHandler): this;
    off(name: string, handler: EventHandler): this;
    removeAllHandlers(): this;
    private _wrapOnceHandler;
}
export {};
