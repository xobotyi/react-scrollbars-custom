type EventHandler = () => void;
type OnceHandlerState = {
  fired: boolean;
  handler: EventHandler;
  wrappedHandler?: OnceHandler;
  emitter: Emittr;
  event: string;
};
type OnceHandler = OnceHandlerState & {
  (...args: any[]): void;
};
type EventHandlersList = (OnceHandler | EventHandler)[];
type EmitterEventHandlers = { [key: string]: EventHandlersList };

export default class Emittr {
  private _handlers: EmitterEventHandlers;

  private _maxHandlers: number;

  constructor(maxHandlers: number = 10) {
    this.setMaxHandlers(maxHandlers);
    this._handlers = Object.create(null);
  }

  setMaxHandlers(count: number): this {
    if (typeof count !== "number" || count < 0 || !count) {
      throw new TypeError(
        `Expected maxHandlers to be a positive number, got '${count}' of type ${typeof count}`
      );
    }

    this._maxHandlers = count;

    return this;
  }

  getMaxHandlers(): number {
    return this._maxHandlers;
  }

  public emit(name: string, ...args: any[]): boolean {
    if (
      typeof this._handlers[name] !== "object" ||
      !Array.isArray(this._handlers[name])
    ) {
      return false;
    }

    if (this._handlers[name].length) {
      if (this._handlers[name].length === 1) {
        Reflect.apply(this._handlers[name][0], this, args);
        return true;
      }

      const handlers: EventHandlersList = [...this._handlers[name]];
      let i;
      for (i = 0; i < handlers.length; i++) {
        Reflect.apply(handlers[i], this, args);
      }
    }

    return true;
  }

  private static _addHandler = (
    emitter: Emittr,
    name: string,
    handler: EventHandler,
    prepend: boolean = false
  ): Emittr => {
    if (typeof handler !== "function") {
      throw new TypeError(
        "Expected event handler to be a function, got " + typeof handler
      );
    }

    emitter._handlers[name] = emitter._handlers[name] || [];

    emitter.emit("addHandler", name, handler);

    prepend
      ? emitter._handlers[name].unshift(handler)
      : emitter._handlers[name].push(handler);

    return emitter;
  };

  private static _onceWrapper = function _onceWrapper(...args: any[]) {
    if (!this.fired) {
      this.fired = true;
      this.emitter.off(this.event, this.wrappedHandler);
      Reflect.apply(this.handler, this.emitter, args);
    }
  };

  private _wrapOnceHandler(name: string, handler: EventHandler): OnceHandler {
    const onceState: OnceHandlerState = {
      fired: false,
      handler,
      wrappedHandler: undefined,
      emitter: this,
      event: name
    };
    const wrappedHandler: OnceHandler = Emittr._onceWrapper.bind(onceState);

    onceState.wrappedHandler = wrappedHandler;
    wrappedHandler.handler = handler;
    wrappedHandler.event = name;

    return wrappedHandler;
  }

  private static _removeHandler = (
    emitter: Emittr,
    name: string,
    handler: EventHandler
  ): Emittr => {
    if (typeof handler !== "function") {
      throw new TypeError(
        "Expected event handler to be a function, got " + typeof handler
      );
    }

    if (
      typeof emitter._handlers[name] === "undefined" ||
      !emitter._handlers[name].length
    ) {
      return emitter;
    }

    let idx = -1;

    if (emitter._handlers[name].length === 1) {
      if (
        emitter._handlers[name][0] === handler ||
        (emitter._handlers[name][0] as OnceHandler).handler === handler
      ) {
        idx = 0;
        handler =
          (emitter._handlers[name][0] as OnceHandler).handler ||
          emitter._handlers[name][0];
      }
    } else {
      for (idx = emitter._handlers[name].length - 1; idx >= 0; idx--) {
        if (
          emitter._handlers[name][idx] === handler ||
          (emitter._handlers[name][idx] as OnceHandler).handler === handler
        ) {
          handler =
            (emitter._handlers[name][idx] as OnceHandler).handler ||
            emitter._handlers[name][idx];
          break;
        }
      }
    }

    if (idx === -1) {
      return emitter;
    }

    idx === 0
      ? emitter._handlers[name].shift()
      : emitter._handlers[name].splice(idx, 1);

    emitter.emit("removeHandler", name, handler);

    return emitter;
  };

  public on(name: string, handler: EventHandler): this {
    Emittr._addHandler(this, name, handler);

    return this;
  }

  public prependOn(name: string, handler: EventHandler): this {
    Emittr._addHandler(this, name, handler, true);

    return this;
  }

  public once(name: string, handler: EventHandler): this {
    if (typeof handler !== "function") {
      throw new TypeError(
        "Expected event handler to be a function, got " + typeof handler
      );
    }

    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler));

    return this;
  }

  public prependOnce(name: string, handler: EventHandler): this {
    if (typeof handler !== "function") {
      throw new TypeError(
        "Expected event handler to be a function, got " + typeof handler
      );
    }

    Emittr._addHandler(this, name, this._wrapOnceHandler(name, handler), true);

    return this;
  }

  public off(name: string, handler: EventHandler): this {
    Emittr._removeHandler(this, name, handler);

    return this;
  }

  public removeAllHandlers(): this {
    const handlers = this._handlers;

    this._handlers = Object.create(null);

    let idx, eventName;
    for (eventName in handlers) {
      for (idx = handlers[eventName].length - 1; idx >= 0; idx--) {
        this.emit(
          "removeHandler",
          eventName,
          (handlers[eventName][idx] as OnceHandler).handler ||
            handlers[eventName][idx]
        );
      }
    }

    return this;
  }
}
