import P5 from "p5";
import EvolutionEnvironment from "../../shared/neat-env/EvolutionEnvironment";
import MessageConsumer from "../MessageConsumer";
import { IRenderable } from "./ItemRenderer";
import Vector from "../../shared/base/util/Vector";

class Bird {
  public get location(): Vector {
    return new Vector(this.x, this.y);
  }

  private maxForce = 0.2;
  private maxSpeed = 5;

  private acceleration: Vector = new Vector(0, 0);
  private velocity: Vector = new Vector(Math.random(), Math.random()).mult(Math.random() * 4);

  constructor(public x: number, public y: number) {}

  align(boids: Bird[]) {
    let perceptionRadius = 25;
    let steering = new Vector(0, 0);
    let total = 0;
    for (let other of boids) {
      let d = this.location.distance(other.location);
      if (other !== this && d < perceptionRadius) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.normalize().mult(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  separation(boids: Bird[]) {
    let perceptionRadius = 24;
    let steering = new Vector(0, 0);
    let total = 0;
    for (let other of boids) {
      let d = this.location.distance(other.location);
      if (other != this && d < perceptionRadius) {
        let diff = this.location.sub(other.location);
        diff.div(d * d);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.normalize().mult(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  cohesion(boids: Bird[]) {
    let perceptionRadius = 50;
    let steering = new Vector(0, 0);
    let total = 0;
    for (let other of boids) {
      let d = this.location.distance(other.location);
      if (other !== this && d < perceptionRadius) {
        steering.add(other.location);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.location);
      steering.normalize().mult(this.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(this.maxForce);
    }
    return steering;
  }

  update(p5: P5, birds: Bird[]) {
    // this.velocity = new Vector(0, 0);
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.acceleration.mult(0);

    this.edges(p5);

    let alignment = this.align(birds);
    let cohesion = this.cohesion(birds);
    let separation = this.separation(birds);

    alignment.mult(2);
    cohesion.mult(1);
    separation.mult(2);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  edges(p5: P5) {
    if (this.x > p5.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = p5.width;
    }
    if (this.y > p5.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = p5.height;
    }
  }

  draw(p5: P5) {
    p5.stroke("white");
    p5.strokeWeight(2);
    // p5.triangle(this.x, this.y, this.x - 3, this.y - 3, this.x + 3, this.y + 3);
    p5.line(this.x, this.y, this.x + this.acceleration.x * 5, this.y + this.acceleration.y * 5);
  }
}
const sketch = (p: P5) => {
  const t: P5 & any = p;
  t.items = [];

  p.setup = () => {
    p.createCanvas(800, 800);
    p.pixelDensity(1);
    for (let i = 0; i < 100; i++) {
      t.items.push(new Bird(Math.random() * p.width, Math.random() * p.height));
    }
  };

  p.draw = () => {
    if (t.headless) return;
    t.background(0);
    t.items.forEach((it: Bird) => {
      it.update(t, t.items);
      it.draw(t);
    });
  };
};

export default (ref: HTMLElement): P5 => new P5(sketch, ref);
