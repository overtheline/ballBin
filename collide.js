function collide(obj1, obj2) {
  const { r: r1, x: x1, y: y1, dx: dx1, dy: dy1 } = obj1;
  const { r: r2, x: x2, y: y2, dx: dx2, dy: dy2 } = obj2;

  const colnVec = new Vector(x2 - x1, y2 - y1);
  const dist = colnVec.length();

  const newState1 = { fill: 'blue' };
  const newState2 = { fill: 'blue' };

  if (dist < r1 + r2) {
    colnVec.normalize();
    colnVec.scale(r1 + r2 - dist);
    colnVec.negate();
    newState1.x = x1 + colnVec.vx;
    newState1.y = y1 + colnVec.vy;
  }

  const cx1 = newState1.x;
  const cy1 = newState1.y;

  const colnAngle = Math.atan2(cy1 - y2, cx1 - x2);

  const vec1 = new Vector(dx1, dy1);
  const vec2 = new Vector(dx2, dy2);

  const len1 = vec1.length();
  const len2 = vec2.length();

  const dirAngle1 = Math.atan2(vec1.vy, vec1.vx);
  const dirAngle2 = Math.atan2(vec2.vy, vec2.vx);

  vec1.vx = len2 * Math.cos(dirAngle2 - colnAngle);
  vec1.vy = len2 * Math.sin(dirAngle2 - colnAngle);

  vec2.vx = len1 * Math.cos(dirAngle1 - colnAngle);
  vec2.vy = len1 * Math.sin(dirAngle1 - colnAngle);

  vec1.rotate(colnAngle);
  vec2.rotate(colnAngle);

  newState1.dx = vec1.vx;
  newState1.dy = vec1.vy;

  newState2.dx = vec2.vx;
  newState2.dy = vec2.vy;

  return [newState1, newState2];
}
