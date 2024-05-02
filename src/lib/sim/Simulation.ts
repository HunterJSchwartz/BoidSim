import { Vector } from './Vector.js';
import { Application, Sprite } from 'pixi.js';

import { get, writable } from 'svelte/store';

let boids: Boid[];
let width: number;
let height: number;

let canvas: HTMLCanvasElement;
let delta = 0;

const visionRad = 50;
const maxSpeed = writable(6);
const containForce = 0.25;
const centerForce = 0.000025;
const alignForce = writable(0.1);
const cohesionForce = writable(0.02);
const seperationForce = writable(0.04);
const size = 0.05;
const containPadding = 40;

function Initialize(count: number, can: HTMLCanvasElement, scene: Application) {
	boids = [];
	canvas = can;
	width = canvas.offsetWidth;
	height = canvas.offsetHeight;
	for (let i = 0; i < count; i++) {
		const pos = GetRandomPos(width, height);
		const vel = GetRandomVel(get(maxSpeed));
		const acc = new Vector(Math.random(), Math.random());
		const boid = new Boid(pos, vel, acc, scene);
		boids.push(boid);
	}

	addEventListener('resize', () => {
		if (canvas !== undefined) {
			width = canvas.offsetWidth;
			height = canvas.offsetHeight;
		}
	});
}

function UpdateBoids(frameDelta: number): void {
	delta = frameDelta;
	for (let i = 0; i < boids.length; i++) {
		boids[i].Update(boids);
	}
}

function GetRandomPos(width: number, height: number): Vector {
	return new Vector(Math.random() * width, Math.random() * height);
}

function GetRandomVel(maxSpeed: number): Vector {
	return new Vector((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2).Mult(
		Math.random() * (maxSpeed - 0.5) + 0.5
	);
}

class Boid {
	position: Vector;
	velocity: Vector;
	acceleration: Vector;
	sprite: Sprite;

	constructor(position: Vector, velocity: Vector, acceleration: Vector, scene: Application) {
		this.position = position;
		this.velocity = velocity;
		this.acceleration = acceleration;

		this.sprite = Sprite.from('/sprites/boid.png');
		this.sprite.anchor.set(0.5, 1);
		this.sprite.scale.x = size;
		this.sprite.scale.y = size;
		this.sprite.position.x = this.position.x;
		this.sprite.position.y = this.position.y;
		this.sprite.rotation = 0;
		scene.stage.addChild(this.sprite);
	}

	Update(boids: Boid[]): void {
		this.acceleration = this.acceleration
			.Add(this.PullCenter())
			.Add(this.Contain())
			.Add(this.Align(boids))
			.Add(this.Seperate(boids))
			.Add(this.Cohesion(boids));
		this.velocity = this.CapSpeed(this.velocity.Add(this.acceleration), get(maxSpeed));
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
		const center = new Vector(width / 2, height / 2);
		const dist = this.position.Distance(center);
		let dir: Vector = new Vector(center.x - this.position.x, center.y - this.position.y);
		dir = dir.Normalize().Mult(get(maxSpeed));
		dir = dir.Sub(this.velocity);
		dir = dir.Normalize().Mult(dist * centerForce);
		return dir;
	}

	Contain(): Vector {
		const left: number = this.position.x - containPadding;
		const right: number = this.position.x + containPadding;
		const bottom: number = this.position.y + containPadding;
		const top: number = this.position.y - containPadding;

		let dir: Vector = new Vector(0, 0);
		if (left < 0) {
			dir = dir.Add(new Vector(1, 0)).Mult(containForce);
		}
		if (right > width) {
			dir = dir.Add(new Vector(-1, 0)).Mult(containForce);
		}
		if (top < 0) {
			dir = dir.Add(new Vector(0, 1)).Mult(containForce);
		}
		if (bottom > height) {
			dir = dir.Add(new Vector(0, -1)).Mult(containForce);
		}
		return dir;
	}

	Align(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= visionRad && boid !== this) {
				dir = dir.Add(boid.velocity);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Normalize().Mult(get(maxSpeed));
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(get(alignForce));
		}
		return dir;
	}

	Seperate(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= visionRad && boid !== this) {
				let diff: Vector = this.position.Sub(boid.position);
				diff = diff.Div(dist * dist);
				dir = dir.Add(diff);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Normalize().Mult(get(maxSpeed));
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(get(seperationForce));
		}
		return dir;
	}

	Cohesion(boids: Boid[]): Vector {
		let dir: Vector = new Vector(0, 0);
		let localBoids = 0;
		for (const boid of boids) {
			const dist: number = this.position.Distance(boid.position);
			if (dist <= visionRad && boid !== this) {
				dir = dir.Add(boid.position);
				localBoids++;
			}
		}
		if (localBoids > 0) {
			dir = dir.Div(localBoids);
			dir = dir.Sub(this.position);
			dir = dir.Normalize().Mult(get(maxSpeed));
			dir = dir.Sub(this.velocity);
			dir = dir.Normalize().Mult(get(cohesionForce));
		}
		return dir;
	}
}

export { Initialize, UpdateBoids, maxSpeed, alignForce, seperationForce, cohesionForce };
