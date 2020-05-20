import Loop from "../src/Loop";

describe("Loop", function () {
  const getTarget = () => ({
    _unmounted: false,
    randomField: "Hello World!",
    update: jasmine.createSpy(),
  });

  describe(".isActive", function () {
    it("should return boolean", function () {
      expect(Loop.isActive).toBeFalsy();
    });

    it("should return actual state", function () {
      expect(Loop.isActive).toBeFalsy();
      const target = getTarget();
      Loop.addTarget(target);
      expect(Loop.isActive).toBeTruthy();
      Loop.removeTarget(target);
      expect(Loop.isActive).toBeFalsy();
    });
  });

  describe(".start()", function () {
    it("should return the instance", function () {
      expect(Loop.start()).toBe(Loop);
    });

    it("should not start the loop if no targets registered", function () {
      Loop.start();
      expect(Loop.isActive).toBeFalsy();
    });

    it("should start the loop if has targets", function () {
      const target = getTarget();
      Loop.addTarget(target, true);
      expect(Loop.isActive).toBeFalsy();

      Loop.start();
      expect(Loop.isActive).toBeTruthy();

      Loop.removeTarget(target);
      expect(Loop.isActive).toBeFalsy();
    });

    it("should cancel previous animation frame if it somewhy wasn't", function (done) {
      const target = getTarget();
      Loop.addTarget(target, true);
      expect(Loop.isActive).toBeFalsy();

      const spy = jasmine.createSpy();
      //@ts-ignore
      Loop.animationFrameID = requestAnimationFrame(spy);

      Loop.start();
      expect(Loop.isActive).toBeTruthy();

      setTimeout(() => {
        expect(Loop.isActive).toBeTruthy();
        expect(spy).not.toHaveBeenCalled();

        Loop.removeTarget(target);
        expect(Loop.isActive).toBeFalsy();
        done();
      }, 60);
    });
  });

  describe(".stop()", function () {
    it("should return the instance", function () {
      expect(Loop.stop()).toBe(Loop);
    });

    it("should stop the loop if ", function (done) {
      const target = getTarget();
      Loop.addTarget(target);
      expect(Loop.isActive).toBeTruthy();

      Loop.stop();
      expect(Loop.isActive).toBeFalsy();

      setTimeout(() => {
        expect(target.update).not.toHaveBeenCalled();

        Loop.removeTarget(target);
        expect(Loop.isActive).toBeFalsy();
        done();
      }, 60);
    });
  });

  describe(".addTarget()", function () {
    it("should return the instance", function () {
      const target = getTarget();
      expect(Loop.addTarget(target)).toBe(Loop);
      Loop.removeTarget(target);
    });

    it("should add the target to targets list", function () {
      const target = getTarget();
      Loop.addTarget(target);
      //@ts-ignore
      expect(Loop.targets.length).toBe(1);
      //@ts-ignore
      expect(Loop.targets[0]).toBe(target);
      Loop.removeTarget(target);
    });

    it("should not add the target twice", function () {
      const target = getTarget();
      Loop.addTarget(target).addTarget(target).addTarget(target);
      //@ts-ignore
      expect(Loop.targets.length).toBe(1);
      //@ts-ignore
      expect(Loop.targets[0]).toBe(target);
      Loop.removeTarget(target);
    });

    it("should start the loop if added first target", function () {
      const target = getTarget();
      Loop.addTarget(target);
      expect(Loop.isActive).toBeTruthy();
      Loop.removeTarget(target);
    });

    it("should not start the loop if added first target and 2nd parameter is true", function () {
      const target = getTarget();
      Loop.addTarget(target, true);
      expect(Loop.isActive).toBeFalsy();
      Loop.removeTarget(target);
    });
  });

  describe(".removeTarget()", function () {
    it("should return the instance", function () {
      const target = getTarget();
      expect(Loop.removeTarget(target)).toBe(Loop);
    });

    it("should remove the target from targets list", function () {
      const target = getTarget();
      Loop.addTarget(target);
      //@ts-ignore
      expect(Loop.targets.length).toBe(1);
      //@ts-ignore
      expect(Loop.targets[0]).toBe(target);
      Loop.removeTarget(target);
      //@ts-ignore
      expect(Loop.targets.length).toBe(0);
    });

    it("should stop the loop if removed last target", function () {
      const target = getTarget();
      Loop.addTarget(target);
      expect(Loop.isActive).toBeTruthy();
      Loop.removeTarget(target);
      expect(Loop.isActive).toBeFalsy();
    });
  });

  describe(".rafCallback()", function () {
    it("should not fire the targets if loop is not active", function () {
      const target = getTarget();
      Loop.addTarget(target, true);
      //@ts-ignore
      expect(Loop.rafCallback()).toBe(0);
      expect(Loop.isActive).toBeFalsy();
      Loop.removeTarget(target);
    });
    it("should fire the targets if loop is active and return new RAF ID", function () {
      const target = getTarget();

      let id;

      Loop.addTarget(target, true);
      //@ts-ignore
      Loop._isActive = true;
      //@ts-ignore
      expect((id = Loop.rafCallback())).not.toBe(0);
      expect(target.update).toHaveBeenCalled();
      cancelAnimationFrame(id);
      Loop.removeTarget(target);
    });
  });
});
