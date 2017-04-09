class Ball {
  constructor(config) {
    this.state = {
      type: 'circle',
      r: config.r || 1,
      x: config.x || 0,
      y: config.y || 0,
      dx: config.dx || 1,
      dy: config.dy || 1,
      fill: config.fill || 'red',
      id: config.id || null,
    };


    this.move = this.move.bind(this);
  }

  move() {
    const { x, y, dx, dy } = this.state;

    this.state = Object.assign(
      {},
      this.state,
      {
        x: x + dx,
        y: y + dy,
      }
    );
  }

  setId(id) {
    this.id = id;
  }

  getState() {
    return Object.assign({}, this.state);
  }

  setState(newState) {
    this.state = Object.assign({}, this.state, newState);
  }
}
