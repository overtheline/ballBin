const Pi = Math.PI;
const width = d3.select('svg').attr('width') - 20;
const height = d3.select('svg').attr('height') - 20;
const round = (x) => Math.round(x * 100) / 100;
const xScale = d3.scaleLinear()
                  .domain([-10, 10])
                  .range([0, width]);
const yScale = d3.scaleLinear()
                  .domain([-10, 10])
                  .range([height, 0]);
const rScale = d3.scaleLinear()
                  .domain([0, 1])
                  .range([0, width / 20]);

function dist(obj1, obj2) {
  return Math.sqrt(
    (obj1.x - obj2.x) * (obj1.x - obj2.x)
    + (obj1.y - obj2.y) * (obj1.y - obj2.y)
  );
}
function sin(x) { return Math.sin(x); }
function cos(x) { return Math.cos(x); }
function atan(x) { return Math.atan(x); }

function collide(obj1, obj2) {
  const s1 = obj1.getState();
  const s2 = obj2.getState();

  // collision x length
  const cx = s1.x - s2.x;
  // collision y length
  const cy = s1.y - s2.y;
  // collision angle
  const ct = cx ? atan(cy / cx) : (Pi / 2);
  // orthogonal angle
  const ot = ct + (Pi / 2);

  const cDist = dist(obj1, obj2) / 2;
  const cDiff1 = obj1.r - 0.99 * cDist;
  const cDiff2 = obj2.r - 0.99 * cDist;

  obj2.setState({
    x: s2.x - cDiff2 * cos(s2.dt),
    y: s2.y - cDiff2 * sin(s2.dt),
    dt: 2 * ot - s2.dt,
  });

  obj1.setState({
    x: s1.x - cDiff1 * cos(s1.dt),
    y: s1.y - cDiff1 * sin(s1.dt),
    dt: 2 * ot - s1.dt,
  });

  const x1 = obj1.getState().x;
  const x2 = obj2.getState().x;
  const y1 = obj1.getState().y;
  const y2 = obj2.getState().y;

  const cl = [
    { x: x1, y: y1 },
    { x: x2, y: y2 },
  ];

  const ol = [
    { x: y1, y: x1 },
    { x: y2, y: x2 },
  ];

  // const nl1 = [
  //   { x: , y: },
  //   { x: , y: },
  // ];

  const line = d3.line()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y));

  d3.select('#frame').append('path')
    .attr("d", line(cl))
    .attr("stroke", "blue")
    .attr("stroke-width", 1);

  d3.select('#frame').append('path')
    .attr("d", line(ol))
    .attr("stroke", "green")
    .attr("stroke-width", 1);
}

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

class Ball {
  constructor(x = 0, y = 0, dt = -Pi / 5, spd = 0.1, r = 0.5, fill = 'red') {
    this.r = r;
    this.x = x;
    this.y = y;
    this.spd = spd;
    this.dt = dt;
    this.dx = spd * cos(dt);
    this.dy = spd * sin(dt);
    this.fill = fill;
    this.id = null;
    this.dead = false;

    this.move = this.move.bind(this);
  }

  move(t) {
    this.x += this.spd * cos(this.dt);
    this.y += this.spd * sin(this.dt);
  }

  setId(id) {
    this.id = id;
  }

  getState() {
    return {
      type: 'circle',
      x: this.x,
      y: this.y,
      spd: this.spd,
      dt: this.dt,
      dx: this.dx,
      dy: this.dy,
      r: this.r,
      fill: this.fill,
      id: this.id,
    };
  }

  setState(newState) {
    for (var key in newState) {
      if (newState.hasOwnProperty(key)) {
        this[key] = newState[key];
      }
    }
  }
}

class App {
  constructor() {
    this.getFrame = this.getFrame.bind(this);
    this.update = this.update.bind(this);
    this.objects = [];
    this.timer = new Timer();
    this.timer.subscribe(this.getFrame);
  }

  getFrame() {
    const data = this.objects.map(ball1 => {
      const ball1State = ball1.getState();

      this.objects.forEach(ball2 => {
        if (ball1 === ball2) return;

        if (dist(ball1, ball2) < (ball1.r + ball2.r)) {
          collide(ball1, ball2);
        }
      })

      // bounce l/r wall
      if (ball1State.x > 10 || ball1State.x < -10) {
        ball1.setState({
          dt: Pi - ball1State.dt,
          x: ball1State.x < -10 ? -10 : 10,
        });
      }

      // bounce t/b wall
      if (ball1State.y > 10 || ball1State.y < -10) {
        ball1.setState({
          dt: -ball1State.dt,
          y: ball1State.y < -10 ? -10 : 10,
        });
      }

      return ball1;
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
    // add a ball
    d3.select('#btn-1').on('click', () => {
      const balls = [
        new Ball(-2, 2.6, -Pi / 4, 0.025, 1),
        new Ball(2, -2, 3 * Pi / 4, 0.025, 1),
      ];
      balls.forEach((b) => {
        b.setId(this.timer.subscribe(b.move));
        this.objects.push(b);
      });
    });
  }
}

const app = new App();
app.init();
