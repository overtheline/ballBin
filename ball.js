class Ball {
  constructor(config) {
    this.state = {
      type: 'circle',
      r: config.r,
      x: config.x,
      y: config.y,
      dx: config.dx,
      dy: config.dy,
      fill: config.fill || 'red',
      id: config.id,
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
