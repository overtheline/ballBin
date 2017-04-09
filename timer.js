class Timer {
  constructor() {
    this.subscribers = [];
    this.loop = this.loop.bind(this);
    this.timer = d3.timer(this.loop);
  }

  getTimer() {
    return this.timer;
  }

  loop() {
    this.subscribers.forEach((s) => {
      s.callback(d3.now() - s.startTime, s.duration);
    });
  }

  subscribe(callback, duration) {
    return this.subscribers.push({
      startTime: d3.now(),
      callback,
      duration,
    });
  }

  unsubscribe(id) {
    if (id !== null) {
      this.subscribers = this.subscribers
        .slice(0, id - 1)
        .concat(this.subscribers.slice(id));
    }
  }

  stop() {
    this.timer.stop();
  }
}
