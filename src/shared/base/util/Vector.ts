export default class Vector {
  constructor(public x: number, public y: number) {}

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(vector: Vector) {
    this.x -= vector.x;
    this.y -= vector.y;
    return this;
  }

  copy() {
    return new Vector(this.x, this.y);
  }

  rotate(angle: number) {
    const x2 = Math.cos(angle) * this.x - Math.sin(angle) * this.y;
    const y2 = Math.sin(angle) * this.x + Math.cos(angle) * this.y;
    return new Vector(x2, y2);
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  angleBetween(vector: Vector) {
    return Math.acos(this.dot(vector) / (this.mag() * vector.mag()));
  }

  mult(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar: number) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  magSq() {
    return this.x * this.x + this.y * this.y;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  normalize() {
    return this.div(this.mag());
  }

  limit(max: number) {
    if (this.mag() > max) return this.normalize() && this.mult(max);
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  distance(vector: Vector) {
    let dx, dy;
    dx = this.x - vector.x;
    dy = this.y - vector.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
