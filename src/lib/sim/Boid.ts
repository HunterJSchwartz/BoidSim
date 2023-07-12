import { Sprite, Application } from 'pixi.js';
import { Vector } from './Vector';
import type { BoidSettings } from './Simulation';

export class Boid {
	position: Vector;
	velocity: Vector;
	acceleration: Vector;
	sprite: Sprite;
	sets: BoidSettings;
	width: number;
	height: number;
	containPadding = 25;
	delta = 0;

	constructor(
		position: Vector,
		velocity: Vector,
		acceleration: Vector,
		sets: BoidSettings,
		scene: Application,
		width: number,
		height: number
	) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;
		this.sets = sets;
		this.width = width;
		this.height = height;

		this.sprite = Sprite.from('/sprites/boid.png');
		this.sprite.anchor.set(0.5, 1);
		this.sprite.scale.x = this.sets.size;
		this.sprite.scale.y = this.sets.size;
		this.sprite.position.x = this.position.x;
		this.sprite.position.y = this.position.y;
		this.sprite.rotation = 0;
		scene.stage.addChild(this.sprite);
	}

	Update(boids: Boid[], delta: number): void {
		this.delta = delta;
		this.acceleration = this.acceleration
			.Add(this.PullCenter())
			.Add(this.Contain())
			.Add(this.Align(boids))
			.Add(this.Seperate(boids))
			.Add(this.Cohesion(boids));
		this.velocity = this.CapSpeed(this.velocity.Add(this.acceleration), this.sets.maxSpeed);
		this.position = this.position.Add(this.velocity.Mult(delta));

		this.sprite.position.x = this.position.x;
		this.sprite.position.y = this.position.y;

		this.sprite.rotation = Math.atan2(this.velocity.y, this.velocity.x) + Math.PI * 0.5;
	}

	CapSpeed(vec: Vector, maxSpeed: number): Vector {
		if (vec.GetMag() > maxSpeed) {
			return vec.Normalize().Mult(maxSpeed);
		} else {
			return vec;
		}
	}

	PullCenter(): Vector {
		const center = new Vector(this.width / 2, this.height / 2);
		const dist = this.position.Distance(center);
		let dir: Vector = new Vector(center.x - this.position.x, center.y - this.position.y);
		dir = dir.Normalize().Mult(this.sets.maxSpeed);
		dir = dir.Sub(this.velocity);
		dir = dir
			.Normalize()
			.Mult(this.sets.pullForce)
			.Mult(dist * this.sets.centerForce);
		return dir;
	}

	Contain(): Vector {
		const left: number = this.position.x - this.containPadding;
		const right: number = this.position.x + this.containPadding;
		const bottom: number = this.position.y + this.containPadding;
		const top: number = this.position.y - this.containPadding;

		let dir: Vector = new Vector(0, 0);
		if (left < 0) {
			dir = dir.Add(new Vector(1, 0)).Mult(this.sets.containForce);
		}
		if (right > this.width) {
			dir = dir.Add(new Vector(-1, 0)).Mult(this.sets.containForce);
		}
		if (top < 0) {
			dir = dir.Add(new Vector(0, 1)).Mult(this.sets.containForce);
		}
		if (bottom > this.height) {
			dir = dir.Add(new Vector(0, -1)).Mult(this.sets.containForce);
		}
		return dir;
	}

	Align(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= this.sets.visionRad && boid !== this) {
				dir = dir.Add(boid.velocity);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Normalize().Mult(this.sets.maxSpeed);
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(this.sets.pullForce).Mult(this.sets.alignForce);
		}
		return dir;
	}

	Seperate(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= this.sets.visionRad && boid !== this) {
				let diff: Vector = this.position.Sub(boid.position);
				diff = diff.Div(dist * dist);
				dir = dir.Add(diff);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Normalize().Mult(this.sets.maxSpeed);
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(this.sets.pullForce).Mult(this.sets.seperationForce);
		}
		return dir;
	}

	Cohesion(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= this.sets.visionRad && boid !== this) {
				dir = dir.Add(boid.position);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Sub(this.position);
			dir = dir.Normalize().Mult(this.sets.maxSpeed);
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(this.sets.pullForce).Mult(this.sets.cohesionForce);
		}
		return dir;
	}
}
