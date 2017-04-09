class Vector {
  constructor(x,  y) {
    this.vx = x;
    this.vy = y;
  }

  scale(s) {
    this.vx *= s;
    this.vy *= s;
  }

  add(vec2) {
    this.vx += vec2.vx;
    this.vy += vec2.vy;
  }

  sub(vec2) {
    this.vx -= vec2.vx;
    this.vy -= vec2.vy;
  }

  negate() {
    this.vx = -this.vx;
    this.vy = -this.vy;
  }

  length() {
    return Math.sqrt(this.vx * this. vx + this.vy * this.vy);
  }

  lengthSquared() {
    return this.vx * this. vx + this.vy * this.vy;
  }

  normalize() {
    const len = Math.sqrt(this.vx * this. vx + this.vy * this.vy);

    if (len) {
      this.vx /= len;
      this.vy /= len;
    }

    return len;
  }

  rotate(angle) {
    const vx = this.vx;
    const vy = this.vy;
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);

    this.vx = vx * cosVal - vy * sinVal;
    this.vy = vx * sinVal + vy * cosVal;
  }
}
