class BlockTimer {
  constructor() {
    this.lastRun = Date.now();
    this.lastDelay = 0;
  }

  execute(func, delay = 500) {
    const now = Date.now();
    if (this.lastRun + this.lastDelay < now) {
      this.lastRun = now;
      this.lastDelay = delay;
      func();
    }
  }
}

export default new BlockTimer();
