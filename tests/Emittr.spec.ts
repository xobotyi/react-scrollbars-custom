import Emittr from '../src/Emittr';

describe('Emittr', () => {
  it('should create instance with given max handlers count', () => {
    const instance = new Emittr(25);
    expect(instance.getMaxHandlers()).toBe(25);
  });

  describe('getMaxHandlers', () => {
    it('should return a number', () => {
      const instance = new Emittr();
      expect(typeof instance.getMaxHandlers()).toBe('number');
    });
  });

  describe('setMaxHandlers', () => {
    it('should return an instance', () => {
      const instance = new Emittr();
      expect(instance.setMaxHandlers(25)).toBe(instance);
    });

    it('should set the max handlers number', () => {
      const instance = new Emittr();
      instance.setMaxHandlers(25);
      expect(instance.getMaxHandlers()).toBe(25);
      instance.setMaxHandlers(5);
      expect(instance.getMaxHandlers()).toBe(5);
    });

    it('should throw if input number <= 0', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        instance.setMaxHandlers(0);
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
      expect(instance.getMaxHandlers()).toBe(10);

      try {
        instance.setMaxHandlers(-5);
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
      expect(instance.getMaxHandlers()).toBe(10);
    });
  });

  describe('on', () => {
    it('should add event handler to the list', () => {
      const instance = new Emittr();
      instance.on('test', () => {});

      // @ts-ignore
      expect(Array.isArray(instance._handlers.test)).toBeTruthy();
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(1);
    });

    it('should return emitter instance', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      expect(instance.on('test', handler1)).toBe(instance);
    });

    it('should add handlers to the end', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.on('test', handler1);
      instance.on('test', handler2);

      // @ts-ignore
      expect(instance._handlers.test[0]).toBe(handler1);
      // @ts-ignore
      expect(instance._handlers.test[1]).toBe(handler2);
    });

    it('should emit addHandler event', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.on('addHandler', addHandlerTriggered);
      instance.on('test', () => {});

      expect(addHandlerTriggered).toHaveBeenCalledTimes(1);
    });

    it('adding addHandler handler should not emit itself', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.on('addHandler', addHandlerTriggered);

      expect(addHandlerTriggered).not.toHaveBeenCalled();
    });

    it('should throw if adding non-function', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        // @ts-ignore
        instance.on('test', {});
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
    });
  });

  describe('prependOn', () => {
    it('should add event handler to the list', () => {
      const instance = new Emittr();
      instance.prependOn('test', () => {});

      // @ts-ignore
      expect(Array.isArray(instance._handlers.test)).toBeTruthy();
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(1);
    });

    it('should return emitter instance', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      expect(instance.prependOn('test', handler1)).toBe(instance);
    });

    it('should add handlers to the start', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.prependOn('test', handler1);
      instance.prependOn('test', handler2);

      // @ts-ignore
      expect(instance._handlers.test[1]).toBe(handler1);
      // @ts-ignore
      expect(instance._handlers.test[0]).toBe(handler2);
    });

    it('should emit addHandler event', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.prependOn('addHandler', addHandlerTriggered);
      instance.prependOn('test', () => {});

      expect(addHandlerTriggered).toHaveBeenCalledTimes(1);
    });

    it('adding addHandler handler should not emit itself', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.prependOn('addHandler', addHandlerTriggered);

      expect(addHandlerTriggered).not.toHaveBeenCalled();
    });

    it('should throw if adding non-function', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        // @ts-ignore
        instance.prependOn('test', {});
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
    });
  });

  describe('once', () => {
    it('should add event handler to the list', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      instance.once('test', handler1);

      // @ts-ignore
      expect(Array.isArray(instance._handlers.test)).toBeTruthy();
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(1);
      // @ts-ignore
      expect(instance._handlers.test[0].handler).toBe(handler1);
    });

    it('should return emitter instance', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      expect(instance.once('test', handler1)).toBe(instance);
    });

    it('should add handlers to the end', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.once('test', handler1);
      instance.once('test', handler2);

      // @ts-ignore
      expect(instance._handlers.test[0].handler).toBe(handler1);
      // @ts-ignore
      expect(instance._handlers.test[1].handler).toBe(handler2);
    });

    it('should emit addHandler event', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.once('addHandler', addHandlerTriggered);
      instance.once('test', () => {});

      expect(addHandlerTriggered).toHaveBeenCalledTimes(1);
    });

    it('adding addHandler handler should not emit itself', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.once('addHandler', addHandlerTriggered);

      expect(addHandlerTriggered).not.toHaveBeenCalled();
    });

    it('should throw if adding non-function', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        // @ts-ignore
        instance.once('test', {});
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
    });
  });

  describe('prependOnce', () => {
    it('should add event handler to the list', () => {
      const instance = new Emittr();
      instance.prependOnce('test', () => {});

      // @ts-ignore
      expect(Array.isArray(instance._handlers.test)).toBeTruthy();
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(1);
    });

    it('should return emitter instance', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      expect(instance.prependOnce('test', handler1)).toBe(instance);
    });

    it('should add handlers to the start', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.prependOnce('test', handler1);
      instance.prependOnce('test', handler2);

      // @ts-ignore
      expect(instance._handlers.test[1].handler).toBe(handler1);
      // @ts-ignore
      expect(instance._handlers.test[0].handler).toBe(handler2);
    });

    it('should emit addHandler event', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.prependOnce('addHandler', addHandlerTriggered);
      instance.prependOnce('test', () => {});

      expect(addHandlerTriggered).toHaveBeenCalledTimes(1);
    });

    it('adding addHandler handler should not emit itself', () => {
      const instance = new Emittr();
      const addHandlerTriggered = jasmine.createSpy();
      instance.prependOnce('addHandler', addHandlerTriggered);

      expect(addHandlerTriggered).not.toHaveBeenCalled();
    });

    it('should throw if adding non-function', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        // @ts-ignore
        instance.prependOnce('test', {});
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
    });
  });

  describe('off', () => {
    it('should throw if passing non-function handler', () => {
      const instance = new Emittr();

      let err: any = null;

      try {
        // @ts-ignore
        instance.off('test', {});
      } catch (error) {
        err = error;
      }
      expect(err instanceof TypeError).toBeTruthy();
    });

    it('should return emitter instance', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      expect(instance.off('test', handler1)).toBe(instance);
    });

    it('should remove handler', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      instance.on('test', handler1);
      // @ts-ignore
      expect(instance._handlers.test[0]).toBe(handler1);
      expect(instance.off('test', handler1)).toBe(instance);
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(0);
    });

    it('should remove once handler', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      instance.once('test', handler1);
      // @ts-ignore
      expect(instance._handlers.test[0].handler).toBe(handler1);
      expect(instance.off('test', handler1)).toBe(instance);
      // @ts-ignore
      expect(instance._handlers.test.length).toBe(0);
    });

    it('should remove handler', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.on('test', handler1);
      instance.on('test', handler2);
      // @ts-ignore
      expect(instance._handlers.test[1]).toBe(handler2);
      expect(instance.off('test', handler1)).toBe(instance);
      // @ts-ignore
      expect(instance._handlers.test[0]).toBe(handler2);
    });

    it('should remove once handler', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.once('test', handler1);
      instance.once('test', handler2);
      // @ts-ignore
      expect(instance._handlers.test[1].handler).toBe(handler2);
      expect(instance.off('test', handler1)).toBe(instance);
      // @ts-ignore
      expect(instance._handlers.test[0].handler).toBe(handler2);
    });

    it('should emit removeHandler event', () => {
      const instance = new Emittr();
      const removeHandler = jasmine.createSpy();
      instance.on('removeHandler', removeHandler);
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.once('test', handler1);

      instance.off('test', handler2);
      instance.off('test', handler1);

      expect(removeHandler).toHaveBeenCalledTimes(1);
      expect(removeHandler.calls.argsFor(0)[0]).toBe('test');
      expect(removeHandler.calls.argsFor(0)[1]).toBe(handler1);
    });
  });

  describe('removeAllHandlers', () => {
    it('should remove all assigned handlers', () => {
      const instance = new Emittr();

      const removeHandler = jasmine.createSpy();
      instance.on('removeHandler', removeHandler);

      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      const handler3 = jasmine.createSpy();

      instance.on('test1', handler1).on('test2', handler2).on('test3', handler3);

      // @ts-ignore
      expect(instance._handlers.test1.length).toBe(1);
      // @ts-ignore
      expect(instance._handlers.test2.length).toBe(1);
      // @ts-ignore
      expect(instance._handlers.test3.length).toBe(1);
      // @ts-ignore
      expect(Object.keys(instance._handlers).length).toBe(4);

      instance.removeAllHandlers();

      // @ts-ignore
      expect(Object.keys(instance._handlers).length).toBe(0);

      expect(removeHandler).toHaveBeenCalledTimes(3);
      expect(removeHandler.calls.argsFor(0)[0]).toBe('test1');
      expect(removeHandler.calls.argsFor(0)[1]).toBe(handler1);
    });
  });

  describe('emit', () => {
    it('should call handler', () => {
      const instance = new Emittr();

      const handler1 = jasmine.createSpy();
      instance.on('test', handler1);

      instance.emit('test', 'Hello', 'world!');
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler1.calls.argsFor(0)[0]).toBe('Hello');
      expect(handler1.calls.argsFor(0)[1]).toBe('world!');

      instance.emit('test', 'Hello', 'world!');
      expect(handler1).toHaveBeenCalledTimes(2);
    });

    it('should call once handler only once', () => {
      const instance = new Emittr();

      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      instance.on('test', handler1);
      instance.once('test', handler2);

      instance.emit('test', 'Hello', 'world!');
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).toHaveBeenCalledTimes(1);

      instance.emit('test', 'Hello', 'world!');
      expect(handler1).toHaveBeenCalledTimes(2);
      expect(handler2).toHaveBeenCalledTimes(1);
    });

    it('should call handler in order they added', () => {
      const instance = new Emittr();
      const handler1 = jasmine.createSpy();
      const handler2 = jasmine.createSpy();
      const handler3 = jasmine.createSpy();
      instance.on('test', handler2);
      instance.on('test', handler3);
      instance.prependOn('test', handler1);

      instance.emit('test', 'Hello', 'world!');
      expect(handler1).toHaveBeenCalledBefore(handler2);
      expect(handler2).toHaveBeenCalledBefore(handler3);
    });
  });
});
