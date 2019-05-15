interface UpdatableItem {
  _unmounted?: boolean;
  update: () => any;
}

export class RAFLoop {
  /**
   * @description List of targets to update
   */
  private readonly targets: UpdatableItem[] = [];

  /**
   * @description ID of requested animation frame. Valuable only if loop is active and has items to iterate.
   */
  private animationFrameID: number = 0;

  /**
   * @description Loop's state.
   */
  private _isActive: boolean = false;

  /**
   * @description Loop's state.
   */
  public get isActive(): boolean {
    return this._isActive;
  }

  /**
   * @description Start the loop if it wasn't yet.
   */
  public start = (): this => {
    if (!this._isActive && this.targets.length) {
      this._isActive = true;

      this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = requestAnimationFrame(this.rafCallback);
    }

    return this;
  };

  /**
   * @description Stop the loop if is was active.
   */
  public stop = (): this => {
    if (this._isActive) {
      this._isActive = false;

      this.animationFrameID && cancelAnimationFrame(this.animationFrameID);
      this.animationFrameID = 0;
    }

    return this;
  };

  /**
   * @description Callback that called each animation frame.
   */
  private rafCallback = (): number => {
    if (!this._isActive) {
      return 0;
    }

    for (let i = 0; i < this.targets.length; i++) {
      !this.targets[i]._unmounted && this.targets[i].update();
    }

    return (this.animationFrameID = requestAnimationFrame(this.rafCallback));
  };

  /**
   * @description Add target to the iteration list if it's not there.
   */
  public addTarget = (target: UpdatableItem, silent: boolean = false): this => {
    if (this.targets.indexOf(target) === -1) {
      this.targets.push(target);

      this.targets.length === 1 && !silent && this.start();
    }

    return this;
  };

  /**
   * @description Remove target from iteration list if it was there.
   */
  public removeTarget = (target: UpdatableItem): this => {
    const idx = this.targets.indexOf(target);

    if (idx !== -1) {
      this.targets.splice(idx, 1);

      this.targets.length === 0 && this.stop();
    }

    return this;
  };
}

export default new RAFLoop();
