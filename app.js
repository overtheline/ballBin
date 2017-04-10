class App {
  constructor() {
    this.getFrame = this.getFrame.bind(this);
    this.update = this.update.bind(this);
    this.objects = [];
    this.timer = new Timer();
    this.timer.subscribe(this.getFrame);
  }

  getFrame() {
    const data = this.objects.map((ball1, i) => {
      ball1.move();

      const ball1State = ball1.getState();

      this.objects.slice(i + 1).forEach((ball2) => {
        const ball2State = ball2.getState();
        const distance = dist(ball1State, ball2State);

        if (distance < ball1State.r + ball2State.r) {
          const postCollideState = collide(ball1State, ball2State, distance);
          ball1.setState(postCollideState[0]);
          ball2.setState(postCollideState[1]);
        }
      });

      // bounce l/r wall
      if ((ball1State.x + ball1State.r) > dim || (ball1State.x - ball1State.r) < 0) {
        const newState = {
          dx: -ball1State.dx,
          x: (ball1State.x - ball1State.r) < 0 ? ball1State.r : dim - ball1State.r,
        };

        ball1.setState(newState);
      }

      // bounce t/b wall
      if ((ball1State.y + ball1State.r) > dim || (ball1State.y - ball1State.r) < 0) {
        const newState = {
          dy: -ball1State.dy,
          y: (ball1State.y - ball1State.r) < 0 ? ball1State.r : dim - ball1State.r,
        };

        ball1.setState(newState);
      }

      return ball1.getState();
    });

    this.update(data);
  }

  update(data) {
    const g = d3.select('#frame');

    // JOIN
    const objects = g.selectAll('circle')
      .data(data, d => d.id);

    // UPDATE
    objects.attr('class', 'update object')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .style('fill', d => d.fill);

    // ENTER + UPDATE
    objects.enter().append('circle')
        .attr('class', 'enter object')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', d => rScale(d.r))
        .style('fill', d => d.fill)
      .merge(objects);

    objects.exit().remove();
  }

  init() {
    d3.select('#btn-2').on('click', () => {
      this.timer.stop();
    });

    // add a ball
    d3.select('#btn-1').on('click', () => {
      const balls = [
        new Ball({
          r: 2,
          x: 30,
          y: 10,
          dx: 0.5,
          dy: 1,
        }),
        new Ball({
          r: 2,
          x: 40,
          y: 60,
          dx: -0.5,
          dy: -0.5,
        }),
      ];

      balls.forEach((b) => {
        b.setState({ id: this.objects.length });
        this.objects.push(b);
      });
    });
  }
}

const app = new App();
app.init();
